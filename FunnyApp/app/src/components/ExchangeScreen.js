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
  Image,
}from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import Dimensions from 'Dimensions';

import usernameImg from './images/username.png';
import pwdImg from './images/password.png';
import UserInput from './login/UserInput';


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

class ExchangeScreen extends React.Component {
	constructor(props) {
	    super(props);
	}
  static navigationOptions = {
    title: '充值',
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
      <ScrollView style = {styles.recharge}>
          <View style={styles.codeArea}>
            <Text style={styles.codeText}>转账给好友</Text>
            <View style={styles.codeInput}>
              <TextInput style={styles.input}
                placeholder='请输入好友的ID'
                returnKeyType= 'done'
                keyboardType= 'default'
                autoCapitalize= 'none'
                autoCorrect= {true}
                placeholderTextColor='#999'
                underlineColorAndroid='transparent'
                onChangeText={(value) => {
                  console.log(value);
                  }
                }
                ref = {(TextInput) => {this.textInput = TextInput; }}
              />
              <TouchableHighlight 
                style = {styles.rechargeButton}>
                <Text style={styles.rechargeButtonText}>立即转账</Text>
              </TouchableHighlight>
            </View>
            <Text style={styles.notice}>温馨提示：每次转金币给好友将耗费您3个金币。</Text>
          </View>

      </ScrollView>
    );
  }

}

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
});

const mapDispatchToProps = dispatch => ({
  login: (userInfo) => dispatch({ type: 'Login', userInfo: userInfo }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeScreen);

//定义一些全局变量
const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');

const styles = StyleSheet.create({
  recharge:{
    backgroundColor:'#f9f9f9',
    paddingTop:20,
  },
  codeArea:{
    marginBottom:30,
  },
  codeText:{
    marginBottom:5,
    marginLeft:20,
    fontSize:14,
    color:'#333',
  },
  codeInput:{
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:20,
    paddingRight:10,
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor:'#fff',
    borderBottomWidth:0.5,
    borderBottomColor:'#ececec',
    borderTopWidth:0.5,
    borderTopColor:'#ececec',
  },
  input:{
    width:width - 120,
    height: 40,
    paddingLeft:5,
    fontSize:14,
    color: '#333',
    backgroundColor:'#fff',
    borderWidth:0.5,
    borderColor:'#e2e2e2',
    borderRadius:8,
  },
  rechargeButton:{
    height:40,
    width:80,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#4dbf4d',
    borderWidth:0.5,
    borderColor:'#4dbf4d',
    borderRadius:8,
  },
  rechargeButtonText:{
    color:'#fff',
    fontSize:14,
  },
  notice:{
    marginTop:5,
    marginLeft:20,
    fontSize:12,
    color:'#999',
  }
 
});
