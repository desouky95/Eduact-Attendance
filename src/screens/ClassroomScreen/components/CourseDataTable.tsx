import {Table, TableMemo} from 'components/Table/Table';
import {Typography} from 'components/Typography/Typography';
import React, {PropsWithChildren} from 'react';
import {useCourseAttendance} from 'src/hooks/useCourseAttendance';
import {useAppSelector} from 'src/store';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMd from 'react-native-vector-icons/MaterialIcons';
import {Button, Flex, HStack, Modal} from 'native-base';
import {theme} from 'src/theme/theme';
import {VStack} from 'native-base';
import {removeStudentAttendance} from 'src/database/data/attendance.data';
import {jsonToCSV} from 'react-native-csv';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';
import {StudentDataRow} from './StudentDataRow';
import UserModel from 'src/database/models/UserModel';
import StudentModel from 'src/database/models/StudentModel';
import {PermissionsAndroid} from 'react-native';
import {Box} from 'native-base';
import {Skeleton} from 'native-base';

type Props = {group_id?: number; type: string | null};

export const CourseDataTable = ({group_id, type = null}: Props) => {
  const ref = useAppSelector(s => s.course.currentReference);

  const {attendance, isLoading} = useCourseAttendance({
    center_id: ref?.center_course_id ?? null,
    online_id: ref?.online_course_id ?? null,
    group_id: group_id ?? null,
    type,
  });

  const [isOpen, setIsOpen] = React.useState(false);
  const [toBeDeleted, setToBeDeleted] = React.useState<number | undefined>();
  async function handleOnRemove(student_id: number) {
    if (!ref) return;
    if (!ref.center_course_id && !ref.online_course_id) return;
    setToBeDeleted(student_id);
    setIsOpen(true);
  }
  const handleDelete = async () => {
    if (!ref || !toBeDeleted) return;
    if (!ref.center_course_id && !ref.online_course_id) return;
    try {
      const record = await removeStudentAttendance(
        toBeDeleted,
        (ref.center_course_id ?? ref.online_course_id) as any,
      );
      setIsOpen(false);
      setToBeDeleted(undefined);
    } catch (error) {
      throw new Error(error['message'])
    }
  };

  const handleCancelDelete = () => {
    setIsOpen(false);
    setToBeDeleted(undefined);
  };

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
  const handleExport = async () => {
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

  return (
    <>
      <Modal isOpen={isOpen} width={'100%'}>
        <Modal.Content width="100%" px={10} py={6}>
          {/* <Modal.CloseButton /> */}
          <Modal.Body>
            <Typography fontWeight={600} lineHeight={'20px'}>
              Are you sure you want to remove this Username from this lecture?
            </Typography>
          </Modal.Body>
          <Modal.Footer width="100%">
            <HStack px={4} width="100%" justifyContent="space-between">
              <Button
                onPress={handleDelete}
                variant={'ghost'}
                colorScheme={'primary'}
                _text={{fontWeight: 600}}>
                Yes
              </Button>
              <Button
                onPress={handleCancelDelete}
                variant="ghost"
                colorScheme="warning"
                _text={{fontWeight: 600}}>
                No
              </Button>
            </HStack>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      {attendance.length > 0 && !isLoading && (
        <Table
          withExport
          onExport={handleExport}
          columns={['head 1', 'head 2', 'head 3', 'head 4', 'head 5', 'head 6']}
          data={attendance}>
          {({item, index}) => {
            return (
              <StudentDataRow
                onDelete={handleOnRemove}
                key={`${item.courseId}-${item.studentId}-${index}`}
                attendance={item}
              />
            );
          }}
        </Table>
      )}
      {isLoading && <Skeleton width="100%" borderRadius={'5'} h="40" />}
    </>
  );
};
