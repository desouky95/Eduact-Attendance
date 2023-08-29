import React from 'react';
import withObservables from '@nozbe/with-observables';
import CenterAttendanceModel from 'src/database/models/CenterAttendanceModel';
import UserModel from 'src/database/models/UserModel';
import StudentModel from 'src/database/models/StudentModel';
import {TableRow, TableCell} from 'components/Table/Table';
import {HStack, VStack, Button, Box} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMd from 'react-native-vector-icons/MaterialIcons';
import {Typography} from 'components/Typography/Typography';
import {theme} from 'src/theme/theme';
import {database} from 'src/database';

type StudentDataRowUIProps = {
  attendance: CenterAttendanceModel;
  user?: UserModel;
  student?: StudentModel;
  onDelete?: (id: any) => void;
};

export const StudentDataRowUI = ({user, onDelete}: StudentDataRowUIProps) => {
  return (
    <TableRow>
      <TableCell>
        <Typography numberOfLines={1} style={{width: '100%'}}>
          {user?.first_name} {user?.last_name}
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
            onPress={() => onDelete?.(user?.sid)}
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
