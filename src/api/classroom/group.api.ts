import {WithProgressArgs, api, apiConfig} from '../api';

export const getGroups = async (withProgress?: WithProgressArgs) =>
  await api.get<ApiResponse<Group[]>>('/classroom/groups/fetch/all', {
    onDownloadProgress: withProgress?.onDownloadProgress,
  });
