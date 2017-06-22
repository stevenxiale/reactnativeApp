import React, { Component, PropTypes } from 'react';
import Dimensions from 'Dimensions';
import {
	StyleSheet,
	TouchableOpacity,
	Text,
	Animated,
	Easing,
	Image,
	Alert,
	View,
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';


import spinner from '../images/loading.gif';


const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const MARGIN = 40;

export class ButtonSubmit extends Component {
	constructor() {
		super();

		this.state = {
			isLoading: false,
		};

		this.buttonAnimated = new Animated.Value(0);
		this.growAnimated = new Animated.Value(0);
		this._onPress = this._onPress.bind(this);
	}

	_onPress() {
		if (this.state.isLoading) return;

		this.setState({ isLoading: true });
		Animated.timing(
			this.buttonAnimated,
			{
				toValue: 1,
				duration: 200,
				easing: Easing.linear
			}
		).start();

		sendToServer(this);
	}

	render() {
	  const changeWidth = this.buttonAnimated.interpolate({
	    inputRange: [0, 1],
	    outputRange: [DEVICE_WIDTH - MARGIN, MARGIN]
	  });
	  const changeScale = this.growAnimated.interpolate({
	    inputRange: [0, 1],
	    outputRange: [1, MARGIN]
	  });

		return (
			<View style={styles.container}>
				<Animated.View style={{width: changeWidth}}>
					<TouchableOpacity style={styles.button}
						onPress={this._onPress}
						activeOpacity={1} >
							{this.state.isLoading ?
								<Image source={spinner} style={styles.image} />
								:
								<Text style={styles.text}>LOGIN</Text>
							}
					</TouchableOpacity>
					<Animated.View style={[ styles.circle, {transform: [{scale: changeScale}]} ]} />
				</Animated.View>
			</View>
		);
	}
}

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
});

const mapDispatchToProps = dispatch => ({
  login: (userInfo) => dispatch({ type: 'Login', userInfo: userInfo }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ButtonSubmit);

const sendToServer = function(component){
	var request = new XMLHttpRequest();
	request.onreadystatechange = (e) => {
	  if (request.readyState !== 4) {
	    return;
	  }
	  if (request.status === 200) {
	    let userInfo = JSON.parse(request._response);
	    component.props.login(userInfo);
	  } else {
	    alert(request._response);
	  }
	   component.setState({isLoading:false});
	   component.buttonAnimated.setValue(0);
	   component.growAnimated.setValue(0);
	};

	request.open('POST', 'http://127.0.0.1:5000/login');
	let body = {username:'lly',password:'qwe123'};
	request.send(JSON.stringify(body));
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		top: -95,
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	button: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#F035E0',
		height: MARGIN,
		borderRadius: 20,
		zIndex: 100,
	},
	circle: {
		height: MARGIN,
		width: MARGIN,
		marginTop: -MARGIN,
		borderWidth: 1,
		borderColor: '#F035E0',
		borderRadius: 100,
		alignSelf: 'center',
		zIndex: 99,
		backgroundColor: '#F035E0',
	},
	text: {
		color: 'white',
		backgroundColor: 'transparent',
	},
	image: {
		width: 24,
		height: 24,
	},
});
