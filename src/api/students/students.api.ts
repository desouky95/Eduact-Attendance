import {WithProgressArgs, api} from '../api';

export const getStudents = async (withProgress?: WithProgressArgs) => {
  return await api.get<InstructorStudentsResponse>(
    '/attendence/offline/fetch/students',
    {
      onDownloadProgress: withProgress?.onDownloadProgress,
    },
  );
};
