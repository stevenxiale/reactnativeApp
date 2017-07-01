import React from 'react';
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
}from 'react-native';
import { NavigationActions } from 'react-navigation';
import Dimensions from 'Dimensions';
import { connect } from 'react-redux';

import Storage from '../util/Storage';

const getArt = function(component,userInfo,loginToken){
  var request = new XMLHttpRequest();
  request.onreadystatechange = (e) => {
    if (request.readyState !== 4) {
      return;
    }
    if (request.status === 200) {
      let data = JSON.parse(request._response);
      component.setState({article:data});
      component.setState({loadSucc:true});
      component.setState({isLoading:false});
      component._saveArt();
      component.updateGold(data);
    } else {
      Alert.alert('提示',request._response,[{text:'确定',onPress:()=>{}}]);
      component.setState({loadSucc:false});
      component.setState({isLoading:false});
    }
  };
  
  request.open('GET', 'http://127.0.0.1:5000/item/actioners');
  request.setRequestHeader('Content-type', 'application/json');
  request.setRequestHeader('x-login-token',loginToken);
  request.setRequestHeader('x-user-id',userInfo.id);

  let body = {
    artId:component.state.page,
    per_page:12,
  };
  request.send(JSON.stringify(body));
}


class DetailScreen extends React.Component {
  static navigationOptions = {
    title: '详情',
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
  constructor(props){
    super(props);
    this.state = {
      artId:this.props.navigation.state.params.artId,
      from:this.props.navigation.state.params.from,
      isLoading:true,
      animating: true,
      loadSucc:false,
      hasVisited:false,
      videoVisitedList:[],
      article:{},
    };
    this._saveArt = this._saveArt.bind(this);

  }

  componentDidMount(){
    Storage.getItem('videoVisitedList').then((ret)=>{
      let list = JSON.parse(ret);
      this.setState({videoVisitedList:list});
      if(list['_'+this.state.artId]){
        let article = list['_'+this.state.artId];
        this.setState({article:article});
        this.setState({hasVisited:true});
        this.setState({isLoading:false});
      }else{
        getArt(this,this.props.userInfo,this.props.loginToken);
      }
    });
  }


  render() {
    if(this.state.hasVisited || this.state.loadSucc){
      if(this.state.from === 'videoScreen'){
        return (
          <View>
            <View>
              <Text>重磅!雷霆步行者达成交易 泡椒入俄城联手威少</Text>
              <Text>人民日报 2017-07-01 12:26</Text>
            </View>
            <View>
              <Image style={styles.videoScreenImg} source={{uri:this.visiterData.image}} />
              <Text>http://sports.sina.com.cn/basketball/nba/2017-07-01/doc-ifyhrxtp6395310.shtml</Text>
            </View>
            <View>
              <TouchableHighlight><Text>点赞</Text></TouchableHighlight>
              <TouchableHighlight><Text>打赏</Text></TouchableHighlight>
            </View>
          </View>
        )
      }
      if(this.state.from === 'imageScreen'){
        return (
          <View>
            <View>
              <Text>重磅!雷霆步行者达成交易 泡椒入俄城联手威少</Text>
              <Text>人民日报 2017-07-01 12:26</Text>
            </View>
            <View>
              <Image style={styles.imageScreenImg} source={require('./images/dili.png')} />
              <Image style={styles.imageScreenImg} source={require('./images/dili.png')} />
              <Image style={styles.imageScreenImg} source={require('./images/dili.png')} />
              <Image style={styles.imageScreenImg} source={require('./images/dili.png')} />
            </View>
          </View>
        );
      }
      if(this.state.from === 'textScreen'){
        return(
          <View>
            <View>
              <Text>重磅！习近平就香港落实‘一国两制’谈四点意见</Text>
              <Text>人民日报 2017-07-01 12:26</Text>
            </View>
            <View>
              <Text>全面深化改革已进入施工高峰期。习近平总书记在这一轮改革启动之初就提出“抓铁有痕、踏石留印”“一分部署，九分落实”，已成为改革工作的金句。习近平总书记在中央全面深化改革领导小组第34次会议上进一步指出，督察是抓落实的重要手段。从初期强调要配备专门督察力量，到中央深改领导小组会议专题研究改革督察落实工作，到明确提出“三督三察”，到进一步要求提高督察工作的广度深度，全面深化改革每推进一步，党中央对抓督察促落实的要求就更进一步。</Text>
            </View>

          </View>
        );
      }
    }else if(isLoading){
      return (
        <View>
          <ActivityIndicator
            animating={this.state.animating}
            style={styles.centering}
            size= 'small'
            color= '#fff'
          />
        </View>
      );
    }else if(!this.state.loadSucc){
      return (
          <View>
            <View style={styles.noWifiWrapper}>
            <Image style={styles.wifiImg} source={require('./images/nowifi.jpg')} />
            <Text style={styles.reloadText1}>网络状况不佳</Text>
            <Text style={styles.reloadText2}>请检查您的网络设置</Text>
            <TouchableHighlight underlayColor='#f4f4f4' activeOpacity={0.9} style={styles.reloadBtn}
              onPress = {() => {
              this.setState({isLoading:true});
              getArt(this,this.props.userInfo,this.props.loginToken);
            }}>
              <Text style={styles.reloadText}>重新加载</Text>
            </TouchableHighlight>
            </View>
          </View>
        )
    }
  }

  _saveArt(){
    this.state.videoVisitedList['_'+this.state.artId] = this.state.article;
    let newVisitedList = this.state.videoVisitedList;
    Storage.setItem('videoVisitedList',JSON.stringify(newVisitedList));
  }
}
const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
  userInfo:state.auth.userInfo,
  loginToken:state.auth.loginToken,
});
const mapDispatchToProps = dispatch => ({
  updateGold: (gold) => dispatch({ type: 'updateGold', gold: gold }),
});

export default connect(mapStateToProps,mapDispatchToProps)(DetailScreen);

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






