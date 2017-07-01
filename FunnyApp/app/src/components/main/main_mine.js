
import React,{Component, PropTypes} from 'react';
import {
	StyleSheet,
	Text,
	ScrollView,
	Button,
	View,
	Image,
	Platform,
	TouchableHighlight,
	Alert,
} from 'react-native';
import { connect } from 'react-redux';
import Dimensions from 'Dimensions';

import Storage from '../../util/Storage';


const sendToServer = function(component,loginToken,userId){
  var request = new XMLHttpRequest();
  request.onreadystatechange = (e) => {
    if (request.readyState !== 4) {
      return;
    }
    if (request.status === 200) {
      let userInfo = JSON.parse(request._response);
      let userData = {user:userInfo,loginToken:loginToken};
      component.props.login(userData);
    } else {
    	Alert.alert('提示',request._response,[{text:'确定',onPress:()=>{}}]);
    }
  };
  
  request.open('GET', 'http://127.0.0.1:5000/user/user');
  request.setRequestHeader('Content-type', 'application/json');
  request.setRequestHeader('x-login-token',loginToken);
  request.setRequestHeader('x-user-id',userId);
  request.send();
}


class MineScreen extends Component{
	constructor(props) {
	    super(props);
	    this.state = {
		    isLoggedIn:this.props.isLoggedIn,
		    userInfo:this.props.userInfo,
	    };
	}

	componentDidMount() {
		Storage.getItem('loginState').then((ret)=>{
			let loginState = JSON.parse(ret);
			if(loginState && loginState.loginToken){
				sendToServer(this,loginState.loginToken,loginState.userId);
			}
		});
  	}

  	render(){
  		let PicEle = this.state.isLoggedIn ? <Image style={styles.headpic} source={{uri:this.state.userInfo.avatar}} />: <Image style={styles.headpic} source={require('../images/head.gif')} />;
  		let InfoEle = this.state.isLoggedIn ? <Text style={styles.loginBtn}>{userInfo.email}</Text>:<TouchableHighlight  onPress={ ()=> this.props.navigation.navigate('Loginscrn') } underlayColor='#f4f4f4' activeOpacity={0.9}><Text style={styles.loginBtn}>登录／注册</Text></TouchableHighlight>
  		return (
  			<ScrollView style={styles.sscreenViewStyle}>
  				<View style={styles.userInfoView1}>
  					{PicEle}
					{InfoEle}
				</View>
				<View style={styles.userInfoView2}>
					<View style={styles.userInfoItem}>
						<Text style={styles.userInfoText1}>{this.state.isLoggedIn?userInfo.total:'--'}</Text>
						<Text style={styles.userInfoText2}>金币剩余</Text>
					</View>
					<View style={styles.userInfoItem}>
						<Text style={styles.userInfoText1}>{this.state.isLoggedIn?userInfo.deadline:'--'}</Text>
						<Text style={styles.userInfoText2}>会员剩余</Text>
					</View>
					<View style={styles.userInfoItem}>
						<Text style={styles.userInfoText1}>{this.state.isLoggedIn?userInfo.VIP:'--'}</Text>
						<Text style={styles.userInfoText2}>会员等级</Text>
					</View>
				</View>
				<View style={styles.sepratorView}/>
				<View>
					<TouchableHighlight style={styles.listItem} onPress={()=>{
						if(!this.props.isLoggedIn){
							this.props.navigation.navigate('Loginscrn');
							return;
						}
						this.props.navigation.navigate('Recharge',{title:'会员充值',reType:'member'});
					}} underlayColor='#f4f4f4' activeOpacity={0.9}>
						<View style={styles.listIconText}>
							<Image style={styles.iconImage} source={require('../images/crow.jpg')} />
							<View style={styles.listText}>
								<Text style={styles.iconText}>会员</Text>
								<Image style={styles.arrow} source={require('../images/arrow.png')} />
							</View>
						</View>
					</TouchableHighlight>
					<TouchableHighlight style={styles.listItem} onPress={()=>{
						if(!this.props.isLoggedIn){
							this.props.navigation.navigate('Loginscrn');
							return;
						}
						this.props.navigation.navigate('Recharge',{title:'金币充值',reType:'gold'});
					}} underlayColor='#f4f4f4' activeOpacity={0.9}>
						<View style={styles.listIconText}>
							<Image style={styles.iconImage} source={require('../images/gold.jpg')} />
							<View style={styles.listText}>
								<Text style={styles.iconText}>金币</Text>
								<Image style={styles.arrow} source={require('../images/arrow.png')} />
							</View>
						</View>
					</TouchableHighlight>
					<TouchableHighlight style={styles.listItem} onPress={()=>{
						if(!this.props.isLoggedIn){
							this.props.navigation.navigate('Loginscrn');
							return;
						}
						this.props.navigation.navigate('Exchange');
					}} underlayColor='#f4f4f4' activeOpacity={0.9}>
						<View style={styles.listIconText}>
							<Image style={styles.iconImage} source={require('../images/exchange.jpg')} />
							<View style={styles.listText}>
								<Text style={styles.iconText}>转账</Text>
								<Image style={styles.arrow} source={require('../images/arrow.png')} />
							</View>
						</View>
					</TouchableHighlight>
					<TouchableHighlight style={styles.listItem} onPress={()=>{
						// if(!this.props.isLoggedIn){
						// 	this.props.navigation.navigate('Loginscrn');
						// 	return;
						// }
						this.props.navigation.navigate('Collect');
					}} underlayColor='#f4f4f4' activeOpacity={0.9}>
						<View style={styles.listIconText}>
							<Image style={styles.iconImage} source={require('../images/collect.png')} />
							<View style={styles.listText}>
								<Text style={styles.iconText}>收藏</Text>
								<Image style={styles.arrow} source={require('../images/arrow.png')} />
							</View>
						</View>
					</TouchableHighlight>
					<TouchableHighlight style={styles.listItem} onPress={()=>{
						this.props.navigation.navigate('Setting');
					}} underlayColor='#f4f4f4' activeOpacity={0.9}>
						<View style={styles.listIconText}>
							<Image style={styles.iconImage} source={require('../images/setting.png')} />
							<View style={styles.listText}>
								<Text style={styles.iconText}>设置</Text>
								<Image style={styles.arrow} source={require('../images/arrow.png')} />
							</View>
						</View>
					</TouchableHighlight>
				</View>
			</ScrollView>
  		);
  	}

}


const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
  userInfo: state.auth.userInfo,
});

const mapDispatchToProps = dispatch => ({
  login: (userData) => dispatch({ type: 'Login', userData: userData }),
});

export default connect(mapStateToProps, mapDispatchToProps)(MineScreen);


//定义一些全局变量
const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');
 
const cols = 3;
const boxH = 160;
const wMargin = 0;

const boxW = (width - (cols+1) * wMargin) / cols;
const hMargin = 0;
const styles = StyleSheet.create({
	sscreenViewStyle:{
		backgroundColor:'#fff',
	},
	userInfoView1:{
		height:130,
		flexDirection:'column',
		justifyContent: 'center',
	    alignItems: 'center',
	},
	headpic:{
		width:80,
		height:80,
		marginBottom:10,
	},
	loginBtn:{
		color:'#4dbf4d',
		fontSize:16,
	},
	userInfoView2:{
		flexDirection:'row',
	},
	userInfoItem:{
		height:50,
		flex:1,
		justifyContent:'center',
		alignItems:'center',
		flexDirection:'column',
	},
	userInfoText1:{
		marginBottom:5,
		fontSize:20,
		color:'#666',
		textAlign:'center',
	},
	userInfoText2:{
		fontSize:12,
		color:'#666',
		textAlign:'center',
	},
	sepratorView:{
		height:10,
		backgroundColor:'#f3f3f3',
	},
	listIconText:{
		width:width,
		paddingLeft:18,
		flexDirection:'row',
		justifyContent: 'flex-start',
	    alignItems: 'center',
	},
	iconImage:{
		width:16,
		height:16,
		marginRight:10,
	},
	listText:{
		width:width-44,
		height:40,
		flexDirection:'row',
		paddingRight:10,
		justifyContent: 'space-between',
	    alignItems: 'center',
	    borderBottomWidth:0.5,
	    borderBottomColor:'#e2e2e2',
	},
	iconText:{
		color:'#333',
		fontSize:12,
	},
	arrow:{
		width:7,
		height:11,
	}
});




