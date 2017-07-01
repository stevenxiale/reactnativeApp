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
  Alert,
}from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import Dimensions from 'Dimensions';
import md5 from 'react-native-md5';

import usernameImg from './images/center.png';
import pwdImg from './images/eye_black.png';
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
      let userData = JSON.parse(request._response);
      component.props.login(userData);
      component.props.navigation.goBack();
    } else {
      Alert.alert('提示',request._response,[{text:'确定',onPress:()=>{}}]);
    }
  };
  
  request.open('POST', 'http://127.0.0.1:5000/login');
  request.setRequestHeader('Content-type', 'application/json');
  let body = {
    username:component.state.username,
    password:md5.str_md5(component.state.password),
  };
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
          autoFocus={true}
          secureTextEntry={false}
          keyboardType={'default'}
          autoCapitalize={'none'}
          valueType={'username'}
          setUserInput={this.setUserInput} />
        <UserInput source={pwdImg}
          placeholder='密码'
          returnKeyType={'done'}
          autoCorrect={true}
          autoFocus={false}
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
        	<TouchableOpacity style={styles.registerButton} underlayColor='#f4f4f4' activeOpacity={0.9} onPress={() => {this.props.navigation.navigate('UpdateInfo',{title:'找回密码',setType:'findPwd'});}}>
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
    if(!this.state.username){
      Alert.alert('提示','用户名不能为空',[{text:'确定',onPress:()=>{}}]);
      return;
    }
  	if(!this.state.password){
  		Alert.alert('提示','密码不能为空',[{text:'确定',onPress:()=>{}}]);
  		return;
  	}
  	sendToServer(this);
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
});

const mapDispatchToProps = dispatch => ({
  login: (userData) => dispatch({ type: 'Login', userData: userData }),
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
