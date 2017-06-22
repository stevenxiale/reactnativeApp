
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



const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
class TextScreen extends Component{
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
	        '[流言板]米体：利物浦和罗马边锋萨拉赫谈妥个人待遇,利物浦和罗马边锋萨拉赫谈妥个人待遇,利物浦和罗马边锋萨拉赫谈妥个人待遇',
	    ]});
	    let page = this.state.page;
	    page ++;
	    this.setState({page:page});
	    this.setState({totalPage:5});
	}

	_renderRow(rowData){
		return(
			<TouchableHighlight  style={styles.listItem} underlayColor='#f4f4f4' activeOpacity={0.9} onPress={() => { this.props.navigation.navigate('Detail');} }>
				<Text style={styles.titleStyle} numberOfLines={2}>{rowData}</Text>
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
		for(let i = 0;i < 15 ;i++){
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
	        initialListSize={20}
	        onEndReached={this._loadMoreFunc}
	        onEndReachedThreshold={1}
	        renderFooter={this._footer}
	      />
	    );
	}
	
}

const styles = StyleSheet.create({
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


export default TextScreen;