import {WithProgressArgs, api} from '../api';

export const getAttendance = async (withProgress?: WithProgressArgs) =>
  await api.get<{centerAttendence: ApiResponse<CenterAttendance[]>}>(
    '/attendence/offline/fetch/center-attendence',
    {
      onDownloadProgress: withProgress?.onDownloadProgress,
    },
  );
