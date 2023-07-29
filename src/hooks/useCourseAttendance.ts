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
  last,
  takeLast,
} from 'rxjs';
import {finalize, mergeAll} from 'rxjs/operators';
import StudentModel from 'src/database/models/StudentModel';
import {database} from 'src/database';
import EnrolledClassroomModel from 'src/database/models/EnrolledClassroomModel';
import {Q} from '@nozbe/watermelondb';

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
  const [data, setData] = useState<AttendanceData[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!center_id) {
      setData([]);
      return;
    }

    const subscription = getCourseAttendance(
      center_id,
      online_id,
      group_id,
      type,
    )
      .pipe(
        // take(),
        mergeAll(),
        mergeMap(s =>
          zip(
            s.student.observe(),
            s.user.observe(),
            s.observe(),
            loadEnrollClassroom(s),
          ),
        ),
        map(value => ({
          student: value[0] as any as StudentModel,
          user: value[1] as any as UserModel,
          attendance: value[2],
          enrollment: value[3][0],
        })),
        scan((acc, v) => acc.concat(v), [] as AttendanceData[]),
      )
      .subscribe(value => {
        setData(prev => value);
      });

    return () => subscription.unsubscribe();
  }, [center_id, online_id, group_id, type]);


  return {
    attendance: data,
    total: data.length,
    isLoading,
  };
};
