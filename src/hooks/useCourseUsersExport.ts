import {Q} from '@nozbe/watermelondb';
import {useDatabase} from '@nozbe/watermelondb/hooks';
import React, {useCallback, useState} from 'react';
import {PermissionsAndroid} from 'react-native';
import CenterAttendanceModel from 'src/database/models/CenterAttendanceModel';
import EnrolledCourseModel from 'src/database/models/EnrolledCourseModel';
import StudentModel from 'src/database/models/StudentModel';
import UserModel from 'src/database/models/UserModel';
import {jsonToCSV} from 'react-native-csv';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';

type UseCourseUsersExportArgs = {
  course_id?: string;
  ref_course_id: string | null;
};
export const useCourseUsersExport = ({
  course_id,
  ref_course_id,
}: UseCourseUsersExportArgs) => {
  const database = useDatabase();

  const [isLoading,setIsLoading] = useState(false)
  const loadData = useCallback(
    async (course_id: string, ref_course_id: string | null) => {
      // Base Tables
      const base = database.get<UserModel>(UserModel.table);
      const attendanceBase = database.get<CenterAttendanceModel>(
        CenterAttendanceModel.table,
      );
      const enrollmentBase = database.get<EnrolledCourseModel>(
        EnrolledCourseModel.table,
      );
      const users = await base.query().fetch();
      const mappedUsers = await Promise.all(
        users.map(async user => {
          // const [attendance] = await attendanceBase
          //   .query(
          //     Q.and(
          //       Q.where('courseId', ref_course_id ?? null),
          //       Q.where('studentId', user.id),
          //     ),
          //   )
          //   .fetch();
          // const [enrollment] = await enrollmentBase
          //   .query(
          //     Q.and(
          //       Q.where('course_id', course_id),
          //       Q.where('user_id', user.id),
          //     ),
          //   )
          //   .fetch();
          const student = (await user.student.fetch()) as any as StudentModel;
          return {user, student};
        }),
      );

      return mappedUsers;
    },
    [],
  );

  const handleExport = useCallback(async () => {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    ]);
    if (!granted) return;
    if (!course_id) return;
    setIsLoading(true)
    const data = await loadData(course_id, ref_course_id);
    setIsLoading(false)

    console.log('DATA', data);
    // const csvData = data.map(entry => ({
    //   name: `${entry.user.first_name} ${entry.user.last_name}`,
    //   username: entry.user.username,
    //   phone: `${entry.user.phone_number}`,
    //   parent_phone: entry.student.parent_phone,
    //   attendance: entry.attendance ? entry.attendance.type : '-',
    //   enrolled: entry.enrollment ? '&#x2611;' : '-',
    // }));

    // const csv = jsonToCSV(csvData);

    // const pathToWrite = `${
    //   RNFetchBlob.fs.dirs.DownloadDir
    // }/course-${course_id}-${Date.now()}.csv`;
    // console.log('pathToWrite', pathToWrite);
    // RNFetchBlob.fs
    //   .writeFile(pathToWrite, csv, 'utf8')
    //   .then(() => {
    //     Share.open({
    //       message: 'Attendance Data',
    //       url: `file://${pathToWrite}`,
    //       showAppsToView: true,
    //       filename: 'data',
    //       saveToFiles: true,
    //       type: 'text/csv',
    //     });
    //     // wrote file /storage/emul ated/0/Download/data.csv
    //   })
    //   .catch(error => console.error(error));
  }, [course_id, ref_course_id]);

  return {handleExport};
};
