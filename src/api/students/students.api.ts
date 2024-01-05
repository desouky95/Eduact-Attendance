import {WithProgressArgs, api} from '../api';

export const getStudents = async (
  withProgress?: WithProgressArgs,
  page: number = 1,
  perPage = 1000
) => {
  return await api.get<InstructorStudentsResponse>(
    `/attendence/offline/fetch/students?page=${page}&perPage=${perPage}`,
    {
      onDownloadProgress: withProgress?.onDownloadProgress,
    },
  );
};
