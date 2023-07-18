import {WithProgressArgs, api, apiConfig} from '../api';

export const getClassrooms = async (withProgress?: WithProgressArgs) =>
  await api.get<ApiResponse<Classroom[]>>('/attendence/instructor/classrooms', {
    onDownloadProgress: withProgress?.onDownloadProgress,
  });
