import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';

import { AppNavigator } from '../components/MainScreen';

const firstAction = AppNavigator.router.getActionForPathAndParams('Main');
const initialNavState = AppNavigator.router.getStateForAction(firstAction.action);

function nav(state = initialNavState, action) {
  let nextState;
  switch (action.type) {
    case 'Login':
      nextState = AppNavigator.router.getStateForAction(NavigationActions.back(), state);
      break;
    case 'Logout':
      nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'Login' }), state);
      break;
    default:
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }

  return nextState || state;
}




const initialAuthState = { isLoggedIn: false, userInfo: {}};

function auth(state = initialAuthState, action) {
  switch (action.type) {
    case 'Login':
      return { userInfo:action.userInfo, isLoggedIn: true };
    case 'Register':
      return { userInfo:action.userInfo, isLoggedIn: true };
    case 'Logout':
      return { userInfo:action.userInfo, isLoggedIn: false };
    default:
      return state;
  }
}

const AppReducer = combineReducers({
	nav,
  	auth,
});

export default AppReducer;
