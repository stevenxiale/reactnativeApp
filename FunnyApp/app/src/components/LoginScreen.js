import React from 'react';
import { 
  View,
  Text,
  TouchableHighlight,
  TextInput,
  ScrollView,
  StyleSheet,
  Button,
  TouchableOpacity,
}from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import Dimensions from 'Dimensions';

import usernameImg from './images/username.png';
import pwdImg from './images/password.png';
import UserInput from './login/UserInput';


const resetAction = NavigationActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({routeName: 'Main'})
  ],
});
const sendToServer = function(component){
  var request = new XMLHttpRequest();
  request.onreadystatechange = (e) => {
    if (request.readyState !== 4) {
      return;
    }
    if (request.status === 200) {
      let userInfo = JSON.parse(request._response);
      component.props.login(userInfo);
      component.props.navigation.goBack();
    } else {
      alert(request._response);
    }
  };
  
  request.open('POST', 'http://127.0.0.1:5000/login');
  request.setRequestHeader('Content-type', 'application/json');
  let body = {username:component.state.username,password:component.state.password};
  request.send(JSON.stringify(body));
}

class LoginScreen extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {username: '',password:''};
	    this.setUserInput = this.setUserInput.bind(this);
	    this.loginSubmmit = this.loginSubmmit.bind(this);
	}
  static navigationOptions = {
    title: '登录',
    headerBackTitle:'',
   	headerStyle:{
      backgroundColor:'#fff',
      justifyContent:'center',
    },
    headerTintColor:'#000',
    headerTitleStyle:{
      textAlign:'center',
      alignSelf:'center',
    },
    headerRight:<View/>,
  };
  
  render() {
    return (
      <ScrollView style = {styles.register}>
       <View style={styles.inputArea}>
        <UserInput source={usernameImg}
          placeholder='用户名'
          returnKeyType={'done'}
          autoCorrect={true}
          secureTextEntry={false}
          keyboardType={'default'}
          autoCapitalize={'none'}
          valueType={'username'}
          setUserInput={this.setUserInput} />
        <UserInput source={pwdImg}
          placeholder='密码'
          returnKeyType={'done'}
          autoCorrect={true}
          secureTextEntry={true}
          keyboardType={'default'}
          autoCapitalize={'none'}
          valueType={'password'}
          setUserInput={this.setUserInput} />
        </View>
        <TouchableHighlight onPress = { this.loginSubmmit } 
          style = {styles.loginButton}>
          <Text style={styles.loginButtonText}>登 录</Text>
        </TouchableHighlight>
        <View style={styles.registerOrFindPwd}>
        	<TouchableOpacity style={styles.registerButton} underlayColor='#f4f4f4' activeOpacity={0.9} onPress = {() => {this.props.navigation.navigate('Register');}} >
        		<Text style={styles.registerButtonText}>注册</Text>
        	</TouchableOpacity>
        	<TouchableOpacity style={styles.registerButton} underlayColor='#f4f4f4' activeOpacity={0.9} onPress={() => {}}>
	        	<Text style={styles.registerButtonText}>忘记密码</Text>
	        </TouchableOpacity>
	     </View>
      </ScrollView>
    );
  }

  setUserInput(type,value){
  	if(type == 'username'){
  		this.setState({username:value});
  	}else if(type == 'password'){
  		this.setState({password:value});
  	}
  }
  loginSubmmit(){
  	if(!this.state.username || !this.state.password){
  		alert('用户名或者密码不能为空');
  		return;
  	}
  	sendToServer(this);
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
});

const mapDispatchToProps = dispatch => ({
  login: (userInfo) => dispatch({ type: 'Login', userInfo: userInfo }),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  register:{
    backgroundColor:'#fff',
  },
  inputArea:{
    paddingTop:20,
  	paddingLeft:10,
    paddingRight:10,
  },
  loginButton:{
    height:40,
    width:DEVICE_WIDTH - 20,
    marginTop:20,
    marginHorizontal: 10,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#4dbf4d',
    borderRadius:8,
  },
  loginButtonText:{
    color:'#fff',
    fontSize:16,
  },
  registerOrFindPwd:{
  	width:DEVICE_WIDTH - 20,
    marginHorizontal: 10,
    marginTop:5,
  	flex:1,
  	flexDirection:'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  registerButton:{
  	backgroundColor:'#fff',
  	paddingVertical:10,
  	paddingHorizontal:20,
  },
  registerButtonText:{
  	color:'#4dbf4d',
  	fontSize:14,
  }

});
