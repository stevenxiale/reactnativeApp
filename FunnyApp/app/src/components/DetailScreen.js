import React from 'react';
import { 
  View,
  Text,
  TouchableHighlight,
}from 'react-native';

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
  render() {
    return (
      <View>
        <Text>Chat with Lucy</Text>
        <TouchableHighlight onPress = { () => {this.props.navigation.goBack();}} >
          <Text>To MainScreen</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

export default DetailScreen;