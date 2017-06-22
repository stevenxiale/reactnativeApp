
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
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import Dimensions from 'Dimensions';




const MineScreen = ({ isLoggedIn, userInfo, toLogin ,navigation}) => (
	<ScrollView style={styles.sscreenViewStyle}>
		<View style={styles.userInfoView1}>
			<Image style={styles.headpic} source={require('../images/head.gif')} />

			{isLoggedIn? <Text style={styles.loginBtn}>{userInfo.email}</Text> :
			<TouchableHighlight  onPress={navigation.navigate('Login')} underlayColor='#f4f4f4' activeOpacity={0.9}><Text style={styles.loginBtn}>登录 / 注册</Text></TouchableHighlight>}

		</View>
		<View style={styles.userInfoView2}>
			<View style={styles.userInfoItem}>
				<Text style={styles.userInfoText1}>{isLoggedIn?userInfo.gold:'--'}</Text>
				<Text style={styles.userInfoText2}>金币剩余</Text>
			</View>
			<View style={styles.userInfoItem}>
				<Text style={styles.userInfoText1}>{isLoggedIn?userInfo.balanceDay:'--'}</Text>
				<Text style={styles.userInfoText2}>会员到期日</Text>
			</View>
			<View style={styles.userInfoItem}>
				<Text style={styles.userInfoText1}>{isLoggedIn?userInfo.VIP:'--'}</Text>
				<Text style={styles.userInfoText2}>会员等级</Text>
			</View>
		</View>
		<View style={styles.sepratorView}/>
		<View>
			<TouchableHighlight style={styles.listItem} onPress={()=>{
				// if(!isLoggedIn){
				// 	toLogin();
				// }else{
					navigation.navigate('Recharge');
				// }
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
				// if(!isLoggedIn){
				// 	toLogin();
				// }else{
					navigation.navigate('Recharge');
				// }
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
					navigation.navigate('Exchange');
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
					navigation.navigate('Collect');
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
					navigation.navigate('Setting');
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

MineScreen.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  userInfo: PropTypes.object.isRequired,
  toLogin: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
  userInfo: state.auth.userInfo,
});

const mapDispatchToProps = dispatch => ({
  toLogin: () => dispatch(NavigationActions.navigate({ routeName: 'Login'})),
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




