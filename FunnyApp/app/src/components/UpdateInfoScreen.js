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

class UpdateInfoScreen extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {username: '',password:''};
	    this.setUserInput = this.setUserInput.bind(this);
	    this.loginSubmmit = this.loginSubmmit.bind(this);
	}
  static navigationOptions = {
    title: '修改密码',
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
        <View style={[styles.inputItem,styles.itenBorderBottom]}>
          <Text style={styles.inputItemText}>原密码</Text>
          <TextInput style={styles.input}
            placeholder='输入原始密码'
            returnKeyType= 'done'
            secureTextEntry= {true}
            keyboardType= 'default'
            autoCapitalize= 'none'
            autoFocus={true}
            autoCorrect= {true}
            placeholderTextColor='#999'
            underlineColorAndroid='transparent'
            onChangeText={(value) => {
              console.log(value);
              }
            }
            ref = {(TextInput) => {this.textInput = TextInput; }}
          />
        </View>
        <View style={[styles.inputItem,styles.itenBorderBottom]}>
            <Text style={styles.inputItemText}>新密码</Text>
            <TextInput style={styles.input}
              placeholder='6-16位数字／密码或组合'
              returnKeyType= 'done'
              secureTextEntry= {true}
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
          </View>
          <View style={styles.inputItem}>
            <Text style={styles.inputItemText}>确定密码</Text>
            <TextInput style={styles.input}
              placeholder='再次确定密码'
              returnKeyType= 'done'
              secureTextEntry= {true}
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
          </View>
        </View>
        <View style={styles.inputArea}>
          <View style={styles.inputItem}>
            <Text style={styles.inputItemText}>邮箱</Text>
            <TextInput style={styles.input}
              placeholder='输入要绑定的邮箱'
              returnKeyType= 'done'
              keyboardType= 'default'
              autoCapitalize= 'none'
              autoFocus={true}
              autoCorrect= {true}
              placeholderTextColor='#999'
              underlineColorAndroid='transparent'
              onChangeText={(value) => {
                console.log(value);
                }
              }
              ref = {(TextInput) => {this.textInput = TextInput; }}
            />
          </View>
        </View>
        <View style={styles.inputArea}>
          <View style={styles.inputItem}>
            <Text style={styles.inputItemText}>邮箱</Text>
            <TextInput style={styles.input}
              placeholder='输入您的邮箱以找回密码'
              returnKeyType= 'done'
              keyboardType= 'default'
              autoCapitalize= 'none'
              autoFocus={true}
              autoCorrect= {true}
              placeholderTextColor='#999'
              underlineColorAndroid='transparent'
              onChangeText={(value) => {
                console.log(value);
                }
              }
              ref = {(TextInput) => {this.textInput = TextInput; }}
            />
          </View>
        </View>
        <TouchableHighlight onPress = { this.loginSubmmit } 
          style = {styles.loginButton}>
          <Text style={styles.loginButtonText}>确定</Text>
        </TouchableHighlight>
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

export default connect(mapStateToProps, mapDispatchToProps)(UpdateInfoScreen);

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  register:{
    backgroundColor:'#f9f9f9',
  },
  inputArea:{
    marginTop:10,
    backgroundColor:'#fff',
  },
  inputItem:{
    height:40,
    marginLeft:10,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',

  },
  itenBorderBottom:{
    borderBottomWidth:0.5,
    borderBottomColor:'#e2e2e2',
  },
  inputItemText:{
    width:70,
    textAlign:'justify',
    fontSize:14,
    color:'#333',
  },
  input:{
    height:40,
    width:DEVICE_WIDTH-90,
    fontSize:14,

  },
  loginButton:{
    height:40,
    width:DEVICE_WIDTH - 40,
    marginTop:20,
    marginHorizontal: 20,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#4dbf4d',
    borderRadius:8,
  },
  loginButtonText:{
    color:'#fff',
    fontSize:14,
  },
  

});
