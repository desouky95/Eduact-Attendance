import {WithProgressArgs, api, apiConfig} from '../api';

export const getTestAttempts = async (withProgress?: WithProgressArgs , page : number = 1) =>
  await api.get<TestAttemptsResponse>(
    `/attendence/offline/fetch/test-attempts?page=${page}`,
    {
      onDownloadProgress: withProgress?.onDownloadProgress,
    },
  );
