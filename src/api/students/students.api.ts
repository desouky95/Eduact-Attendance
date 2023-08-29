import {WithProgressArgs, api} from '../api';

export const getStudents = async (
  withProgress?: WithProgressArgs,
  page: number = 1,
) => {
  return await api.get<InstructorStudentsResponse>(
    `/attendence/offline/fetch/students?page=${page}`,
    {
      onDownloadProgress: withProgress?.onDownloadProgress,
    },
  );
};
