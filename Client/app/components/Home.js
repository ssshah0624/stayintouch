import React, { Component } from 'react';
import {
  TextInput,
  Button,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default class Home extends Component<{}> {
  constructor(props){
    super(props)

    this.state = {
      username: "",
      pwd: "",
    }

    this.login = this.login.bind(this);
  }

  login(){

  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={{height: 40, width:285, borderColor: 'gray', borderWidth: 1}}
          editable = {true}
          defaultValue={this.state.username}
          onChangeText={(username) => this.setState({username})}
        />
        <TextInput
          style={{height: 40, width:285, borderColor: 'gray', borderWidth: 1}}
          editable = {true}
          defaultValue={this.state.pwd}
          onChangeText={(pwd) => this.setState({pwd})}
        />
        <Button
          onPress={this.login}
          title="HOME"
          color="#841584"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
