import {WithProgressArgs, api} from '../api';

export const getAttendance = async (withProgress?: WithProgressArgs) => {
  return await api.get<{centerAttendence: ApiResponse<CenterAttendance[]>}>(
    '/attendence/offline/fetch/center-attendence',
    {
      onDownloadProgress: withProgress?.onDownloadProgress,
    },
  );
};
