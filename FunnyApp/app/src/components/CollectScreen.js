
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
	ActivityIndicator,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Dimensions from 'Dimensions';
import { connect } from 'react-redux';


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
	  component.setState({isLoading:false});
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
  
  request.open('GET', 'http://127.0.0.1:5000/user/wishes');
  request.setRequestHeader('Content-type', 'application/json');
  request.setRequestHeader('x-login-token',loginToken);
  request.setRequestHeader('x-user-id',userInfo.id);

  let body = {
    page_num:component.state.page,
    per_page:20,
  };
  request.send(JSON.stringify(body));
}

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
class CollectScreen extends Component{
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
	    };
	    this._renderRow = this._renderRow.bind(this);
	    this._loadMoreFunc = this._loadMoreFunc.bind(this);
	    this._footer = this._footer.bind(this);
	    this._clickItem = this._clickItem.bind(this);
	    this._isInArray = this._isInArray.bind(this);

	    getFavList(this,this.props.userInfo,this.props.loginToken);
	}
	componentDidMount(){
	}

	_renderRow(rowData){
		return(
			<TouchableHighlight  style={styles.listItem} underlayColor='#f4f4f4' activeOpacity={0.9} onPress={this._clickItem} data-id={rowData.id} >
				<Text style={styles.titleStyle} numberOfLines={2}>{rowData}</Text>
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
	_isInArray(arr,ele){
		for(let i = 0;i < arr.length;i++){
			if(arr[i] == ele){
				return true;
			}
		}
		return false;
	}
	_clickItem(e){
		let param = this.props;
		let artId = e.target.getAttribute('data-artId');

		this.props.navigation.navigate('Detail',{artId:artId,from:'collectList'});
		return;
	}
	render() {
		if(this.state.loadSucc ){
		    return (
		      <View>
			      <ListView
			      	style={styles.bgWhite}
			        dataSource={ds.cloneWithRows(this.state.dataArray)}
			        renderRow={this._renderRow}
			        initialListSize={20}
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
			      <Image style={styles.wifiImg} source={require('./images/nowifi.jpg')} />
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

export default connect(mapStateToProps)(CollectScreen);


//定义一些全局变量
const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');

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

	backgroundW:{
		backgroundColor:'#fff',
	},
	listItem:{
		paddingLeft:10,
		paddingRight:10,
		paddingTop:10,
		paddingBottom:10,
		borderBottomWidth:0.5,
		borderBottomColor:'#e2e2e2',
	},
	titleStyle:{
		fontSize:14,
		lineHeight:24,
		color:'#666',
		textAlign:'left',
	},
	footerStyle:{
		height:40,
		paddingTop:12.5,
		textAlign:'center',
		fontSize:12,
		color:'#999',
	},
});


