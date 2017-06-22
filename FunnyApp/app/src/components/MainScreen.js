import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TabNavigator, StackNavigator, addNavigationHelpers } from 'react-navigation';
import LoginScreen from './LoginScreen';
import DetailScreen from './DetailScreen';
import RegisterScreen from './RegisterScreen';
import VideoScreen from './main/main_video';
import MineScreen from './main/main_mine';
import TextScreen from './main/main_text';
import RechargeScreen from './RechargeScreen';
import ExchangeScreen from './ExchangeScreen';
import SettingScreen from './SettingScreen';
import CollectScreen from './CollectScreen';
import UpdateInfoScreen from './UpdateInfoScreen';

const MyVideoScreen = ({navigation}) => (
  <VideoScreen navigation = {navigation}/>
);
MyVideoScreen.navigationOptions = {
  tabBarLabel: '视频',
  tabBarIcon: ({ tintColor }) => (
    <Image
      source={require('./images/video.png')}
      style={[styles.icon, {tintColor: tintColor}]}
    />
  ),
  navigationOptions: ({navigation}) => ({
    title: ('${navigation.state.params.name}'+'s Profile'),
  }),
};

const MyImageScreen = ({ navigation }) => (
  <TextScreen navigation={navigation} category={'imageScreen'}/>
);
MyImageScreen.navigationOptions = {
    tabBarLabel: '图片',
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('./images/image.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
};

const MyTextScreen = ({ navigation }) => (
 <TextScreen navigation={navigation} category={'textScreen'}/>
);
MyTextScreen.navigationOptions = {
    tabBarLabel: '小说',
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('./images/text.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
};

const MyCenterScreen = ({ navigation }) => (
  <MineScreen navigation={navigation}/>
);
MyCenterScreen.navigationOptions = {
  tabBarLabel: '我的',
  tabBarIcon: ({ tintColor }) => (
    <Image
      source={require('./images/center.png')}
      style={[styles.icon, {tintColor: tintColor}]}
    />
  ),
};

const styles = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
  },
  container:{
    marginTop:Platform.OS === 'ios' ? 20 : 0,
  }
});

const MainScreen = TabNavigator({
  Video: {
    screen: MyVideoScreen,
    path: '',
  },
  Image: {
    screen: MyImageScreen,
    path: 'cart',
  },
  Text: {
    screen: MyTextScreen,
    path: 'text',
  },
  Mine: {
    screen: MyCenterScreen,
    path: 'userCenter',
  },
}, {
  tabBarOptions: {
    activeTintColor: 'green',
    inactiveTintColor:'#666',
    labelStyle:{
      fontSize: 10,
      margin:0,
      marginTop:4,
      marginBottom:4,
    },
    style:{
      backgroundColor:'#fff',
    },
    indicatorStyle:{
      backgroundColor:'#05A5D1',
      height:0,
    },
  	showIcon:true,
  	tabStyle:{
  		padding:0,
  		height:50,
  	}
  },
  swipeEnabled: true,
  tabBarPosition:'bottom',
});

MainScreen.navigationOptions = {
	title:'首页',
  headerStyle:{
    backgroundColor:'#fff',
  },
  headerTitleStyle:{
    textAlign:'center',
    alignSelf:'center',
  },
}

export const AppNavigator = StackNavigator({
  Login: { screen: LoginScreen },
  Main: { screen: MainScreen },
  Detail: { screen: DetailScreen },
  Register: { screen: RegisterScreen},
  Recharge:{screen:RechargeScreen},
  Exchange:{screen:ExchangeScreen},
  Collect:{screen:CollectScreen},
  Setting:{screen:SettingScreen},
  UpdateInfo:{screen:UpdateInfoScreen},
},{
  initialRouteName:'Main',
  mode:'modal',
  headerMode:'screen',
});


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




