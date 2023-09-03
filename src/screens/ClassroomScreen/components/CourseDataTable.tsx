import {Table, TableMemo} from 'components/Table/Table';
import {Typography} from 'components/Typography/Typography';
import React, {
  PropsWithChildren,
  Reducer,
  useEffect,
  useReducer,
  useState,
} from 'react';
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
import {EdButton} from 'components/EdButton/EdButton';
import {useAttendanceExport} from 'src/hooks/useAttendanceExport';
import {debounce} from 'lodash';
import {useFocusEffect} from '@react-navigation/native';

type Props = {group_id?: number; type: string | null};
type ReducerArgs = {page?: number; perPage?: number; search?: string};

export const CourseDataTable = ({group_id, type = null}: Props) => {
  const ref = useAppSelector(s => s.course.currentReference);

  const [search, setSearch] = useState('');

  const [data, dispatch] = useReducer<Reducer<ReducerArgs, ReducerArgs>, any>(
    (state, action) => ({...state, ...action}),
    {page: 1, perPage: 20, search: ''},
    args => ({page: 1, perPage: 20, search: ''}),
  );

  const handleOnSearchChange = (text: string) => {
    setSearch(text);
  };
  const updateData = debounce((value, dispatch) => {
    dispatch({search: value, page: 1});
  }, 400);

  useEffect(() => {
    updateData(search, dispatch);
  }, [search]);

  useEffect(() => {
    dispatch({page: 1});
  }, [type]);

  useFocusEffect(
    React.useCallback(() => {
      dispatch({page: 1, search: ''});
      setSearch('');
    }, []),
  );

  const {attendance, isLoading, pages} = useCourseAttendance({
    center_id: ref?.center_course_id ?? null,
    online_id: ref?.online_course_id ?? null,
    group_id: group_id ?? null,
    type,
    page: data.page,
    perPage: data.perPage,
    search: data.search,
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
      throw new Error(error['message']);
    }
  };

  const {exportData} = useAttendanceExport({
    attendance,
  });

  const handleCancelDelete = () => {
    setIsOpen(false);
    setToBeDeleted(undefined);
  };

  const handleExport = async () => {
    await exportData();
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

      {/* {attendance.length > 0 && !isLoading && ( */}
      <VStack>
        <Table
          onSearchChange={handleOnSearchChange}
          searchValue={search}
          withExport
          onExport={handleExport}
          columns={['head 1', 'head 2', 'head 3', 'head 4', 'head 5', 'head 6']}
          data={attendance}>
          {({item, index}) => {
            return (
              <>
                {attendance.length && !isLoading && (
                  <StudentDataRow
                    onDelete={handleOnRemove}
                    key={`${item.courseId}-${item.studentId}-${index}`}
                    attendance={item}
                  />
                )}
                {isLoading && (
                  <Box p="1">
                    <Skeleton width="100%" borderRadius={'5'} h="10" mb="0.5" />
                  </Box>
                )}
              </>
            );
          }}
        </Table>
        {!isLoading && attendance.length > 0 && (
          <HStack
            width="100%"
            justifyContent={'space-between'}
            mt="2"
            mb="2"
            alignItems="center">
            <EdButton
              disabled={data.page === 1}
              isDisabled={data.page === 1}
              onPress={() => dispatch({page: data.page! - 1})}>
              Prev
            </EdButton>
            <Typography>
              {data.page} of {pages}
            </Typography>

            <EdButton
              isDisabled={data.page == pages}
              onPress={() => dispatch({page: data.page! + 1})}>
              Next
            </EdButton>
          </HStack>
        )}
        {isLoading && (
          <Skeleton width="100%" borderRadius={'5'} h="12" mb="2" mt="2" />
        )}
      </VStack>
      {/* )} */}
    </>
  );
};
