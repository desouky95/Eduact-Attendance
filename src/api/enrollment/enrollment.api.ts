import {api} from '../api';

export const getEnrollments = async () => {
  return await api.get<EnrolledCourseResponse>(
    '/attendence/offline/fetch/enrolled-courses',
  );
};


export const getClassroomEnrollments = async () => {
  return await api.get<EnrolledClassroomResponse>(
    '/attendence/offline/fetch/enrolled-classrooms',
  );
};
