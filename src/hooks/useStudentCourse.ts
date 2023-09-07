import {Q} from '@nozbe/watermelondb';
import {useDatabase} from '@nozbe/watermelondb/hooks';
import React, {useEffect, useState} from 'react';
import EnrolledCourseModel from 'src/database/models/EnrolledCourseModel';

type UseStudentCourseArgs = {
  user_id?: string;
  course_id?: string;
};
export const useStudentCourse = ({
  course_id,
  user_id,
}: UseStudentCourseArgs) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const database = useDatabase();
  const enrollmentQuery = database
    .get<EnrolledCourseModel>(EnrolledCourseModel.table)
    .query(
      Q.and(
        Q.where('user_id', user_id ?? null),
        Q.where('course_id', course_id ?? null),
      ),
    );

  useEffect(() => {
    setIsLoading(true);

    if (!course_id || !user_id) {
      return;
    }
    const subscription = enrollmentQuery.observe().subscribe(value => {
      setIsEnrolled(value.length > 0);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [course_id, user_id]);

  return {isLoading, isEnrolled};
};
