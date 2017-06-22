import React from 'react';
import {
	AppRegistry,
	Text,
	View,
	Button,
	ScrollView
} from 'react-native';
import { StackNavigator,TabNavigator } from 'react-navigation';

class RecentChatsScreen extends React.Component{
	render(){
		return(
			<View>
			<Text style={{marginTop:50}}>list of recent chat.</Text>
			<Button  style={{backgroundColor:'blue'}} title='点击进入详情' onPress={
				()=> this.props.navigation.navigate('Detail',{articleId:'11112222'})
			} />
			</View>
		) ;
	}
}
class AllContractsScreen extends React.Component{
	render(){
		return(
			<View>
			<Text style={{marginTop:100}}>list of all contracts.</Text>
			<Button style={{backgroundColor:'gray'}} onPress={
				()=> this.props.navigation.navigate('Detail',{articleId:'88889999'})
			}  title='点击进入详情' />
			</View>
		)
	}
}
class UserCenterScreen extends React.Component{
	render(){
		return (
			<View style={{marginTop:50}}>
				<Text>用户名：little</Text>
				<Text>用户等级：VIP68</Text>
				<Text>账户余额：28元</Text>
			</View>
		);
	}
}
class detailScreen extends React.Component{
	static navigationOptions = {
		title:({state})=> 'articles'+state.params.articleId+'\'s deatil',
		header:{
			right:<Button title='info' />,
		},
	};
	render(){
		const { params } = this.props.navigation.state;
		return <Text>article{params.articleId} deatil page .....</Text>
	}
}



const MainScreenNavigator = TabNavigator({
	Recent:{screen:RecentChatsScreen},
	All:{screen:AllContractsScreen},
	My:{screen:UserCenterScreen},
});
MainScreenNavigator.navigationOptions = {title:'主界面'};



const SimpleApp = StackNavigator({
	Home:{screen:MainScreenNavigator},
	Detail:{screen:detailScreen},
});

AppRegistry.registerComponent('SimpleApp',() => SimpleApp);