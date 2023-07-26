import React, {useState, useEffect} from 'react';
import {getEnrollment} from 'src/database/data/enrollment.data';

export const useCourseEnrollment = (course_id: number, student_id: number) => {
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const subscription = getEnrollment(course_id, student_id).subscribe(
      value => {
        setIsEnrolled(value.length > 0);
      },
    );
    return () => subscription.unsubscribe()
  }, [course_id, student_id]);

  return {isEnrolled};
};
