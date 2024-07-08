import {api} from '../api';

export const getEnrollments = async (page: number = 1, perPage = 1000) => {
  return await api.get<EnrolledCourseResponse>(
    `/attendence/offline/fetch/enrolled-courses?page=${page}&perPage=${perPage}`,
  );
};

export const getClassroomEnrollments = async (
  page: number = 1,
  perPage = 1000,
) => {
  return await api.get<EnrolledClassroomResponse>(
    `/attendence/offline/fetch/enrolled-classrooms?page=${page}&perPage=${perPage}`,
  );
};
