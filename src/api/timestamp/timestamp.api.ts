import {api} from '../api';
export const getServerTimestamp = async () => await api.get<number>('now');
