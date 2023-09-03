import {Typography} from 'components/Typography/Typography';
import {Button} from 'native-base';
import {HStack} from 'native-base';
import React from 'react';
import {
  enrollStudent,
  unenrollStudent,
} from 'src/database/data/enrollment.data';
import UserModel from 'src/database/models/UserModel';
import {useCourseEnrollment} from 'src/hooks/useCourseEnrollment';
import {useSnackbar} from 'src/hooks/useSnackbar';
import {useAppSelector} from 'src/store';
import {theme} from 'src/theme/theme';

type Props = {
  student: UserModel;
  onCancel: () => void;
};
export const AttendanceActions = ({student, onCancel}: Props) => {
  const {openSnackbar} = useSnackbar();

  const current = useAppSelector(s => s.course.current);
  const {isEnrolled} = useCourseEnrollment(current?.sid!, student.sid);

  const handleEnroll = async () => {
    if (!current) return;
    try {
      await enrollStudent(current.sid, student.sid);
    } catch (error: any) {
      openSnackbar({
        message: error['message'],
        variant: 'error',
      });
    }
  };

  const handleUnEnroll = async () => {
    if (!current) return;
    try {
      await unenrollStudent(current.sid, student.sid);
    } catch (error: any) {
      openSnackbar({
        message: error['message'],
        variant: 'error',
      });
    }
  };
  return (
    <HStack  flex={1}  px="44" space="12px" alignItems="center" justifyContent="center" mb="2">
      {!isEnrolled && (
        <Button
          borderColor={'primary.main'}
          color="primary.main"
          outlineColor={'aqua'}
          backgroundColor={'primary.main'}
          size="md"
          height="10"
          borderRadius={'100px'}
          _pressed={{opacity: 0.8}}
          width={'1/2'}
          onPress={handleEnroll}>
          <Typography fontWeight={'bold'} color="#FFF">
            ENROLL
          </Typography>
        </Button>
      )}

      <Button
        colorScheme={'orange'}
        borderColor={'orange.500'}
        color="orange.main"
        outlineColor={'aqua'}
        // backgroundColor={'white'}
        size="md"
        height="10"
        borderRadius={'100px'}
        _pressed={{opacity: 0.8}}
        width={'1/2'}
        variant={'outline'}
        onPress={onCancel}>
        <Typography fontWeight={'bold'} color={theme.colors.warning[500]}>
          Cancel
        </Typography>
      </Button>
    </HStack>
  );
};
