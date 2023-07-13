import {WithProgressArgs} from 'src/api/api';
import {Step} from 'src/store/databaseSetupReducer/databaseSetupReducer';
import {setupClassrooms} from './classroom.db.action';

type ActionsMap = {
  [key in Step]: (args?: WithProgressArgs) => Promise<any>;
};

export const actionsMap: ActionsMap = {
  classrooms: setupClassrooms,
};
