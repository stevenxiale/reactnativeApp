
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
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Dimensions from 'Dimensions';


class ItemContent extends Component{
	render(){
		return(
			<TouchableHighlight  style={styles.listItem} underlayColor='#f4f4f4' activeOpacity={0.9} onPress={() => { this.props.navigation.navigate('Detail');} }>
				<View style={styles.listItemView}>
					<Image style={styles.listItemImage} source={require('../images/movie.jpg')} />
					<Text style={styles.listItemText} numberOfLines={1}>{this.props.item}</Text>
				</View>
			</TouchableHighlight>
		);
	}
}

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
class VideoScreen extends Component{
	constructor(props) {
	    super(props);
	    this.state = {
	      dataArray:[],
	      page:0,
	      totalPage:0,
	      isLoading:false,
	    };
	    this._renderRow = this._renderRow.bind(this);
	    this._loadMoreFunc = this._loadMoreFunc.bind(this);
	    this._footer = this._footer.bind(this);
	}
	componentDidMount(){
		this.setState({dataArray:[
			'伦敦恐怖袭击已致7人丧生 英国警方逮捕12名涉案人员',
	        '本山传媒悄然变更经营范围 60岁赵本山转战互联网',
	        '世乒赛-丁宁4-2朱雨玲夺冠 第三次问鼎比肩邓亚萍',
	        '[流言板]米体：利物浦和罗马边锋萨拉赫谈妥个人待遇',
	        '伦敦恐怖袭击已致7人丧生 英国警方逮捕12名涉案人员',
	        '本山传媒悄然变更经营范围 60岁赵本山转战互联网',
	        '伦敦恐怖袭击已致7人丧生 英国警方逮捕12名涉案人员',
	        '本山传媒悄然变更经营范围 60岁赵本山转战互联网',
	    ]});
	    let page = this.state.page;
	    page ++;
	    this.setState({page:page});
	    this.setState({totalPage:3});
	}

	_renderRow(rowData){
		return(
			<TouchableHighlight style={styles.listItem} onPress={() => { this.props.navigation.navigate('Detail');}}>
				<View style={styles.listItemView}>
					<Image style={styles.listItemImage} source={require('../images/movie.jpg')} />
					<Text style={styles.listItemText} numberOfLines={2}>{rowData}</Text>
				</View>
			</TouchableHighlight>
		);
	}
	_loadMoreFunc(){
		if(this.state.isLoading) return;
		if(this.state.page >= this.state.totalPage) return;
		
		this.setState({isLoading:true});
		let arr = this.state.dataArray;
		let page = this.state.page;
		console.log(page);
		for(let i = 0;i < 6 ;i++){
			arr.push('加载的第' + (page+1) + '页，数据'+(i+1)+'条。'+(this.props.category==='imageScreen'?'[10P]':''));
		}
		page ++;
		this.setState({page:page});
		this.setState({dataArray:arr});
		this.setState({isLoading:false});
	}
	_footer(){
		if(this.state.page >= this.state.totalPage){
			return(<Text style={styles.footerStyle}>没有更多了</Text>);
		}else if(this.state.isLoading){
			return(<Text style={styles.footerStyle}>数据加载中...</Text>);
		}else{
			return(<Text style={styles.footerStyle}>上拉加载</Text>);
		}
	}
	render() {
	    return (
	      <ListView
	      	style={styles.backgroundW}
	        dataSource={ds.cloneWithRows(this.state.dataArray)}
	        renderRow={this._renderRow}
	        initialListSize={10}
	        onEndReached={this._loadMoreFunc}
	        onEndReachedThreshold={1}
	        contentContainerStyle={styles.containerStyle}
	      />
	    );
	}
	
}

//定义一些全局变量
const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');
 
const cols = 3;
const boxH = 160;
const wMargin = 10;

const boxW = (width - (cols+1) * wMargin) / cols;
const hMargin = 15;

const styles = StyleSheet.create({
	backgroundW:{
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
});


export default VideoScreen;