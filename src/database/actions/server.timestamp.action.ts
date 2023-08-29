import {getServerTimestamp} from 'src/api/timestamp/timestamp.api';
import {store} from 'src/store';
import {setInitialTimestamp} from 'src/store/databaseSetupReducer/databaseSetupReducer';

export const getServerTimestampAction = async () => {
  const dispatch = store.dispatch;
  const timestamp = await getServerTimestamp();
  dispatch(setInitialTimestamp(timestamp.data));
};
