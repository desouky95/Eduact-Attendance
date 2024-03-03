import {WithProgressArgs, api, apiConfig} from '../api';

export const getTestAttempts = async (
  withProgress?: WithProgressArgs,
  page: number = 1,
  perPage = 1000,
) =>
  await api.get<TestAttemptsResponse>(
    `/attendence/offline/fetch/test-attempts?page=${page}&perPage=${perPage}`,
    {
      onDownloadProgress: withProgress?.onDownloadProgress,
    },
  );
