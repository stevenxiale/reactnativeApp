
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




const SettingScreen = ({ isLoggedIn, userInfo, toLogin ,navigation}) => (
  <ScrollView style={styles.sscreenViewStyle}>
    <View style={styles.settingArea}>
      <TouchableHighlight style={styles.listItem} onPress={()=>{
        // if(!isLoggedIn){
        //  toLogin();
        // }else{
          navigation.navigate('UpdateInfo');
        // }
      }} underlayColor='#f4f4f4' activeOpacity={0.9}>
        <View style={[styles.listItemView,styles.borderBotton]}>
          <Text style={styles.iconText}>修改密码</Text>
          <Image style={styles.arrow} source={require('./images/arrow.png')} />
        </View>
      </TouchableHighlight>
      <TouchableHighlight style={styles.listItem} onPress={()=>{
          navigation.navigate('UpdateInfo');
      }} underlayColor='#f4f4f4' activeOpacity={0.9}>
        <View style={styles.listItemView}>
          <Text style={styles.iconText}>绑定邮箱</Text>
          <Image style={styles.arrow} source={require('./images/arrow.png')} />
        </View>
      </TouchableHighlight>
    </View>

    <TouchableHighlight style={styles.lgoutButton} onPress={()=>{
        navigation.goBack();
    }} underlayColor='#f4f4f4' activeOpacity={0.9}>
        <Text style={styles.lgoutButtonText}>退出账号</Text>
    </TouchableHighlight>
  </ScrollView>
);

SettingScreen.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen);


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
    backgroundColor:'#f9f9f9',
  },
  settingArea:{
    borderBottomWidth:0.5,
    borderBottomColor:'#e2e2e2',
  },
  listItem:{
    backgroundColor:'#fff',
  },
  listItemView:{
    height:40,
    marginLeft:20,
    flexDirection:'row',
    paddingRight:10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  borderBotton:{
    borderBottomWidth:0.5,
    borderBottomColor:'#e2e2e2',
  },
  iconText:{
    color:'#333',
    fontSize:14,
  },
  arrow:{
    width:7,
    height:11,
  },
  lgoutButton:{
    height:40,
    marginTop:20,
    backgroundColor:'#fff',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
  },
  lgoutButtonText:{
    width:90,
    color:'#333',
    fontSize:14,
    textAlign:'center',
  }
});




