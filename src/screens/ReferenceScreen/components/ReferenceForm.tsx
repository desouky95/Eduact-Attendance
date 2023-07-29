import React from 'react';
import CourseReferenceModel from 'src/database/models/CourseReferenceModel';
import {OfflineOptions} from './OfflineOptions';
import {OnlineOptions} from './OnlineOptions';
import {FormProvider, useForm, useFormContext} from 'react-hook-form';
import {Box} from 'native-base';
import {FormActions} from './FormActions';
import {View, ScrollView} from 'react-native';
import {Spacer} from 'components/Spacer/Spacer';
import {theme} from 'src/theme/theme';
import {object, number, string} from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
const schema = object({
  center_course_id: number().optional().nullable(),
  course_id: number().optional().nullable(),
  homework_id: number().optional().nullable(),
  online_classroom_id: number().optional().nullable(),
  online_course_id: number().optional().nullable(),
  id: string().optional(),
  online_homework_id: number().optional().nullable(),
  online_quiz_id: number().optional().nullable(),
  quiz_id: number().optional().nullable(),
});
export const ReferenceForm = ({
  reference,
}: {
  reference: CourseReferenceModel;
}) => {
  const form = useForm<ReferenceFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      center_course_id: reference.center_course_id,
      course_id: reference.course_id,
      homework_id: reference.homework_id,
      online_classroom_id: reference.online_classroom_id,
      online_course_id: reference.online_course_id,
      id: reference.id,
      online_homework_id: reference.online_homework_id,
      online_quiz_id: reference.online_quiz_id,
      quiz_id: reference.quiz_id,
      group_id : reference.group_id
    },
  });
  return (
    <Box flex={1}>
      <FormProvider {...form}>
        <ScrollView style={{maxHeight: '90%'}}>
          <Box pt="20px" pb="10px" px="20px">
            <OfflineOptions />
            <Spacer my={3} />
            <OnlineOptions />
          </Box>
        </ScrollView>
        <Box backgroundColor="gray.50" zIndex={44} style={{width: '100%'}}>
          <FormActions reference={reference} />
        </Box>
      </FormProvider>
    </Box>
  );
};
