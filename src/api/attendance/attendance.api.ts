import {WithProgressArgs, api} from '../api';

export const getAttendance = async (
  withProgress?: WithProgressArgs,
  page: number = 1,
  perPage: number = 50,
) => {
  return await api.get<{centerAttendence: ApiResponse<CenterAttendance[]>}>(
    `/attendence/offline/fetch/center-attendence?page=${page}&perPage=${perPage}`,
    {
      onDownloadProgress: withProgress?.onDownloadProgress,
    },
  );
};
