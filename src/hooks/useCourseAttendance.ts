import {fromPairs} from 'lodash';
import React, {useEffect, useState, useMemo} from 'react';
import {getCourseAttendance} from 'src/database/data/attendance.data';
import CenterAttendanceModel from 'src/database/models/CenterAttendanceModel';
import UserModel from 'src/database/models/UserModel';

type UseCourseAttendanceArgs = {
  center_id: number | null;
  online_id: number | null;
  group_id: number | null;
};
export const useCourseAttendance = ({
  center_id,
  group_id,
  online_id,
}: UseCourseAttendanceArgs) => {
  const [data, setData] = useState<CenterAttendanceModel[]>([]);
  const [attendanceWithUser, setAttendanceWithUser] = useState<
    {attendance: CenterAttendanceModel; user: UserModel}[]
  >([]);

  useEffect(() => {
    if (!center_id) {
      setData([]);
      return;
    }

    const subscription = getCourseAttendance(
      center_id,
      online_id,
      group_id,
    ).subscribe(value => {

      setData(() => value);
    });
    return () => subscription.unsubscribe();
  }, [center_id, group_id, online_id]);

  useEffect(() => {
    const loadStudent = (attendance: CenterAttendanceModel) => {
      const student = attendance.user.observe();
      return student;
    };

    const withStudents = data.map(c => {
      let student!: UserModel;
      loadStudent(c).subscribe(value => {
        student = value as any;
      });
      return {
        attendance: c,
        user: student,
      };
    });
    setAttendanceWithUser(withStudents);
  }, [data]);
  // }, [JSON.stringify(fromPairs(data as any))]);

  const center = useMemo(() => {
    return data.filter(_ => _.type === 'center').length;
  }, [attendanceWithUser]);

  const online = useMemo(() => {
    return data.filter(_ => _.type === 'online').length;
  }, [attendanceWithUser]);

  const absent = useMemo(() => {
    return attendanceWithUser.filter(_ => _.attendance.type === 'absent')
      .length;
  }, [attendanceWithUser]);
  // }, [JSON.stringify(fromPairs(students as any))]);

  return {
    attendance: data,
    total: data.length,
    attendanceWithUser,
    center,
    online,
    absent,
  };
};
