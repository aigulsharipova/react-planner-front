import { combineReducers } from 'redux';
import user from './user';
import common from './common';
import tasks from './tasks';

export default combineReducers({
    user,
    common,
    tasks
});