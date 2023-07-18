import {WithProgressArgs, api} from '../api';

export const getStudents = async (withProgress?: WithProgressArgs) =>
  await api.post<ApiResponse<InstructorCode[]>>(
    '/attendence/instructor/students',
    {
      onDownloadProgress: withProgress?.onDownloadProgress,
    },
  );
