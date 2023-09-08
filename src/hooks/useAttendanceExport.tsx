import React from 'react';
import {PermissionsAndroid} from 'react-native';
import CenterAttendanceModel from 'src/database/models/CenterAttendanceModel';
import {jsonToCSV} from 'react-native-csv';
import RNFetchBlob from 'rn-fetch-blob';
import UserModel from 'src/database/models/UserModel';
import StudentModel from 'src/database/models/StudentModel';
import Share from 'react-native-share'
type UseAttendanceExportArgs = {
  attendance: CenterAttendanceModel[];
};

export const useAttendanceExport = ({attendance}: UseAttendanceExportArgs) => {
  const loadExportData = async () => {
    const data = await Promise.all(
      attendance.map(async attendance => ({
        user: (await attendance.user.fetch()) as any as UserModel,
        student: (await attendance.student.fetch()) as any as StudentModel,
        attendance,
      })),
    );

    return data;
  };

  const exportData = async () => {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    ]);
    if (!granted) return;

    const loadedData = await loadExportData();
    const data = loadedData.map(_ => ({
      username: _.user.username,
      name: `${_.user.first_name} ${_.user.last_name}`,
      phone: _.user.phone_number,
      status: _.attendance.type,
      parent: _.student.parent_phone,
    }));

    const csv = jsonToCSV(data);
    const pathToWrite = `${
      RNFetchBlob.fs.dirs.DownloadDir
    }/data-${Date.now()}.csv`;
    console.log('pathToWrite', pathToWrite);
    let filename;
    // if(Platform)
    RNFetchBlob.fs
      .writeFile(pathToWrite, csv, 'utf8')
      .then(() => {
        Share.open({
          message: 'Attendance Data',
          url: `file://${pathToWrite}`,
          showAppsToView: true,
          filename: 'data',
          saveToFiles: true,
          type: 'text/csv',
        });
        // wrote file /storage/emul ated/0/Download/data.csv
      })
      .catch(error => console.error(error));
  };

  return {exportData};
};
