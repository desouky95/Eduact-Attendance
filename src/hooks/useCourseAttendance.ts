import React, {useEffect, useState, useMemo} from 'react';
import {getCourseAttendance} from 'src/database/data/attendance.data';
import CenterAttendanceModel from 'src/database/models/CenterAttendanceModel';
import UserModel from 'src/database/models/UserModel';
import {
  map,
  zip,
  mergeMap,
  scan,
  reduce,
  switchMap,
  take,
  from,
  toArray,
  of,
  last,
  takeLast,
  Subject,
  takeUntil,
  Observable,
  forkJoin,
  flatMap,
  firstValueFrom,
} from 'rxjs';
import {finalize, mergeAll} from 'rxjs/operators';
import StudentModel from 'src/database/models/StudentModel';
import {database} from 'src/database';
import EnrolledClassroomModel from 'src/database/models/EnrolledClassroomModel';
import {Q} from '@nozbe/watermelondb';
import {useFocusEffect} from '@react-navigation/native';
import {jsonReplacer} from 'src/utils/jsonReplacer';

const loadEnrollClassroom = (attendance: CenterAttendanceModel) => {
  return database
    .get<EnrolledClassroomModel>(EnrolledClassroomModel.table)
    .query(
      Q.and(
        Q.where('user_id', attendance.studentId.toString()),
        Q.where('classroom_id', attendance.classroomId.toString()),
      ),
    )
    .observe();
};

type UseCourseAttendanceArgs = {
  center_id: number | null;
  online_id: number | null;
  group_id: number | null;
  type: string | null;
};

type AttendanceData = {
  attendance: CenterAttendanceModel;
  user: UserModel;
  student: StudentModel;
  enrollment: EnrolledClassroomModel;
};

export const useCourseAttendance = ({
  center_id,
  group_id,
  online_id,
  type,
}: UseCourseAttendanceArgs) => {
  const [data, setData] = useState<CenterAttendanceModel[]>([]);
  const [dataWithRelations, setDataWithRelations] = useState<AttendanceData[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      if (!center_id) {
        setData([]);
        return;
      }
      setIsLoading(true);
      const subscription = getCourseAttendance(
        center_id,
        online_id,
        group_id,
        type,
      ).subscribe(async value => {
        setData(value);
        try {
          getWithRelations(value).then(value => {
            setDataWithRelations(value);
            setIsLoading(false);
          });
        } catch (error) {
          console.error(error);
        }
      });

      return () => subscription.unsubscribe();
    }, [center_id, online_id, group_id, type]),
  );

  const getWithRelations = async (data: CenterAttendanceModel[]) => {
    let withRelations = [];
    for (let index = 0; index < data.length; index++) {
      const attendance = data[index];
      const user = (await attendance.user.fetch()) as any as UserModel;
      const student = (await attendance.student.fetch()) as any as StudentModel;
      const [enrollment] = (await firstValueFrom(
        loadEnrollClassroom(attendance),
      )) as any as EnrolledClassroomModel[];

      withRelations.push({attendance, student, user, enrollment});
    }

    return withRelations;
  };

  return {
    attendance: dataWithRelations,
    total: data.length,
    isLoading
  };
};
