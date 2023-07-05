import {api} from '../api';

export const login = async (payload: AuthPayload) =>
  await api.post<ApiResponse<AuthResponse>>('/auth/login', payload);
