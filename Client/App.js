import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import { ActivityIndicator, AppRegistry, TextInput, Button, Platform, StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, Image, FlatList, ListItem, AlertIOS, ScrollView} from 'react-native';
var Contacts = require('react-native-contacts')
import Communications from 'react-native-communications';
import Swipeout from 'react-native-swipeout';
var _ = require('underscore');
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';

//What the Server should give us
// var allCommunicationPreferenceOptions = ["I'll Text", "I'll Call",]
// var allCommunicationFrequencyOptions = ["Every Day","Every Week","Every 2 Weeks","Every Month","Every 3 Months","Never"]
// var allGroups = [{key:1, group:"Siblings"},{key:2, group:"Parents"},{key:2.5, group:"Children"},{key:3, group:"Grandparents"},{key:1.1, group:"Siblings-In-Laws"},{key:2.1, group:"Parent-In-Laws"},{key:4, group:"Uncles & Aunts"},{key:5, group:"Cousins (1st)"},{key:6, group:"Cousins (2nd)"},{key:7, group:"Godparents"},{key:8, group:"Nieces & Nephews"}]
// allGroups.map(x => (
//   x.contacts = [],
//   x.communicationMethod = "I'll Text",
//   x.communicationFrequency = "Never"
// ))

allCommunicationPreferenceOptions = null;
allCommunicationFrequencyOptions = null;
allGroups = null;
groupsImPartOf = null;
groupsImNotPartOf = null;


class MainHeader extends React.Component {
  constructor(props){
    super(props);
    this.state = {}
  }

  render(){
    return (
      <View style={{flex:0.1, flexDirection: 'row', backgroundColor:'#767d87', marginTop:20 }}>
        <View style={{width: "10%", height: 50}}>
          <TouchableOpacity onPress={() => this.props.onClick()}>
            <Image source={require('./app/assets/logout.png')} />
         </TouchableOpacity>
        </View>
        <View style={{width: '80%', height: 50, alignItems:'center', justifyContent:'center'}}>
          <Text style={{fontFamily:'HelveticaNeue-Light', color: '#F5FCFF',fontSize:30}}>stay in touch</Text>
        </View>
        <View style={{width: "10%", height: 50, alignItems:'center', justifyContent:'center'}}>
          {this.props.showPlus ?
          <TouchableOpacity onPress={() => this.props.onClickAdd()}>
            <Text style={{fontFamily:'HelveticaNeue-Light', color: '#F5FCFF',fontSize:20}}> + </Text>
          </TouchableOpacity>
          :           <TouchableOpacity onPress={() => this.props.onClickAdd()}>
                      <Text style={{fontFamily:'HelveticaNeue-Light', color: '#F5FCFF',fontSize:20}}> + </Text>
                    </TouchableOpacity>
          }
        </View>
      </View>
    )
  }

}

class BackupHeader extends React.Component {
  constructor(props){
    super(props);
    this.state = {}
  }

  render(){
    return (
      <View style={{flex:0.2, flexDirection: 'row', backgroundColor:'#767d87', marginTop:20 }}>
        <View style={{width: "10%", height: 50, alignItems:'center', justifyContent:'center'}}>
          <TouchableOpacity onPress={() => this.props.onClick()}>
            <Text style={{fontFamily:'HelveticaNeue-Light', color: '#F5FCFF',fontSize:20}}> {'<'} </Text>
          </TouchableOpacity>
        </View>
        <View style={{width: '80%', height: 50, alignItems:'center', justifyContent:'center'}}>
          <Text style={{fontFamily:'HelveticaNeue-Light', color: '#F5FCFF',fontSize:30}}>{this.props.title}</Text>
        </View>
        <View style={{width: "10%", height: 50, alignItems:'center', justifyContent:'center'}}>
          {this.props.showPlus ?
          <TouchableOpacity onPress={() => this.props.onClickAdd()}>
            <Text style={{fontFamily:'HelveticaNeue-Light', color: '#F5FCFF',fontSize:20}}> + </Text>
          </TouchableOpacity>
          : false
          }
        </View>
      </View>
    )
  }

}



class MainScreen extends React.Component {
  static navigationOptions = {
    title: 'Main',
    headerLeft: null,
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      modalVisible: false,
      newGroup: "",
      groupsImPartOf: groupsImPartOf,
      groupsImNotPartOf: groupsImNotPartOf,
    };
  }

  _signOut() {
    GoogleSignin.revokeAccess().then(() => GoogleSignin.signOut()).then(() => {
      this.setState({user: null});
      this.props.navigation.navigate('Login');
    })
    .done();
  }

  componentDidMount(){
    return fetch('http://localhost:3000/users/')
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("Look what the server gave me:",responseJson)
        allCommunicationPreferenceOptions = responseJson.allCommunicationPreferenceOptions
        allCommunicationFrequencyOptions = responseJson.allCommunicationFrequencyOptions
        allGroups = responseJson.allGroups
        groupsImPartOf = responseJson.groupsImPartOf
        groupsImNotPartOf = responseJson.groupsImNotPartOf
        this.setState({
          isLoading: false,
          groupsImPartOf:groupsImPartOf,
          groupsImNotPartOf:groupsImNotPartOf,
        }, function() {
          // do something with new state
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  removeCategory(category){
    console.log("get rid of:", category)
    fetch('http://localhost:3000/users/removecategory', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: category,
        }),
      })
      .then((resp) => resp.json())
      .then(respJSON => this.modifyLocalCategories(respJSON))
      .catch(err => console.log(err))
  }

  modifyLocalCategories(respJSON){
    this.setState({
      groupsImNotPartOf: respJSON.groupsImNotPartOf,
      groupsImPartOf: respJSON.groupsImPartOf,
    })
    groupsImNotPartOf = this.state.groupsImNotPartOf
    groupsImPartOf= this.state.groupsImPartOf
  }


  render() {
    console.log("Groups Im Part Of: ", this.state.groupsImPartOf)
    if (this.state.isLoading) {
       return (
         <View style={{flex: 1, paddingTop: 20}}>
           <ActivityIndicator />
         </View>
       );
     }

    return (
        <View style={{flex: 1, backgroundColor:'#767d87'}}>
          <MainHeader onClick={() => this._signOut()} onClickAdd={() => this.props.navigation.navigate('CategorySelector',{refresh: () => this.setState({groupsImPartOf: groupsImPartOf})})}/>

          <FlatList
             data={this.state.groupsImPartOf}
             extraData={this.state.groupsImPartOf}
             renderItem={(x) =>
               <Swipeout style={{backgroundColor:'#767d87'}} right={[{text: 'Remove', backgroundColor: 'red', onPress: () => { this.removeCategory(x.item.item) } }]} autoClose={true}>
                 <TouchableOpacity
                  style={{alignItems: 'center', backgroundColor: '#F5FCFF', padding: 20, marginTop: 10, marginLeft:10, marginRight:10}}
                  onPress={() => this.props.navigation.navigate('Group',{name:x.item.item})}
                  >
                    <Text style={{color: '#767d87', fontSize: 30, fontFamily: 'HelveticaNeue-Thin'}}> {x.item.item} </Text>
                 </TouchableOpacity>
               </Swipeout>
             }
           />
        </View>
    )
  }
}

class CategorySelectorScreen extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      groupsImNotPartOf: groupsImNotPartOf,
      groupsImPartOf: groupsImPartOf
    }
  }

  static navigationOptions = ({ navigation }) => ({
    title: "Select Categories",
    header: null
  });

  modifyLocalCategories(respJSON){
    this.setState({
      groupsImNotPartOf: respJSON.groupsImNotPartOf,
      groupsImPartOf: respJSON.groupsImPartOf,
    })
    groupsImNotPartOf = this.state.groupsImNotPartOf
    groupsImPartOf= this.state.groupsImPartOf
  }

  addCategory(category){
    fetch('http://localhost:3000/users/addcategory', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: category,
        }),
      })
      .then((resp) => resp.json())
      .then(respJSON => this.modifyLocalCategories(respJSON))
      .catch(err => console.log(err))
  }

  handleGoBack(){
    this.props.navigation.state.params.refresh()
    this.props.navigation.goBack()
  }

  render(){
    return(
      <View style={{flex:1, backgroundColor:'#767d87'}}>
        <BackupHeader title="categories" onClick={ () => this.handleGoBack()} onClickAdd={ () => this.props.navigation.navigate('AddToGroup')}/>

        <FlatList
           data={this.state.groupsImNotPartOf}
           extraData={this.state.groupsImNotPartOf}
           renderItem={(x) =>
               <TouchableOpacity
                style={{alignItems: 'center', backgroundColor: '#F5FCFF', padding: 20, marginTop: 10, marginLeft:10, marginRight:10}}
                onPress={() => this.addCategory(x)}
                >
                  <Text style={{color: '#767d87', fontSize: 30, fontFamily: 'HelveticaNeue-Thin'}}> {x.item} </Text>
               </TouchableOpacity>
           }
         />
      </View>
    )
  }
}


class GroupScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.name,
    header: null
  });


  constructor(props) {
    super(props);
    this.state = {
      group: allGroups.filter(x => x.group === this.props.navigation.state.params.name)[0].group,
      contacts: allGroups.filter(x => x.group === this.props.navigation.state.params.name)[0].contacts,
      communicationMethod: allGroups.filter(x => x.group === this.props.navigation.state.params.name)[0].communicationMethod,
      communicationFrequency: allGroups.filter(x => x.group === this.props.navigation.state.params.name)[0].communicationFrequency,
    };
  }

  returnOptionsForAllCommunicationMethods(){
    let temp = []
    allCommunicationPreferenceOptions.map(x => (
      temp.push({text: x, onPress: () => this.setState({communicationMethod: x})})
    ))
    temp.push({ text: 'Cancel', onPress: () => true})
    return temp
  }

  returnOptionsForAllCommunicationFrequency(){
    let temp = []
    allCommunicationFrequencyOptions.map(x => (
      temp.push({text: x, onPress: () => this.setState({communicationFrequency: x})})
    ))
    temp.push({ text: 'Cancel', onPress: () => true})
    return temp
  }


  promptForCommunicationMethod(){
    AlertIOS.prompt(
      'Select Communication Method',
      'How you would like to ping members of this group?',
      this.returnOptionsForAllCommunicationMethods(),
      null,
    );
  }

  promptForCommunicationFrequency(){
    AlertIOS.prompt(
      'Select Communication Frequency',
      'About how often would you like to ping members of this group?',
      this.returnOptionsForAllCommunicationFrequency(),
      null,
    );
  }

  handleGroupSave(){
    //UPDATE DATABASE
    allGroups.filter(x => x.group === this.state.group)[0].contacts = this.state.contacts
    allGroups.filter(x => x.group === this.state.group)[0].communicationMethod = this.state.communicationMethod
    allGroups.filter(x => x.group === this.state.group)[0].communicationFrequency = this.state.communicationFrequency
    this.props.navigation.goBack()
  }

  handleRefreshPage(){
    this.setState({contacts: allGroups.filter(x => x.group === this.state.group)[0].contacts})
  }

  render() {
    return (
        <View style={{flex:1, backgroundColor:'#767d87'}}>
          <BackupHeader title={this.state.group} onClick={ () => this.handleGroupSave()}/>
          <View>
            <TouchableOpacity
              style={{    flex: 1, alignItems: 'center', backgroundColor: "white", justifyContent: 'center', padding: 40, marginTop: 10, marginLeft:10, marginRight:10, borderWidth: 4, borderColor: '#767d87',}}
              onPress={() => this.promptForCommunicationMethod()}
            >
              <Text style={{    fontSize: 40, color: 'black', fontFamily: 'HelveticaNeue-Thin',}}> {this.state.communicationMethod} </Text>
            </TouchableOpacity>

            <View style={{backgroundColor: '#767d87'}}>
              <TouchableOpacity
                style={{flex: 1, alignItems: 'center', backgroundColor: "white", justifyContent: 'center', padding: 40, marginTop: 10, marginLeft:10, marginRight:10, borderWidth: 4, borderColor: '#767d87'}}
                onPress={() => this.props.navigation.navigate('ManageContact', {group: this.state.group, originScreenTitle:this.state.group, refresh: () => this.handleRefreshPage()})}
              >

                <Text style={{fontSize: 33, color: 'black', fontFamily: 'HelveticaNeue-Thin',}}> {this.state.contacts.length===0 ? "0 people" : this.state.contacts.length===1 ? this.state.contacts[0].firstName : this.state.contacts.length===2 ? this.state.contacts[0].firstName + "\n & " + this.state.contacts[1].firstName : this.state.contacts[0].firstName + "\n & " + String(this.state.contacts.length-1) + " others"}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={{flex: 1, alignItems: 'center', backgroundColor: "white", justifyContent: 'center', padding: 40, marginTop: 10, marginLeft:10, marginRight:10, borderWidth: 4, borderColor: '#767d87'}}
              onPress={() => this.promptForCommunicationFrequency()}
            >
              <Text style={{fontSize: 30, color: 'black', fontFamily: 'HelveticaNeue-Thin'}}> {this.state.communicationFrequency} </Text>
            </TouchableOpacity>
          </View>
        </View>
    )
  }
}

class ContactListItem extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      contact: this.props.contact
    }
  }


  componentDidMount(){
  }

  render(){
    return (
      <View style={{marginLeft:10, marginRight:10, marginTop: 8}}>
        <TouchableOpacity style={{backgroundColor:'white', padding: 10}} onPress={ () => this.props.onClick(this.state.contact)}>
          <Text style={{fontSize:30 ,fontFamily: 'HelveticaNeue-Thin'}}>{this.state.contact.firstName + " " + this.state.contact.lastName}</Text>
        </TouchableOpacity>
      </View>
    )
  }

}

class AddToGroupScreen extends React.Component{
  static navigationOptions = ({ navigation }) => ({
    title: "Add Contacts To Group",
    header: null
  });

  constructor(props) {
    super(props);
    this.state = {
      group: this.props.navigation.state.params.group,
      contacts: allGroups.filter(x => x.group === this.props.navigation.state.params.group)[0].contacts,
      potentialNewContacts: [],
    };
  }

  filterContactsByString(filter){
    if(filter.length === 0){
      this.setState({potentialNewContacts: []});
    }else{
      Contacts.getContactsMatchingString(filter, (err, contacts) => {
        if(err === 'denied'){
        }else {
          //Remove contacts already in group from returned results
          contacts = contacts.filter(x => this.state.contacts.map(y => y.recordID).indexOf(x.recordID) === -1)
          console.log("Got Contacts:",contacts)
          this.setState({potentialNewContacts: null});
          this.setState({potentialNewContacts: contacts});
        }
      })
    }
  }

  addMemberToGroup(contact){
    //DATABASE CALL!
    console.log("Adding member to group,", allGroups.filter(x => x.group === this.state.group)[0].contacts)
    fetch('http://localhost:3000/users/addcontacttogroup', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contact: contact,
          group: this.state.group,
        }),
      })
      .then((resp) => resp.json())
      .then(respJSON => allGroups.filter(x => x.group === this.state.group)[0].contacts = respJSON.contacts)
      .then(respJSON => this.props.navigation.state.params.refresh())
      .then(respJSON => this.props.navigation.goBack())
      .catch(err => console.log(err))
  }

  parseContact(contact){
    return {
      key: contact.item.givenName+contact.item.phoneNumbers.map(x => x.label === "mobile" ? x.number : false)[0],
      firstName: contact.item.givenName,
      lastName: contact.item.familyName,
      mobile: contact.item.phoneNumbers.filter(x => x.label === "mobile").length>0 ? contact.item.phoneNumbers.filter(x => x.label === "mobile")[0].number : false,
      email: contact.item.emailAddresses.filter(x => (x.label === "work" || x.label === "home")).length>0 ? contact.item.emailAddresses.filter(x =>(x.label === "work" || x.label === "home"))[0].email : false,
      address: contact.item.postalAddresses,
      recordID: contact.item.recordID
    }
  }

  render(){
    return(
      <View style={{flex:1, backgroundColor:'#767d87'}}>
        <BackupHeader showPlus={false} title="Add Contacts" onClick={() => this.props.navigation.goBack()}/>

        <TextInput
          style={{height: 40, color: 'black', backgroundColor:'white', marginLeft:10, marginRight:10, marginTop: -50, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(text) => this.filterContactsByString(text)}
          value={this.state.text}
          placeholder="Search for contact here"
        />

        <FlatList
           data={this.state.potentialNewContacts}
           extraData={this.state}
           keyboardShouldPersistTaps='always'
           renderItem={(x) =>
             <View>
               {console.log("Contact:",JSON.stringify(x))}
               <ContactListItem contact={this.parseContact(x)} onClick={(contact) => this.addMemberToGroup(contact)} />
            </View>
             }
         />

      </View>
    )
  }


}


class ManageContactScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Manage Group",
    header: null
  });


  constructor(props) {
    super(props);
    this.state = {
      group: this.props.navigation.state.params.group,
      contacts: allGroups.filter(x => x.group === this.props.navigation.state.params.group)[0].contacts,
    };
  }

  modifyLocalState(respJSON){
    allGroups.filter(x => x.group === this.state.group)[0].contacts = respJSON.contacts
    this.setState({contacts: allGroups.filter(x => x.group === this.state.group)[0].contacts})
  }

  removeMemberFromGroup(contact){
    //DATABASE CALL!
    console.log("Ayo what up,", contact.item, this.state.group)
    fetch('http://localhost:3000/users/removecontactfromgroup', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contact: contact.item,
          group: this.state.group,
        }),
      })
      .then((resp) => resp.json())
      .then(respJSON => this.modifyLocalState(respJSON))
      .catch(err => console.log(err))
  }

  handleRefreshPage(){
    this.setState({contacts: allGroups.filter(x => x.group === this.state.group)[0].contacts})
  }

  handleGoBack(){
    this.props.navigation.state.params.refresh()
    this.props.navigation.goBack()
  }

  render() {
    return (
        <View style={{flex:1, backgroundColor:'#767d87'}}>
          <BackupHeader showPlus={true} title="Manage Group" onClick={() => this.handleGoBack()} onClickAdd={ () => this.props.navigation.navigate('AddToGroup',{group: this.state.group, refresh: () => this.handleRefreshPage()})}/>
          <FlatList
             data={this.state.contacts}
             extraData={this.state.contacts}
             renderItem={(x) =>
               <Swipeout style={{backgroundColor:'#767d87'}} right={[{text: 'Delete', backgroundColor: 'red', onPress: () => { this.removeMemberFromGroup(x) } }]} autoClose={true}>
                 <View style={{backgroundColor: 'white', justifyContent: 'center', padding: 10, marginTop: 10, marginLeft:10, marginRight:10}}>
                   <Text style={{color: '#767d87', fontSize: 30, fontFamily: 'HelveticaNeue-Light',}}> {x.item.firstName + " " + x.item.lastName} </Text>
                 </View>
               </Swipeout>
             }
           />
        </View>
    )
  }
}



class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login',
    header: null
  }

  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
  }

  componentDidMount() {
    this._setupGoogleSignin();
  }

  render() {
    if (!this.state.user) {
      return (
        <View style={styles.container}>
          <View style={{flex:1,width:'95%',marginTop:30,marginBottom:10,justifyContent:'center',alignItems:'center',borderRadius: 2, borderWidth: 0.5, borderColor: '#d6d7da',}}>
            <View style={{flex:1,width:'100%',marginTop:2,marginBottom:0,marginLeft:3,justifyContent:'center',alignItems:'center',borderRadius: 0.5, borderWidth: 0.8, borderColor: '#d6d7da',}}>
              <Text style={{fontFamily:'HelveticaNeue-Light', fontSize: 40, color:'#bdc0c9', marginBottom:15}}>
                  stay in touch
              </Text>
              <GoogleSigninButton style={{width: 212, height: 48}} size={GoogleSigninButton.Size.Standard} color={GoogleSigninButton.Color.Auto} onPress={this._signIn.bind(this)}/>
            </View>
          </View>
        </View>
      );
    }

    if (this.state.user) {
      return this.props.navigation.navigate('Main');
    }
  }

  async _setupGoogleSignin() {
    try {
      await GoogleSignin.hasPlayServices({ autoResolve: true });
      await GoogleSignin.configure({
        iosClientId: '830227759772-bjejvqbp4ihf1o38uu1e3t9uk47c4kq7.apps.googleusercontent.com',
      });

      const user = await GoogleSignin.currentUserAsync();
      console.log(user);
      this.setState({user});
    }
    catch(err) {
      console.log("Google signin error", err.code, err.message);
    }
  }

  _signIn() {
    GoogleSignin.signIn()
    .then((user) => {
      console.log(user);
      this.setState({user: user});
    })
    .catch((err) => {
      console.log('WRONG SIGNIN', err);
    })
    .done();
  }

  _signOut() {
    GoogleSignin.revokeAccess().then(() => GoogleSignin.signOut()).then(() => {
      this.setState({user: null});
    })
    .done();
  }
}

class RegisterScreen extends React.Component {
  // static navigationOptions = {
  //   title: 'Register'
  // };
  //
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     usernameText: 'Username',
  //     passwordText: 'Password'
  //  };
  // }
  //
  //
  // submitRegistration(){
  //   fetch('https://hohoho-backend.herokuapp.com/register', {
  //     method: 'POST',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       username: this.state.usernameText,
  //       password: this.state.passwordText,
  //     }),
  //   })
  //   .then((resp) => resp.json())
  //   .then(jsonVal => console.log(jsonVal))
  //   .catch(err => console.log(err))
  // }
  //
  // render() {
  //   return (
  //     <KeyboardAvoidingView
  //        style={styles.container}
  //        behavior="padding"
  //      >
  //       <TextInput
  //         style={{height: 40, width: 300, borderColor: 'gray', borderWidth: 1}}
  //         onChangeText={(text) => this.setState({usernameText: text})}
  //         value={this.state.usernameText}
  //       />
  //       <TextInput
  //         style={{height: 40, width: 300, borderColor: 'gray', borderWidth: 1, marginTop: 20}}
  //         secureTextEntry={true}
  //         onChangeText={(text) => this.setState({passwordText: text})}
  //         value={this.state.passwordText}
  //       />
  //       <Button
  //         onPress={() => this.submitRegistration()}
  //         title="Submit"
  //         color="#841584"
  //         accessibilityLabel="Learn more about this purple button"
  //       />
  //   </KeyboardAvoidingView>
  //   )
  // }
}


export default StackNavigator({
  Login: {
    screen: LoginScreen,
  },
  Register: {
    screen: RegisterScreen,
  },
  Main: {
    screen: MainScreen,
  },
  Group: {
    screen: GroupScreen,
  },
  ManageContact: {
    screen: ManageContactScreen,
  },
  AddToGroup:{
    screen: AddToGroupScreen,
  },
  CategorySelector:{
    screen: CategorySelectorScreen,
  },
},
{initialRouteName: 'Login'});

//Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#767d87',
  },
  button: {
    alignSelf: 'stretch',
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5
  },
  buttonBlue: {
    backgroundColor: '#0074D9',
  },

});

AppRegistry.registerComponent('LoginScreen', () => LoginScreen);
