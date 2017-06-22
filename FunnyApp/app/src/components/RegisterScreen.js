import React from 'react';
import { 
  View,
  Text,
  TouchableHighlight,
  TextInput,
  ScrollView,
  StyleSheet,
}from 'react-native';
import UserInput from './login/UserInput';
import usernameImg from './images/username.png';
import pwdImg from './images/password.png';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import Dimensions from 'Dimensions';


const resetAction = NavigationActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({routeName: 'Main'})
  ]
});
const sendToServer = function(component){
  var request = new XMLHttpRequest();
  request.onreadystatechange = (e) => {
    if (request.readyState !== 4) {
      return;
    }
    if (request.status === 200) {
      let userInfo = JSON.parse(request._response);
      component.props.Register(userInfo);
      component.props.navigation.dispatch(resetAction);
    } else {
      alert(request._response);
    }
  };

  request.open('POST', 'http://192.168.99.167:5000/register');
  request.setRequestHeader('Content-type', 'application/json');
  request.setRequestHeader('Accept', 'application/json');
  let body = {
    "username":component.state.username,
    "password":component.state.password,
    "email":component.state.email,
  };
  request.send(JSON.stringify(body));
}

class RegisterScreen extends React.Component {
  constructor(props) {
      super(props);
      this.state = {username: '',password:'',confirmPwd:'',email:''};
      this.setUserInput = this.setUserInput.bind(this);
      this.registerSubmmit = this.registerSubmmit.bind(this);
  }
  static navigationOptions = {
    title: '注册',
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
          keyboardType={'default'}
          autoCorrect={true}
          secureTextEntry={false}
          valueType={'username'}
          setUserInput={this.setUserInput}
          />
        <UserInput source={pwdImg}
          placeholder='密码'
          returnKeyType={'done'}
          keyboardType={'default'}
          autoCorrect={true}
          secureTextEntry={true}
          valueType={'password'}
          setUserInput={this.setUserInput}
          />
          <UserInput source={pwdImg}
          placeholder='确认密码'
          returnKeyType={'done'}
          keyboardType={'default'}
          autoCorrect={true}
          secureTextEntry={true}
          valueType={'confirmPwd'}
          setUserInput={this.setUserInput}
          />
          <UserInput source={pwdImg}
          placeholder='联系邮箱'
          returnKeyType={'done'}
          keyboardType={'email-address'}
          autoCorrect={true}
          secureTextEntry={false}
          valueType={'email'}
          setUserInput={this.setUserInput}
          />
        </View>
        <TouchableHighlight onPress = { this.registerSubmmit } 
          style = {styles.registerButton}>
          <Text style={styles.bottonText}>注 册</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress = { () => {
          this.props.navigation.goBack();}} 
          style = {styles.registerButton2}>
          <Text style={styles.bottonText2}>返回登录</Text>
        </TouchableHighlight>
      </ScrollView>
    );
  }

  setUserInput(type,value){
    if(type == 'username'){
      this.setState({username:value});
    }else if(type == 'password'){
      this.setState({password:value});
    }else if(type == 'email'){
       this.setState({email:value});
    }else if(type == 'confirmPwd'){
       this.setState({confirmPwd:value});
    }

  }
  registerSubmmit(){
    if( !this.state.username ){
      alert('用户名 不能为空');
      return;
    }
    if( !this.state.password ){
      alert('密码不能为空');
      return;
    }
    if( !this.state.email ){
      alert('邮箱不能为空');
      return;
    }
    if( this.state.password != this.state.confirmPwd ){
      alert('两次输入密码不一致');
      return;
    }
    sendToServer(this);
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
});

const mapDispatchToProps = dispatch => ({
  Register: (userInfo) => dispatch({ type: 'Register', userInfo: userInfo }),
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen);

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
  registerButton:{
    height:40,
    width:DEVICE_WIDTH - 20,
    marginTop:10,
    marginHorizontal: 10,
    flexDirection:'row',
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#4dbf4d',
    borderRadius:8,
  },
  registerButton2:{
    height:40,
    width:DEVICE_WIDTH - 20,
    marginTop:10,
    marginHorizontal: 10,
    flexDirection:'row',
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth:0.5,
    borderColor:'#4dbf4d',
    borderRadius:8,
  },
  bottonText:{
    fontSize:16,
    color:'#fff',
  },
  bottonText2:{
    fontSize:16,
    color:'#4dbf4d',
  },
});


