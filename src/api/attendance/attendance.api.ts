import {WithProgressArgs, api} from '../api';

export const getAttendance = async (
  withProgress?: WithProgressArgs,
  page: number = 1,
) => {
  return await api.get<{centerAttendence: ApiResponse<CenterAttendance[]>}>(
    `/attendence/offline/fetch/center-attendence?page=${page}`,
    {
      onDownloadProgress: withProgress?.onDownloadProgress,
    },
  );
};
