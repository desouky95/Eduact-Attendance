import {Q} from '@nozbe/watermelondb';
import React, {useEffect, useState} from 'react';
import {database} from 'src/database';
import {getCourse} from 'src/database/data/classrooms.data';
import CenterAttendanceModel from 'src/database/models/CenterAttendanceModel';
import CourseModel from 'src/database/models/Course';
import TestAttemptModel from 'src/database/models/TestAttemptModel';
import TestModel from 'src/database/models/TestModel';
import UnitModel from 'src/database/models/UnitModel';

const observable = (id: string | null) =>
  database
    .get<TestAttemptModel>(TestAttemptModel.table)
    .query(Q.on('tests', Q.where('unit_id', id)))
    .observe();

export const useAttendancePerformance = (attendance: CenterAttendanceModel) => {
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(true);
  const [isLoadingHomework, setIsLoadingHomework] = useState(true);
  const [quiz, setQuiz] = useState<TestAttemptModel | undefined>();
  const [homework, setHomework] = useState<TestAttemptModel | undefined>();
  const [course, setCourse] = useState<CourseModel | undefined>();

  useEffect(() => {
    const quizSubscription = observable(attendance.quizId).subscribe(value => {
      setQuiz(value[0]);
      setIsLoadingQuiz(false);
    });
    const homeworkSubscription = observable(attendance.homeworkId).subscribe(
      value => {
        setHomework(value[0]);
        setIsLoadingHomework(false);
      },
    );
    const courseSubscription = getCourse(Number(attendance.courseId)).subscribe(
      value => {
        setCourse(value[0]);
      },
    );

    return () => {
      quizSubscription.unsubscribe();
      homeworkSubscription.unsubscribe();
      courseSubscription.unsubscribe();
    };
  }, [attendance.id]);

  return {
    quiz,
    homework,
    course,
    isLoading: isLoadingHomework && isLoadingQuiz,
  };
};
