import { combineReducers } from 'redux';
import newUser from './loginReducer';

const Reducers = combineReducers({
  username: newUser,
});

export default Reducers;
