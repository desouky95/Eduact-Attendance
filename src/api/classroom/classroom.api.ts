import {WithProgressArgs, api, apiConfig} from '../api';

export const getClassrooms = async (withProgress?: WithProgressArgs) =>
  await api.get<ApiResponse<Classroom[]>>('/dropdown/classrooms', {
    onDownloadProgress: withProgress?.onDownloadProgress,
  });
