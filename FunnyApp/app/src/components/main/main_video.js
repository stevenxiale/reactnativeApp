
import React,{Component} from 'react';
import {
	StyleSheet,
	Text,
	ScrollView,
	ListView,
	View,
	Image,
	Platform,
	TouchableHighlight,
	Alert,
	ActivityIndicator,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Dimensions from 'Dimensions';
import { connect } from 'react-redux';

import Storage from '../../util/Storage';

const getFavList = function(component,userInfo,loginToken){
  var request = new XMLHttpRequest();
  request.onreadystatechange = (e) => {
    if (request.readyState !== 4) {
      return;
    }
    if (request.status === 200) {
      let data = JSON.parse(request._response);
      let dataArray = component.state.dataArray.concat(data.items);
      component.setState({dataArray:dataArray});
	  component.setState({totalPage:data.pages});
	  if(component.state.page === 1)
	  	component.setState({loadSucc:true});

	  if(component.state.page > 1)
	  	component.setState({connected:true});

	  let page = component.state.page;
	  page ++;
	  component.setState({page:page});
    } else {
      // Alert.alert('提示',request._response,[{text:'确定',onPress:()=>{}}]);
      component.setState({isLoading:false});
      if(component.state.loadSucc) 
      	component.setState({connected:false});
    }
  };
  
  request.open('GET', 'http://127.0.0.1:5000/item/actioners');
  request.setRequestHeader('Content-type', 'application/json');
  // request.setRequestHeader('x-login-token',loginToken);
  // request.setRequestHeader('x-user-id',userInfo.id);

  let body = {
    page_num:component.state.page,
    per_page:12,
  };
  request.send(JSON.stringify(body));
}


const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
class VideoScreen extends Component{
	constructor(props) {
	    super(props);
	    this.state = {
	      dataArray:[],
	      page:1,
	      totalPage:0,
	      isLoading:true,
	      animating: true,
	      loadSucc:false,
	      connected:true,
	      visitedList:[],
	    };
	    this._renderRow = this._renderRow.bind(this);
	    this._loadMoreFunc = this._loadMoreFunc.bind(this);
	    this._footer = this._footer.bind(this);
	    this._clickItem = this._clickItem.bind(this);

	    getFavList(this,this.props.userInfo,this.props.loginToken);
	}
	componentDidMount(){
		Storage.getItem('visitedList').then((ret)=>{
			let list = JSON.parse(ret);
			this.setState({visitedList:list});
		});
	}
	_renderRow(rowData){
		return(
			<TouchableHighlight style={styles.listItem} onPress={this._clickItem} data-id={rowData.id} >
				<View style={styles.listItemView}>
					<Image style={styles.listItemImage} source={{uri:rowData.cover}} />
					<Text style={styles.listItemText} numberOfLines={2}>{rowData.title}</Text>
				</View>
			</TouchableHighlight>
		);
	}
	_loadMoreFunc(){
		if(this.state.isLoading) return;
		if(this.state.page >= this.state.totalPage) return;
		
		this.setState({isLoading:true});
		getFavList(this,this.props.userInfo,this.props.loginToken);
	}
	_footer(){
		if(this.state.page >= this.state.totalPage){
			return(<Text style={styles.footerStyle}>没有更多了</Text>);
		}else if(this.state.isLoading){
			return(<Text style={styles.footerStyle}>数据加载中...</Text>);
		}else if(!this.state.connected){
			return(<Text style={styles.footerStyle}>网络有点问题...</Text>);
		}else{
			return(<Text style={styles.footerStyle}>上拉加载</Text>);
		}
	}
	_clickItem(e){
		let param = this.props;
		if(!param.isLoggedIn){
			this.props.navigation.navigate('LoginScrn');
			return;
		}

		let artId = e.target.getAttribute('data-artId');
		if(param.userInfo.deadline){
			this.props.navigation.navigate('Detail',{artId:artId,from:'videoScreen'});
			return;
		}

		if(this.state.visitedList.includes(artId)){
			this.props.navigation.navigate('Detail',{artId:artId,from:'videoScreen'});
			return;
		}

		if(param.userInfo.total < 10){
			Alert.alert('提示','金币不足，请先充值',[{text:'确定',onPress:()=>{}}]);
			return;
		}
	}
	render() {
		if(this.state.loadSucc ){
		    return (
		      <View>
			      <ListView
			      	style={styles.bgWhite}
			        dataSource={ds.cloneWithRows(this.state.dataArray)}
			        renderRow={this._renderRow}
			        initialListSize={10}
			        onEndReached={this._loadMoreFunc}
			        onEndReachedThreshold={1}
			        contentContainerStyle={styles.containerStyle}
			      />
		      </View>
		    )
		}else if(this.state.isLoading){
			return (
				<View>
			      	<ActivityIndicator
				      animating={this.state.animating}
				      style={styles.centering}
				      size= 'small'
	               	  color= '#fff'
					/>
				</View>
			)
		}else{
			return (
		      <View>
		      	<View style={styles.noWifiWrapper}>
			      <Image style={styles.wifiImg} source={require('../images/nowifi.jpg')} />
			      <Text style={styles.reloadText1}>网络状况不佳</Text>
			      <Text style={styles.reloadText2}>请检查您的网络设置</Text>
			      <TouchableHighlight underlayColor='#f4f4f4' activeOpacity={0.9} style={styles.reloadBtn}
			      	onPress = {() => {
			      	this.setState({isLoading:true});
			      	getFavList(this,this.props.userInfo,this.props.loginToken);
			      }}>
			      	<Text style={styles.reloadText}>重新加载</Text>
			      </TouchableHighlight>
		      	</View>
		      </View>
		    )
		}
	}
	
}

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
  userInfo:state.auth.userInfo,
  loginToken:state.auth.loginToken,
});

export default connect(mapStateToProps)(VideoScreen);

//定义一些全局变量
const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');
 
const cols = 3;
const boxH = 160;
const wMargin = 10;

const boxW = (width - (cols+1) * wMargin) / cols;
const hMargin = 15;

const styles = StyleSheet.create({
	noWifiWrapper:{
		width:width,
		height:height,
		flexDirection:'column',
		justifyContent:'flex-start',
		alignItems:'center',
	},
	wifiImg:{
		width:120,
		height:100,
		marginTop:200,
		marginBottom:10,
	},
	reloadBtn:{
		width:160,
		height:30,
		marginTop:15,
		borderWidth:0.5,
		borderColor:'#999',
		borderRadius:8,
		flexDirection:'row',
		justifyContent:'center',
		alignItems:'center',
	},
	reloadText:{
		color:'#333',
		fontSize:16,
	},
	reloadText1:{
		fontSize:16,
		color:'#666',
		marginBottom:8,
	},
	reloadText2:{
		fontSize:12,
		color:'#999',
	},


	bgWhite:{
		backgroundColor:'#fff',
	},
	containerStyle:{
		flexDirection:'row',
		flexWrap:'wrap',
		alignItems:'center',
	},
	listItem:{
		width:boxW,  
        height:boxH,
        marginLeft:wMargin,  
        marginTop:hMargin,  
	},
	listItemView:{
		width:boxW,  
        height:boxH,
		flexDirection:'column',
		justifyContent: 'center',
	    alignItems: 'center',
	},
	listItemImage:{
		width:boxW,
		height:boxW,
		marginBottom:5,
	},
	listItemText:{
		fontSize:12,
		lineHeight:16,
		color:'#666',
		textAlign:'center',
	},
	footerStyle:{
		height:40,
		lineHeight:40,
		fontSize:12,
		color:'#999',
		textAlign:'center',
	},
	centering:{
		position:'absolute',
		width:40,
		height:40,
		marginTop:200,
		marginLeft:(width - 40)/2,
		transform:[{scale:2}],
		backgroundColor:'gray',
		borderRadius:5,
    },
});
