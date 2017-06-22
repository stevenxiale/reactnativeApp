import React,{ PropTypes } from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';

import LoginScreen from '../components/LoginScreen';
import MainScreen from '../components/MainScreen';
import DetailScreen from '../components/DetailScreen';
import RegisterScreen from '../components/RegisterScreen';


export const AppNavigator = StackNavigator({
	Login: { screen: LoginScreen },
	Main: { screen: MainScreen },
	Detail: { screen: DetailScreen },
	Register: { screen: RegisterScreen},
},{
	initialRouteName:'Main',
});

// export default AppNavigator;

const AppWithNavigationState = ({ dispatch, nav }) => (
  <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
);

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);