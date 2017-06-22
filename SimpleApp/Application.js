import React from 'react';
import {
	AppRegistry,
	Text,
	View,
	Button,
	ScrollView
} from 'react-native';
import { StackNavigator,TabNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';


const MyNavScreen = ({navigation,banner}) => (
  <ScrollView>
    <Text>{banner}</Text>
    <Button 
      onPress = {navigation.navigate('Video');}
      title = 'Go to video page.'
    />
    <Button 
      onPress = {navigation.navigate('UserCenter');}
      title = 'Go to userCenter page.'
    />
    <Button 
      onPress = {navigation.navigate('UserCenter');}
      title = 'Go to detail page.'
    />
  </ScrollView>
)

const MyVideoScreen = ({navigation}) => (
  <MyNavScreen 
    banner = 'nice video screen page.'
    navigation = {navigation}
  />
);
MyVideoScreen.navigationOptions = {
	tabBar:{
		label:'视频',
		icon:({tintColor,focused}) => (
		  <Ionicons 
		    name = {focused ? 'ios-subway' : 'ios-subway-outline'}
		    size = {26}
		    style = {{color : tintColor}}
		  />
		),
	},
};

const MyPictureScreen = ({navigation}) => (
  <MyNavScreen 
    banner = 'welcome to pictures screen page.'
    navigation = {navigation}
  />
);
MyPictureScreen.navigationOptions = {
	tabBar:{
		label:'图片',
		icon:({tintColor,focused}) => (
		  <Ionicons 
		    name = {focused ? 'ios-photos' : 'ios-photos-outline'}
		    size = {26}
		    style = {{color : tintColor}}
		  />
		),
	},
};
const MyBookScreen = ({navigation}) => (
  <MyNavScreen 
    banner = 'welcome to pictures screen page.'
    navigation = {navigation}
  />
);
MyBookScreen.navigationOptions = {
	tabBar:{
		label:'小说',
		icon:({tintColor,focused}) => (
		  <Ionicons 
		    name = {focused ? 'ios-book' : 'ios-book-outline'}
		    size = {26}
		    style = {{color : tintColor}}
		  />
		),
	},
};

const UserCenterScreen = ({navigation}) => (
  <MyNavScreen 
    banner = 'welcome to pictures screen page.'
    navigation = {navigation}
  />
);
UserCenterScreen.navigationOptions = {
	tabBar:{
		label:'我',
		icon:({tintColor,focused}) => (
		  <Ionicons 
		    name = {focused ? 'ios-man' : 'ios-man-outline'}
		    size = {26}
		    style = {{color : tintColor}}
		  />
		),
	},
};


const MainScreenNavigator = TabNavigator({
	Video:{screen:MyVideoScreen},
	Picture:{screen:MyPictureScreen},
	Book:{screen:MyBookScreen},
	UserCenter:{screen:UserCenterScreen},
});
MainScreenNavigator.navigationOptions = {title:'首页'};

const detailScreen = ({navigation}) => (
  <MyNavScreen 
    banner = 'detail detail detail detail detail .'
    navigation = {navigation}
  />
);
detailScreen.navigationOptions = {title:'详情页'};


const SimpleApp = StackNavigator({
	Home:{screen:MainScreenNavigator},
	Detail:{screen:detailScreen},
});
AppRegistry.registerComponent('SimpleApp',() => SimpleApp);