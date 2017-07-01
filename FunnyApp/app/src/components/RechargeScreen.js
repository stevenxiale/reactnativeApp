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
      if(component.state.reType === 'gold')
        component.props.rechargeGold(data);
      else
        component.props.rechargeMember(data);
    } else {
      Alert.alert('提示',request._response,[{text:'确定',onPress:()=>{}}]);
    }
  };
  
  request.open('POST', 'http://127.0.0.1:5000/user/logout');
  request.setRequestHeader('Content-type', 'application/json');
  request.setRequestHeader('x-login-token',loginToken);
  request.setRequestHeader('x-user-id',userInfo.id);

  let body = {
    coupon:md5.str_md5(component.state.exCode),
    timestamp:new Date().getTime(),
    signature:'?user_id=' + userInfo.id + '&coupon=' + md5.str_md5(component.state.exCode),
  };
  request.send(JSON.stringify(body));
}

class RechargeScreen extends React.Component {
	constructor(props) {
	    super(props);
      this.state = {
        reType:this.props.navigation.state.params.reType,
        choose:null,
        payType:null,
      }
	}
  static navigationOptions = ({navigation}) => {
    return{
      title: navigation.state.params.title,
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
    }
  }
  
  render() {
    return (
      <ScrollView style = {styles.recharge}>
          <View style={styles.codeArea}>
            <Text style={styles.codeText}>兑换码充值</Text>
            <View style={styles.codeInput}>
              <TextInput style={styles.input}
                placeholder={this.state.reType === 'member' ? '请输入会员兑换码':'请输入金币兑换码'}
                returnKeyType= 'done'
                keyboardType= 'default'
                secureTextEntry= {true}
                autoCapitalize= 'none'
                autoCorrect= {true}
                placeholderTextColor='#999'
                underlineColorAndroid='transparent'
                onChangeText={(value) => {
                  console.log(value);
                  this.setState({exCode:value});
                  }
                }
              />
              <TouchableHighlight 
                style = {styles.rechargeButton} underlayColor='#f4f4f4' activeOpacity={0.9}
                onPress={()=>{
                  if(!this.state.exCode){
                    Alert.alert('提示','请输入兑换码',[{text:'确定',onPress:()=>{}}]);
                    return;
                  }
                  sendToServer(this,this.props.userInfo,this.props.loginToken);
                }}>
                <Text style={styles.rechargeButtonText}>立即兑换</Text>
              </TouchableHighlight>
            </View>
          </View>
          {this.state.reType === 'member' ? 
          <View style={styles.cashArea}>
            <Text style={styles.codeText}>微信／支付宝充值</Text>
            <View style={styles.cashAreaInfo}>
              <TouchableHighlight style={this.state.choose == 'oneMonth'?[styles.cashItem,styles.chsBgColor]:styles.cashItem} underlayColor='#f4f4f4' activeOpacity={0.9}
              onPress={()=>{
                this.setState({choose:'oneMonth'});
              }}>
               <View style={styles.cashItemView}>
                 <Text style={styles.cashText1}>1个月</Text>
                 <Text style={styles.cashText2}>20元</Text>
               </View>
              </TouchableHighlight>
              <TouchableHighlight style={this.state.choose == 'thrMonth'?[styles.cashItem,styles.chsBgColor]:styles.cashItem} underlayColor='#f4f4f4' activeOpacity={0.9}
              onPress={()=>{
                this.setState({choose:'thrMonth'});
              }}>
                <View style={styles.cashItemView}>
                   <Text style={styles.cashText1}>3个月</Text>
                   <Text style={styles.cashText2}>60元</Text>
                </View>
              </TouchableHighlight>
              <TouchableHighlight style={this.state.choose == 'sixMonth'?[styles.cashItem,styles.chsBgColor]:styles.cashItem} underlayColor='#f4f4f4' activeOpacity={0.9}
              onPress={()=>{
                this.setState({choose:'sixMonth'});
              }}>
                <View style={styles.cashItemView}>
                    <Text style={styles.cashText1}>6个月</Text>
                   <Text style={styles.cashText2}>120元</Text>
                </View>
              </TouchableHighlight>
              <TouchableHighlight style={this.state.choose == 'oneYear'?[styles.cashItem,styles.chsBgColor]:styles.cashItem} underlayColor='#f4f4f4' activeOpacity={0.9}
              onPress={()=>{
                this.setState({choose:'oneYear'});
              }}>
                <View style={styles.cashItemView}>
                    <Text style={styles.cashText1}>1 年</Text>
                   <Text style={styles.cashText2}>240元</Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>:
          <View style={styles.cashArea}>
            <Text style={styles.codeText}>微信／支付宝充值</Text>
            <View style={styles.cashAreaInfo}>
                <TouchableHighlight style={this.state.choose == 'gold100'?[styles.cashItem,styles.chsBgColor]:styles.cashItem} underlayColor='#f4f4f4' activeOpacity={0.9}
                onPress={()=>{
                  this.setState({choose:'gold100'});
                }}>
                 <View style={styles.cashItemView}>
                   <Text style={styles.cashText1}>100金币</Text>
                   <Text style={styles.cashText2}>5元</Text>
                 </View>
                </TouchableHighlight>
                <TouchableHighlight style={this.state.choose == 'gold200'?[styles.cashItem,styles.chsBgColor]:styles.cashItem} underlayColor='#f4f4f4' activeOpacity={0.9}
                onPress={()=>{
                  this.setState({choose:'gold200'});
                }}>
                  <View style={styles.cashItemView}>
                     <Text style={styles.cashText1}>200金币</Text>
                     <Text style={styles.cashText2}>10元</Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight style={this.state.choose == 'gold600'?[styles.cashItem,styles.chsBgColor]:styles.cashItem} underlayColor='#f4f4f4' activeOpacity={0.9}
                onPress={()=>{
                  this.setState({choose:'gold600'});
                }}>
                  <View style={styles.cashItemView}>
                      <Text style={styles.cashText1}>600金币</Text>
                     <Text style={styles.cashText2}>30元</Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight style={this.state.choose == 'gold1200'?[styles.cashItem,styles.chsBgColor]:styles.cashItem} underlayColor='#f4f4f4' activeOpacity={0.9}
                onPress={()=>{
                  this.setState({choose:'gold1200'});
                }}>
                  <View style={styles.cashItemView}>
                      <Text style={styles.cashText1}>1200金币</Text>
                     <Text style={styles.cashText2}>60元</Text>
                  </View>
                </TouchableHighlight>
            </View>
          </View>}
            <TouchableHighlight style={styles.payListItem} underlayColor='#f4f4f4' activeOpacity={0.9}
            onPress={()=>{
              this.setState({payType:'wechat'});
            }}>
              <View style={styles.payItem}>
                <Image style={styles.payIcon} source={require('./images/wechat.png')} />
                <View style={styles.payText}>
                  <Text style={styles.iconText}>微信支付</Text>
                  <Image style={styles.checked} source={this.state.payType == 'wechat' ? require('./images/check2.png'):require('./images/check1.png')} />
                </View>
              </View>
            </TouchableHighlight>
            <TouchableHighlight style={styles.payListItem} underlayColor='#f4f4f4' activeOpacity={0.9}
            onPress={()=>{
              this.setState({payType:'alipay'});
            }}>
              <View style={styles.payItem}>
                <Image style={styles.payIcon} source={require('./images/alipay.png')} />
                <View style={styles.payText}>
                  <Text style={styles.payName}>支付宝支付</Text>
                  <Image style={styles.checked} source={this.state.payType == 'alipay' ? require('./images/check2.png') : require('./images/check1.png')} />
                </View>
              </View>
            </TouchableHighlight>
            <View style={styles.cashButtonArea}>
              <TouchableHighlight style={styles.cashButton} underlayColor='#f9f9f9' activeOpacity={0.9}
              onPress={()=>{
              }}>
                <Text style={styles.cashButtonText}>暂缓开通</Text>
              </TouchableHighlight>
            </View>
      </ScrollView>
    );
  }

}

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
  userInfo:state.auth.userInfo,
  loginToken:state.auth.loginToken,
});

const mapDispatchToProps = dispatch => ({
  rechargeGold: (gold) => dispatch({ type: 'updateGold', gold: gold }),
  rechargeMember:(deadline) => dispatch({ type: 'AddDay', deadline: deadline }),
});

export default connect(mapStateToProps, mapDispatchToProps)(RechargeScreen);

//定义一些全局变量
const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');

const cols = 3;
const boxH = 48;
const wMargin = 10;

const boxW = (width - (cols+1) * wMargin) / cols;
const hMargin = 15;

const styles = StyleSheet.create({
  recharge:{
    backgroundColor:'#f9f9f9',
    paddingTop:20,
  },
  codeArea:{
    marginBottom:20,
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
  cashArea:{
  },
  cashAreaInfo:{
    flexDirection:'row',
    flexWrap:'wrap',
    alignItems:'center',
    backgroundColor:'#fff',
  },
  cashItem:{
    width:boxW,  
    height:boxH,
    marginLeft:wMargin,  
    marginTop:hMargin,
    borderWidth:0.5,
    borderColor:'#e2e2e2',
    borderRadius:8,
  },
  chsBgColor:{
    borderWidth:1,
    borderColor:'#4dbf4d',
  },
  cashItemView:{
    width:boxW,  
    height:boxH,
    flexDirection:'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cashText1:{
    fontSize:15,
    color:'#333',
  },
  cashText2:{
    fontSize:12,
    color:'#666',
  },
  payItem:{
    width:width,
    paddingLeft:18,
    flexDirection:'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor:'#fff',
  },
  payIcon:{
    width:16,
    height:16,
    marginRight:10,
  },
  payText:{
    width:width-44,
    height:40,
    flexDirection:'row',
    paddingRight:20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  payName:{
    color:'#333',
    fontSize:12,
  },
  checked:{
    width:16,
    height:16,
  },
  cashButtonArea:{
    height:60,
    backgroundColor:'#fff',
  },
  cashButton:{
    height:40,
    width:width-240,
    marginLeft:120,
    marginTop:10,
    backgroundColor:'#f2f2f2',
    borderRadius:8,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cashButtonText:{
    color:'#999',
    fontSize:14,
  },
});
