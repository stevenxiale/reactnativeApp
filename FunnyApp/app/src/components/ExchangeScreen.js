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
  Alert,
}from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import Dimensions from 'Dimensions';
import md5 from 'react-native-md5';

import usernameImg from './images/username.png';
import pwdImg from './images/password.png';
import UserInput from './login/UserInput';


const sendToServer = function(component,userInfo,loginToken){
  var request = new XMLHttpRequest();
  request.onreadystatechange = (e) => {
    if (request.readyState !== 4) {
      return;
    }
    if (request.status === 200) {
      let data = JSON.parse(request._response);
      component.props.exGold(data);
    } else {
      Alert.alert('提示',request._response,[{text:'确定',onPress:()=>{}}]);
    }
  };
  
  request.open('POST', 'http://127.0.0.1:5000/user/transfer');
  request.setRequestHeader('Content-type', 'application/json');
  request.setRequestHeader('x-login-token',loginToken);
  request.setRequestHeader('x-user-id',userInfo.id);

  let body = {
    payee:component.state.friendId,
    amount:component.state.amount.trim(),
    timestamp:new Date().getTime(),
    signature:'?user_id=' + userInfo.id + '&payee_id=' + md5.str_md5(component.state.friendId,new Date().getTime())+'&amount='+amount+'&timestamp='+timestamp,
  };
  request.send(JSON.stringify(body));
}

class ExchangeScreen extends React.Component {
	constructor(props) {
	    super(props);
      this.state = {
        friendId:'',
        amount:'',
      };
	}
  static navigationOptions = {
    title: '转金币',
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
            <Text style={styles.codeText}>转金币给好友</Text>
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
                  this.setState({friendId:value});
                  }
                }
                ref = {(TextInput) => {this.textInput = TextInput; }}
              />
              <TextInput style={styles.input}
                placeholder='请输入转账数量'
                returnKeyType= 'done'
                keyboardType= 'default'
                autoCapitalize= 'none'
                autoCorrect= {true}
                placeholderTextColor='#999'
                underlineColorAndroid='transparent'
                onChangeText={(value) => {
                  this.setState({amount:value});
                  }
                }
                ref = {(TextInput) => {this.textInput = TextInput; }}
              />
               <View style={styles.cashButtonArea}>
                <TouchableHighlight style={styles.cashButton} underlayColor='#f9f9f9' activeOpacity={0.9}
                onPress={()=>{
                  if(!this.state.friendId && !this.state.friendId.trim()){
                    Alert.alert('提示','好友ID不能为空',[{text:'确定',onPress:()=>{}}]);
                    return;
                  }
                  if(!this.state.amount && !this.state.amount.trim()){
                    Alert.alert('提示','金币数量不能为空',[{text:'确定',onPress:()=>{}}]);
                    return;
                  }
                  let reg = new RegExp("^[0-9]*$");
                  if(!reg.test(this.state.amount.trim())){
                    Alert.alert('提示','金币数量只能为数字',[{text:'确定',onPress:()=>{}}]);
                    return;
                  }
                  if(Number.parseInt(this.state.amount.trim()) + 3 > this.props.userInfo.gold){
                    var num = this.props.userInfo.gold - 3;
                    Alert.alert('提示','转账数量不能超过'+{num}+'个',[{text:'确定',onPress:()=>{}}]);
                    return;
                  }
                  sendToServer(this,this.props.userInfo,this.props.loginToken);
                }}>
                  <Text style={styles.cashButtonText}>立即转账</Text>
                </TouchableHighlight>
              </View>
            </View>
            <Text style={styles.notice}>温馨提示：每次转金币给好友将耗费您3个金币。您当前金币剩余{this.props.isLoggedIn ? this.props.userInfo.gold : '--'}个</Text>
          </View>

      </ScrollView>
    );
  }

}

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
});

const mapDispatchToProps = dispatch => ({
  exGold: (gold) => dispatch({ type: 'updateGold', gold: gold }),
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
    paddingRight:20,
    backgroundColor:'#fff',
    borderBottomWidth:0.5,
    borderBottomColor:'#ececec',
    borderTopWidth:0.5,
    borderTopColor:'#ececec',
  },
  input:{
    width:width - 40,
    height: 40,
    marginBottom:10,
    paddingLeft:5,
    fontSize:14,
    color: '#333',
    backgroundColor:'#fff',
    borderWidth:0.5,
    borderColor:'#e2e2e2',
    borderRadius:8,
  },
  cashButtonArea:{
    height:60,
    backgroundColor:'#fff',
  },
  cashButton:{
    height:40,
    width:width-40,
    marginTop:10,
    backgroundColor:'#4dbf4d',
    borderRadius:8,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cashButtonText:{
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
