import {Table, TableMemo} from 'components/Table/Table';
import {Typography} from 'components/Typography/Typography';
import React from 'react';
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

type Props = {group_id?: number};

export const CourseDataTable = ({group_id}: Props) => {
  const ref = useAppSelector(s => s.course.currentReference);

  const {attendanceWithUser} = useCourseAttendance({
    center_id: ref?.center_course_id ?? null,
    online_id: ref?.online_course_id ?? null,
    group_id: group_id ?? null,
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
      await removeStudentAttendance(
        toBeDeleted,
        (ref.center_course_id ?? ref.online_course_id) as any,
      );
      setIsOpen(false);
      setToBeDeleted(undefined);
    } catch (error) {}
  };

  const handleCancelDelete = () => {
    setIsOpen(false);
    setToBeDeleted(undefined);
  };

  const handleExport = () => {
    const data = attendanceWithUser.map(_ => ({
      name: `${_.user.first_name} ${_.user.last_name}`,
    }));
    const csv = jsonToCSV(data);
    console.log('csv', csv);
    const pathToWrite = `${RNFetchBlob.fs.dirs.DownloadDir}/data.csv`;
    console.log('pathToWrite', pathToWrite);
    RNFetchBlob.fs
      .writeFile(pathToWrite, csv, 'utf8')
      .then(() => {
        console.log(`wrote file ${pathToWrite}`);
        Share.open({
          message: 'Attendance Data',
          url: `file:/${pathToWrite}`,
          showAppsToView: true,
          filename: 'data',
          saveToFiles: true,
          type: 'text/csv',
        });
        // wrote file /storage/emulated/0/Download/data.csv
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
      {attendanceWithUser.length > 0 && (
        <Table
          withExport
          onExport={handleExport}
          columns={['head 1', 'head 2', 'head 3', 'head 4', 'head 5', 'head 6']}
          data={attendanceWithUser}>
          {({TableCell, TableRow, item, index}) => {
            return (
              <TableRow
                key={`${item.attendance.courseId}-${item.attendance.studentId}-${index}`}>
                <TableCell>
                  <Typography numberOfLines={1} style={{width: '100%'}}>
                    {item?.user?.first_name} {item?.user?.last_name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <HStack
                    w="100%"
                    justifyContent="space-between"
                    px={5}
                    alignItems="center">
                    <Button
                      bgColor="transparent"
                      _pressed={{
                        opacity: 0.5,
                      }}>
                      <VStack space={0} justifyContent="center">
                        <Icon
                          size={24}
                          name="eye-outline"
                          color={theme.colors.primary.main}
                        />
                        <Typography
                          fontSize={'10px'}
                          numberOfLines={1}
                          color={theme.colors.primary.main}>
                          View
                        </Typography>
                      </VStack>
                    </Button>
                    <Button
                      onPress={() => handleOnRemove(item?.user?.sid)}
                      bgColor="transparent"
                      _pressed={{
                        opacity: 0.5,
                      }}>
                      <VStack space={0} alignItems="center">
                        <IconMd
                          size={24}
                          name="highlight-remove"
                          color={theme.colors.warning[600]}
                        />
                        <Typography
                          fontSize={'10px'}
                          numberOfLines={1}
                          color={theme.colors.warning[600]}>
                          Remove
                        </Typography>
                      </VStack>
                    </Button>
                  </HStack>
                </TableCell>
              </TableRow>
            );
          }}
        </Table>
      )}
    </>
  );
};
