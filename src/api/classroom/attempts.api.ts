import {WithProgressArgs, api, apiConfig} from '../api';

export const getTestAttempts = async (withProgress?: WithProgressArgs) =>
  await api.get<TestAttemptsResponse>(
    '/attendence/offline/fetch/test-attempts',
    {
      onDownloadProgress: withProgress?.onDownloadProgress,
    },
  );
