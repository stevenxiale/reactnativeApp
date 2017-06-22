import React from 'react';
import {
	AppRegistry,
	Text,
	View,
	Button,
	ScrollView
} from 'react-native';
import { StackNavigator,TabNavigator } from 'react-navigation';


const MyNavScreen = ({navigation,banner}) => (
  <ScrollView>
    <Text>{banner}</Text>
    <Button 
      onPress = {navigation.navigate('Video')}
      title = 'Go to video page.'
    />
    <Button 
      onPress = {navigation.navigate('UserCenter')}
      title = 'Go to userCenter page.'
    />
    <Button 
      onPress = {navigation.navigate('Detail')}
      title = 'Go to detail page.'
    />
  </ScrollView>
)

class MyVideoScreen extends React.Component{
	static navigationOptions = {
		tabBar:{
			label:'视频',
		},
	};
	render(){
	  return (
	    <MyNavScreen 
		  banner = 'nice video screen page.'
		  navigation = {navigation}
		/>
	  );
	}
}
class MyPictureScreen extends React.Component{
	static navigationOptions = {
		tabBar:{
			label:'图片',
		},
	};
	render(){
	  return (
	    <MyNavScreen 
		  banner = 'welcome to pictures screen page.'
		  navigation = {navigation}
		/>
	  );
	}
}

class MyBookScreen extends React.Component{
	static navigationOptions = {
		tabBar:{
			label:'小说',
		},
	};
	render(){
	  return (
	    <MyNavScreen 
		  banner = 'pictures.'
		  navigation = {navigation}
		/>
	  );
	}
}
class UserCenterScreen extends React.Component{
	static navigationOptions = {
		tabBar:{
			label:'我',
		},
	};
	render(){
	  return (
	    <MyNavScreen 
		  banner = 'I,m the VIP!.'
		  navigation = {navigation}
		/>
	  );
	}
}


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
AppRegistry.registerComponent('MyApplication',() => SimpleApp);