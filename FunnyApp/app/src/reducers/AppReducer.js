import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';
import {
  AsyncStorage,
} from 'react-native';

import { AppNavigator } from '../components/MainScreen';
import Storage from '../util/Storage';

const firstAction = AppNavigator.router.getActionForPathAndParams('Main');
const initialNavState = AppNavigator.router.getStateForAction(firstAction.action);

function nav(state = initialNavState, action) {
  let nextState;
  switch (action.type) {
    case 'Logout':
      nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'Login' }), state);
      break;
    default:
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }

  return nextState || state;
}


const initialAuthState = { isLoggedIn: false, userInfo: {},loginToken: null };

function auth(state = initialAuthState, action) {
  switch (action.type) {
    case 'Login':
      let loginState = {
        loginToken:action.userData.loginToken,
        userId:action.userData.user.id,
      }
      Storage.setItem('loginState',JSON.stringify(loginState));
      Storage.setItem('userInfo',JSON.stringify(action.userData.user));
      return { userInfo:action.userData.user, loginToken:action.userData.loginToken, isLoggedIn: true };
    case 'Register':
      let loginState2 = {
          loginToken:action.userData.loginToken,
          userId:action.userData.user.id,
        }
      Storage.setItem('loginState',JSON.stringify(loginState2));
      Storage.setItem('userInfo',JSON.stringify(action.userData.user));
      return { userInfo:action.userData.user, loginToken:action.userData.loginToken, isLoggedIn: true };
    case 'updateGold':
      state.userInfo.gold = action.gold;
      return state;
    case 'AddDay':
      state.userInfo.deadline = action.deadline;
      return state;
    case 'UpdateVersion':
      state.userInfo.version = action.version;
      return state;
    case 'Logout':
      Storage.delete('loginState');
      Storage.delete('userInfo');
      return { userInfo:{}, loginToken:null, isLoggedIn: false };
    default:
      return state;
  }
}

const AppReducer = combineReducers({
	nav,
  auth,
});

export default AppReducer;
