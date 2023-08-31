import {api} from '../api';

export const getEnrollments = async (page: number = 1) => {
  return await api.get<EnrolledCourseResponse>(
    `/attendence/offline/fetch/enrolled-courses?page=${page}`,
  );
};

export const getClassroomEnrollments = async (page: number = 1) => {
  return await api.get<EnrolledClassroomResponse>(
    `/attendence/offline/fetch/enrolled-classrooms?page=${page}`,
  );
};
