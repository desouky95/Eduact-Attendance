import {Typography} from 'components/Typography/Typography';
import {Button, HStack} from 'native-base';
import React from 'react';
import {View} from 'react-native';
import {theme} from 'src/theme/theme';
import {useFormContext} from 'react-hook-form';
import {saveReference} from 'src/database/data/reference.data';
import CourseReferenceModel from 'src/database/models/CourseReferenceModel';
export const FormActions = ({reference}: {reference: CourseReferenceModel}) => {
  const {
    handleSubmit,
    formState: {isDirty},
    reset,
  } = useFormContext<ReferenceFormData>();

  const handleSubmitForm = handleSubmit(async (formData: ReferenceFormData) => {
    try {
      const updated = await reference.save(formData);
      reset({
        center_course_id: updated.center_course_id,
        homework_id: updated.homework_id,
        quiz_id: updated.quiz_id,
        online_classroom_id: updated.online_classroom_id,
        online_course_id: updated.online_course_id,
        online_homework_id: updated.online_homework_id,
        online_quiz_id: updated.online_quiz_id,
        course_id: updated.course_id,
        group_id: updated.group_id,
        id: updated.id,
      });
    } catch (error) {
      console.error(error);
    }
  });
  return (
    <View>
      <HStack py="18" px="44" space="12px">
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
          isDisabled={!isDirty}
          onPress={handleSubmitForm}>
          <Typography fontWeight={'bold'} color="#FFF">
            Save
          </Typography>
        </Button>
        <Button
          onPress={() => reset()}
          colorScheme={'orange'}
          borderColor={'orange.500'}
          color="orange.main"
          outlineColor={'aqua'}
          isDisabled={!isDirty}
          size="md"
          height="10"
          borderRadius={'100px'}
          _pressed={{opacity: 0.8}}
          width={'1/2'}
          variant={'outline'}>
          <Typography fontWeight={'bold'} color={theme.colors.warning[500]}>
            Cancel
          </Typography>
        </Button>
      </HStack>
    </View>
  );
};
