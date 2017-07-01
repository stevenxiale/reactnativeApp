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


const resetAction = NavigationActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({routeName: 'Mine'})
  ],
});

const hash_self = function(arg,timestamp){
  return '' + (timestamp%100000*arg)&timestamp ;
}

const sendToServer = function(component,userInfo,loginToken){
  let setType = component.state.setType;
  var request = new XMLHttpRequest();
  request.onreadystatechange = (e) => {
    if (request.readyState !== 4) {
      return;
    }
    if (request.status === 200) {
      let data = JSON.parse(request._response);
      if(setType === 'bindEmail'){
        Alert.alert('提示','修改密码成功！',[{text:'确定',onPress:()=>{component.props.navigation.goBack();}}]);
      }
      if(setType === 'bindEmail'){
        component.props.UpdateVersion(data);
        Alert.alert('提示','邮箱绑定成功！',[{text:'确定',onPress:()=>{component.props.navigation.goBack();}}]);
      }
      if(setType == 'sendToEmail' && component.state.findPwdStep === 1){
        component.setState({findPwdStep:2});
        Alert.alert('提示','验证码已成功发送到邮箱',[{text:'确定',onPress:()=>{}}]);
      }
      if(setType == 'sendToEmail' && component.state.findPwdStep === 2){
        component.props.login(data);
        Alert.alert('提示','密码修改成功,请牢记您的新密码',[{text:'确定',onPress:()=>{component.props.navigation.goBack();}}]);
      }

    } else {
      Alert.alert('提示',request._response,[{text:'确定',onPress:()=>{}}]);
    }
  };
  if(setType === 'changePwd'){
    request.open('PUT', 'http://127.0.0.1:5000/user/pwd');
    let timestamp = new Date().getTime();
    let signature = '?user_id=' + userInfo.id + '&opwd=' + component.state.changePwd.oldPwd + '&npwd=' + component.state.changePwd.newPwd + '&timestamp=' + hash_self(userInfo.id, timestamp);
    var body = {
      opwd:md5.str_md5(component.state.changePwd.oldPwd),
      npwd:md5.str_md5(component.state.changePwd.newPwd),
      timestamp:timestamp,
      signature:md5.str_md5(signature),
    };
    request.setRequestHeader('Content-type', 'application/json');
    request.setRequestHeader('x-login-token',loginToken);
    request.setRequestHeader('x-user-id',userInfo.id);
    request.send(JSON.stringify(body));
  }
  if(setType === 'bindEmail'){
    request.open('PUT', 'http://127.0.0.1:5000/user/email');
    let timestamp = new Date().getTime();
    let signature = '?user_id=' + userInfo.id + '&email=' + component.state.bindEmail + '&timestamp=' + hash_self(userInfo.id, timestamp)+ '&version=' + userInfo.version;
    var body = {
      email:component.state.bindEmail,
      timestamp:timestamp,
      signature:md5.str_md5(signature),
    };
    request.setRequestHeader('Content-type', 'application/json');
    request.setRequestHeader('x-login-token',loginToken);
    request.setRequestHeader('x-user-id',userInfo.id);
    request.send(JSON.stringify(body));
  }

  if(setType === 'findPwd' && component.state.findPwdStep === 1){
    request.open('POST', 'http://127.0.0.1:5000/user/email');
    var body = {
      email:component.state.findPwdEmail,
    };
    request.setRequestHeader('Content-type', 'application/json');
    request.send(JSON.stringify(body));
  }

  if(setType === 'findPwd' && component.state.findPwdStep === 2){
    request.open('PUT', 'http://127.0.0.1:5000/user/email');
    let params = component.state.findPwdParam;
    let timestamp = new Date().getTime();
    let signature = '?username=' + params.username + '&captcha=' + params.captcha+ '&pwd=' + params.newPwd + '&timestamp=' + timestamp;
    var body = {
      username:params.username,
      captcha:md5.str_md5(params.captcha),
      pwd:md5.str_md5(params.newPwd),
      timestamp:timestamp,
      signature:md5.str_md5(signature),
    };
    request.setRequestHeader('Content-type', 'application/json');
    request.send(JSON.stringify(body));
  }

}

class UpdateInfoScreen extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
        setType:this.props.navigation.state.params.setType,
        changePwd:{},
        bindEmail:null,
        findPwdEmail:null,
        findPwdParam:{},
        findPwdStep:1,
      };
      this.showEle = this.showEle.bind(this);

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
      <ScrollView style = {styles.register}>

        {this.showEle()}

        <TouchableHighlight onPress = { this.sureSubmit } underlayColor='#f4f4f4' activeOpacity={0.9} 
          style = {styles.loginButton}>
          <Text style={styles.loginButtonText}>确定</Text>
        </TouchableHighlight>
      </ScrollView>
    );
  }

  showEle(){
  	if(this.state.setType === 'changePwd'){
      return <View style={styles.inputArea}>
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
                  let newObj = this.state.changePwd;
                  newObj.oldPwd = value;
                  this.setState({changePwd:newObj});
                  }
                }
              />
            </View>
            <View style={[styles.inputItem,styles.itenBorderBottom]}>
                <Text style={styles.inputItemText}>新密码</Text>
                <TextInput style={styles.input}
                  placeholder='6-16位数字／字母组合'
                  returnKeyType= 'done'
                  secureTextEntry= {true}
                  keyboardType= 'default'
                  autoCapitalize= 'none'
                  autoCorrect= {true}
                  placeholderTextColor='#999'
                  underlineColorAndroid='transparent'
                  onChangeText={(value) => {
                     let newObj = this.state.changePwd;
                      newObj.newPwd = value;
                      this.setState({changePwd:newObj});
                    }
                  }
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
                     let newObj = this.state.changePwd;
                      newObj.surePwd = value;
                      this.setState({changePwd:newObj});
                    }
                  }
                />
              </View>
            </View>
        }
        if(this.state.setType === 'bindEmail'){
          return <View style={styles.inputArea}>
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
              />
            </View>
          </View>
        }
        if(this.state.setType === 'findPwd'){
          return <View style={styles.inputArea}>
            <View style={styles.inputItem}>
              <Text style={styles.inputItemText}>邮箱</Text>
              <TextInput style={styles.inputFindPwd}
                placeholder='输入邮箱以接受验证码'
                returnKeyType= 'done'
                keyboardType= 'default'
                autoCapitalize= 'none'
                autoFocus={true}
                autoCorrect= {true}
                placeholderTextColor='#999'
                underlineColorAndroid='transparent'
                onChangeText={(value) => {
                  this.setState({findPwdEmail:value});
                  }
                }
              />
              <TouchableHighlight onPress = { () => {
                if(this.state.findPwdStep === 2) return;
                this.sureSubmit();}
              } underlayColor='#f4f4f4' activeOpacity={0.9} 
                style = {styles.FindPwdButton}>
                <Text style={styles.loginButtonText}>立即发送</Text>
              </TouchableHighlight>
            </View>
            <View style={styles.findPwdTextView}><Text style={styles.findPwdText}>如果已收到邮箱验证码，则可重置密码：</Text></View>
            <View style={[styles.inputItem,styles.itenBorderBottom]}>
              <Text style={styles.inputItemText}>用户名</Text>
              <TextInput style={styles.input}
                placeholder='输入用户名'
                returnKeyType= 'done'
                keyboardType= 'default'
                autoCapitalize= 'none'
                autoFocus={true}
                autoCorrect= {true}
                placeholderTextColor='#999'
                underlineColorAndroid='transparent'
                onChangeText={(value) => {
                  let newObj = this.state.findPwdParam;
                  newObj.username = value;
                  this.setState({findPwdParam:newObj});
                  }
                }
              />
            </View>
            <View style={[styles.inputItem,styles.itenBorderBottom]}>
                <Text style={styles.inputItemText}>验证码</Text>
                <TextInput style={styles.input}
                  placeholder='请至邮箱查看'
                  returnKeyType= 'done'
                  keyboardType= 'default'
                  autoCapitalize= 'none'
                  autoCorrect= {true}
                  placeholderTextColor='#999'
                  underlineColorAndroid='transparent'
                  onChangeText={(value) => {
                     let newObj = this.state.findPwdParam;
                      newObj.captcha = value;
                      this.setState({findPwdParam:newObj});
                    }
                  }
              />
              </View>
              <View style={styles.inputItem}>
                <Text style={styles.inputItemText}>新密码</Text>
                <TextInput style={styles.input}
                  placeholder='6-16位数字／字母组合'
                  returnKeyType= 'done'
                  secureTextEntry= {true}
                  keyboardType= 'default'
                  autoCapitalize= 'none'
                  autoCorrect= {true}
                  placeholderTextColor='#999'
                  underlineColorAndroid='transparent'
                  onChangeText={(value) => {
                     let newObj = this.state.findPwdParam;
                      newObj.newPwd = value;
                      this.setState({findPwdParam:newObj});
                    }
                  }
                />
              </View>
          </View>
        }
  }
  sureSubmit(){
  	if(this.state.setType === 'changePwd'){
      let param = this.state.changePwd;
      if(!param.oldPwd || !param.oldPwd.trim()){
        Alert.alert('提示','原始密码不能为空',[{text:'确定',onPress:()=>{}}]);
        return;
      }
      if(!param.newPwd || !param.newPwd.trim()){
        Alert.alert('提示','新不能为空',[{text:'确定',onPress:()=>{}}]);
        return;
      }
      if( param.oldPwd !== param.newPwd ){
        Alert.alert('提示','两次输入的新密码不一致',[{text:'确定',onPress:()=>{}}]);
        return;
      }
    }
    let isemail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/ ;
    if(this.state.setType === 'bindEmail'){
      if( !this.state.bindEmail || !this.state.bindEmail.trim() ){
        Alert.alert('提示','请输入邮箱',[{text:'确定',onPress:()=>{}}]);
        return;
      }
      if(!isemail.test(this.state.bindEmail)){
        Alert.alert('提示','请输入合法的邮箱',[{text:'确定',onPress:()=>{}}]);
        return;
      }
    }
    if(this.state.setType === 'findPwd' && this.state.findPwdStep === 1){
      if( !this.state.findPwdEmail || !this.state.findPwdEmail.trim() ){
        Alert.alert('提示','请输入邮箱',[{text:'确定',onPress:()=>{}}]);
        return;
      }
      if(!isemail.test(this.state.findPwdEmail)){
        Alert.alert('提示','请输入合法的邮箱',[{text:'确定',onPress:()=>{}}]);
        return;
      }
    }
    if(this.state.setType === 'findPwd' && this.state.findPwdStep === 2){
      let param = this.state.findPwdParam;
      if( !param.username || !param.username.trim() ){
        Alert.alert('提示','请输入用户名',[{text:'确定',onPress:()=>{}}]);
        return;
      }
      if( !param.captcha || !param.captcha.trim() ){
        Alert.alert('提示','请输入邮箱验证吗',[{text:'确定',onPress:()=>{}}]);
        return;
      }
      if( !param.newPwd || !param.newPwd.trim() ){
        Alert.alert('提示','请输入新密码',[{text:'确定',onPress:()=>{}}]);
        return;
      }
      if(param.newPwd.length < 6){
        Alert.alert('提示','密码长度至少为6位',[{text:'确定',onPress:()=>{}}]);
        return;
      }
    }
    sendToServer(this,this.props.userInfo,this.props.loginToken);
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
});

const mapDispatchToProps = dispatch => ({
  UpdateVersion: (version) => dispatch({ type: 'UpdateVersion', version: version }),
  login: (userData) => dispatch({ type: 'Login', userData: userData }),
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
    width:60,
    textAlign:'justify',
    fontSize:14,
    color:'#333',
  },
  input:{
    height:40,
    width:DEVICE_WIDTH-70,
    fontSize:14,

  },
  inputFindPwd:{
    height:40,
    width:DEVICE_WIDTH-180,
    fontSize:14,
  },
  FindPwdButton:{
    height:36,
    width:90,
    marginRight:10,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#4dbf4d',
    borderRadius:8,
  },
  findPwdTextView:{
    height:40,
    paddingTop:20,
    paddingLeft:10,
    borderBottomWidth:0.5,
    borderBottomColor:'#e2e2e2',
    borderTopWidth:0.5,
    borderTopColor:'#e2e2e2',
  },
  findPwdText:{
    fontSize:12,
    color:'#999',
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
