import React, { Component, PropTypes } from 'react';
import Dimensions from 'Dimensions';
import {
	StyleSheet,
	View,
	Text,
	TouchableHighlight,
	TouchableOpacity,
} from 'react-native';
import { NavigationActions } from 'react-navigation';

const toFindPwd = function(){
	NavigationActions.navigate({routeName:'findPwd'});
}
export default class SignupSection extends Component {
	constructor() {
		super();
		this.toRegister = this.toRegister.bind(this);
	}
	
	toRegister(){
		this.props.navigation.navigate('Register');
	}
	render() {
		return (
			<View style={styles.container}>
				<TouchableOpacity onPress={this.toRegister}>
					<Text style={styles.text}>Create Account</Text>
				</TouchableOpacity>
				<TouchableHighlight onPress={toFindPwd}>
					<Text style={styles.text}>Forgot Password?</Text>
				</TouchableHighlight>
			</View>
		);
	}
}

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		top: 65,
		width: DEVICE_WIDTH,
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
	text: {
		color: 'white',
		backgroundColor: 'transparent',
	},
});
