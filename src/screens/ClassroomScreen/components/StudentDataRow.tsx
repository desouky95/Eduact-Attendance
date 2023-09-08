import React, {useEffect, useState} from 'react';
import withObservables from '@nozbe/with-observables';
import CenterAttendanceModel from 'src/database/models/CenterAttendanceModel';
import UserModel from 'src/database/models/UserModel';
import StudentModel from 'src/database/models/StudentModel';
import {TableRow, TableCell} from 'components/Table/Table';
import {HStack, VStack, Button, Box, Skeleton, useClipboard} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMd from 'react-native-vector-icons/MaterialIcons';
import {Typography} from 'components/Typography/Typography';
import {theme} from 'src/theme/theme';
import {useAppSelector} from 'src/store';
import {useStudentCourse} from 'src/hooks/useStudentCourse';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import {SwipeRow} from 'react-native-swipe-list-view';
import {Text} from 'react-native';
import {useStudentGroup} from 'src/hooks/useStudentGroup';
import {useSnackbar} from 'src/hooks/useSnackbar';
import Clipboard from '@react-native-clipboard/clipboard';

type StudentDataRowUIProps = {
  attendance: CenterAttendanceModel;
  user?: UserModel;
  student?: StudentModel;
  onDelete?: (id: any) => void;
};

const styles = StyleSheet.create({
  standaloneRowFront: {
    backgroundColor: '#FFF',
  },
  standaloneRowBack: {
    alignItems: 'center',
    backgroundColor: theme.colors.gray[200],
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export const StudentDataRowUI = ({
  user,
  onDelete,
  attendance,
  student,
  ...props
}: StudentDataRowUIProps) => {
  const {current} = useAppSelector(s => s.course);
  const {isLoading, isEnrolled} = useStudentCourse({
    course_id: current?.id,
    user_id: user?.id,
  });
  const {
    isSameGroup,
    isLoading: groupLoading,
    noGroupRef,
  } = useStudentGroup({
    user_id: user?.id,
  });

  const typeColor = () => {
    if (attendance.type === 'absent') return theme.colors.error[500];
    if (attendance.type === 'center') return theme.colors.primary.main;
    return theme.colors.orange[500];
  };

  const {fontScale} = useWindowDimensions();

  const {openSnackbar} = useSnackbar();
  return (
    <>
      
        <SwipeRow rightOpenValue={-60} closeOnRowPress={true} disableRightSwipe>
          <View style={styles.standaloneRowBack}>
            <Button
              bgColor="transparent"
              onPress={() => onDelete?.(user?.sid)}
              margin="0"
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
          </View>
          <View style={styles.standaloneRowFront}>
            <TableRow
              onPress={() => {
                Clipboard.setString(user?.username ?? '');
                openSnackbar({
                  message: `${user?.username} copied to clipboard`,
                  autoClose: true,
                  variant: 'primary',
                });
              }}>
              <>
                <>
                  <Box
                    top="0"
                    left="0"
                    zIndex="9"
                    height="full"
                    position="absolute"
                    bgColor={isEnrolled ? 'primary.main' : 'transparent'}
                    width="0.5"></Box>
                </>
                <TableCell>
                  <Typography numberOfLines={1} style={{width: '100%'}}>
                    {user?.first_name} {user?.last_name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    fontSize={'10px'}
                    numberOfLines={1}
                    color={typeColor()}>
                    {attendance.type}
                  </Typography>
                </TableCell>
                <TableCell>
                  {!isLoading && (
                    <>
                      {noGroupRef && (
                        <Typography numberOfLines={1}>-</Typography>
                      )}
                      {!noGroupRef && (
                        <>
                          {isSameGroup && (
                            <IconMd
                              size={fontScale * 18}
                              color={theme.colors.success[500]}
                              name={'check-box'}
                            />
                          )}
                          {!isSameGroup && (
                            <IconMd
                              size={fontScale * 18}
                              color={theme.colors.error[500]}
                              name={'cancel'}
                            />
                          )}
                        </>
                      )}
                    </>
                  )}
                </TableCell>
              </>
            </TableRow>
          </View>
        </SwipeRow>
    </>
  );
};

const enhanced = withObservables(['attendance'], ({attendance}) => {
  try {
    const user = attendance.user;
    const student = attendance.student;
    return {
      attendance,
      user,
      student,
    };
  } catch (error) {
    console.error(error);
  }
});

export const StudentDataRow = enhanced(StudentDataRowUI);
