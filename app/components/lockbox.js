import React, {Component} from 'react';
import {StyleSheet, View, Dimensions, Text, TextInput, TouchableOpacity, Linking} from 'react-native';

import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';

import * as ReduxActions from '../actions'; //Import your actions

import { addCard, updateCard, clearAll } from '../actions'
import { Actions } from 'react-native-router-flux';
import KeyboardSpacer from 'react-native-keyboard-spacer';
//import {RSAKeychain, RSA} from 'react-native-rsa-native';

const {width: windowWidth, height: windowHeight} = Dimensions.get('window');

class Lockbox extends Component {

    constructor(props) {
        super(props);

        this.state = {
            author: (props.edit) ? props.card.author : "",
            quote: (props.edit) ? props.card.quote : "",
            email: (props.edit) ? props.card.email : "",
            publicKeyTo: "",
            publicKeyFrom: "",
            time: "",
            id: "",
            cypherString: ""
        };

        this.generateID = this.generateID.bind(this);
        this.addCard = this.addCard.bind(this);
        this.decryptMessage= this.decryptMessage.bind(this);
        this.generateKeys = this.generateKeys.bind(this)
    }

    generateID() {
        let d = new Date().getTime();
        let id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(5);
        });
        return id;
    }

    generateKeys() {
      console.log('RSA public private keys!')
      var RSAKey = require('react-native-rsa');
      const bits = 1024;
      const exponent = '10001'; // must be a string. This is hex string. decimal = 65537
      var rsa = new RSAKey();
      rsa.generate(bits, exponent);
      var publicKey = rsa.getPublicString(); // return json encoded string
      var privateKey = rsa.getPrivateString(); // return json encoded string
      console.log(publicKey)
      console.log('privatekey string:',privateKey)

      rsa.setPublicString(publicKey);
      var originText = 'sample String Value';
      console.log(originText)
      var encrypted = rsa.encrypt(originText);
      console.log(encrypted)
      var decrypted = rsa.decrypt(encrypted); // decrypted == originText
      console.log(decrypted)
      return privateKey;
    }
    decryptMessage() {
      console.log(this.state.publicKeyTo)
      console.log(this.state.cypherString)
      var RSAKey = require('react-native-rsa');
      var rsa = new RSAKey();

      var cardMatch = null;
      for (var i = 0, len = this.props.cards.length; i < len; i++) {
        console.log('iterating!', i)
        if (this.props.cards[i].keys.n === this.state.publicKeyTo) {
          cardMatch = this.props.cards[i];
          break;
        }
      }
      if (cardMatch) {
        console.log('card match key output:', cardMatch.keys)
        var jsond = JSON.stringify(cardMatch.keys)
        rsa.setPrivateString(jsond);
        console.log('the cyperedtext string is:',this.state.cypherString)
        console.log('the private key is:',jsond)
        var decrypted = rsa.decrypt(this.state.cypherString); // decrypted == originText
        console.log('the cyper says:',decrypted)
        console.log('state:', this.state)

        //packge for the transition to thread view and add to persistant storage
        messageOb = [];
        messageOb.to = this.state.publicKeyTo;
        messageOb.from = this.state.publicKeyFrom;
        messageOb.time = this.state.time;
        messageOb.id = this.state.id;
        messageOb.message = decrypted;
        messageOb.read = true;

        let messageOb = {"id": this.state.id, "to": this.state.publicKeyTo, "from": this.state.publicKeyFrom, "message": decrypted, "time": this.state.time, "read": false};

        console.log('message object:', messageOb)

        // TODO: add to messages!
        this.props.addMessage(messageOb);

        Actions.pop();
        Actions.home();
        Actions.inbox();
        Actions.message_thread({senderRecieverKeys: messageOb});
      }
      else {
        console.log("couldnt find a matching public key users cards")
        Actions.pop();
      }
    }

    encryptMessage2() {
      //Actions.pop();
      Actions.pop();
      setTimeout(() => {Actions.pop()}, 100)
    }

    encryptMessage() {
      var cardMatch = null;
      for (var i = 0, len = this.props.cards.length; i < len; i++) {
        console.log('iterating!', i)
        if (this.props.cards[i].keys.n === this.props.message.to) {
          cardMatch = this.props.cards[i];
          break;
        }
      }
      if (cardMatch) {
        console.log('card match key output:', cardMatch.keys)
        var email = cardMatch.email
        var toKey = cardMatch.keys.n
        var subject = "Id.ly - New Message"

        var RSAKey = require('react-native-rsa');
        var rsa = new RSAKey();

        //json key object

        var obj = new Object();
        obj.n = toKey;
        obj.e = "10001";
        //"e":"10001"
        var jsonString= JSON.stringify(obj);
        console.log('public json:', jsonString)


        this.generateKeys();
        rsa.setPublicString(jsonString);


        var encrypted = rsa.encrypt(this.props.message.message);
      //mailto:mailto@deniseleeyohn.com?subject=abcdefg&body=body'
        var uri = "mailto:" + email + "?" + "subject=" + subject + "&body=" + "PublicKey To: " + toKey + "\nPublicKey From: " + this.props.message.from + "\nTimestamp: " + this.props.message.time + "\nID: " + this.props.message.id +"\nCypher: " + encrypted
        console.log('uri:', uri)
        //encode for email url

        var res = encodeURI(uri);

        console.log('url:', res)

        return res.toString();
      }
      else {
        console.log("couldnt find a matching public key in users card rolodex")
      }
    }

    addCard() {
        if (this.props.edit){
            let card = this.props.card;
            card['author'] = this.state.author;
            card['quote'] = this.state.quote;
            card['email'] = this.state.email;
            //this.props.updateCard(card);
        }else{
            let id = this.generateID();
            let keys = this.generateKeys();
            let keys_json = JSON.parse(keys);
            let card = {"id": id, "keys": keys_json, "author": this.state.author, "quote": this.state.quote, "email": this.state.email, "owner": true};
            console.log(card.keys.n)
            console.log(card.keys)
            //this.props.addCard(card);
        }

        Actions.pop();
    }

    render() {
      if (this.props.mode === 'encrypt') {
              console.log('In encrypt Mode')
              console.log(this.props.message)
              var url = this.encryptMessage();
        return (
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                <View style={{flex:1, paddingLeft:10, paddingRight:10}}>
                  <Text>

                  </Text>

                </View>
                <TouchableOpacity style={[styles.saveBtn]}
                                  onPress={() => Linking.openURL(url)}>
                    <Text style={[styles.buttonText,
                        {
                            color: "#FFF"
                        }]}>
                        Email
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.saveBtn]}
                                  onPress={this.encryptMessage2}>
                    <Text style={[styles.buttonText,
                        {
                            color: "#FFF"
                        }]}>
                        Done
                    </Text>
                </TouchableOpacity>
            </View>
        );
      }
      else if (this.props.mode === 'decrypt') {
                      console.log('In decrypt Mode')

                      return (
                          <View style={{flex: 1, backgroundColor: '#fff'}}>
                              <View style={{flex:1, paddingLeft:10, paddingRight:10}}>
                                  <TextInput
                                      onChangeText={(text) => this.setState({publicKeyTo: text})}
                                      placeholder={"Public Key To"}
                                      autoFocus={true}
                                      style={[styles.title]}
                                      value={this.state.publicKeyTo}
                                  />
                                  <TextInput
                                      onChangeText={(text) => this.setState({publicKeyFrom: text})}
                                      placeholder={"Public Key From"}
                                      autoFocus={true}
                                      style={[styles.title]}
                                      value={this.state.publicKeyFrom}
                                  />
                                  <TextInput
                                      onChangeText={(text) => this.setState({time: text})}
                                      placeholder={"Time"}
                                      autoFocus={true}
                                      style={[styles.title]}
                                      value={this.state.time}
                                  />
                                  <TextInput
                                      onChangeText={(text) => this.setState({id: text})}
                                      placeholder={"ID"}
                                      autoFocus={true}
                                      style={[styles.title]}
                                      value={this.state.id}
                                  />
                                  <TextInput
                                      multiline={true}
                                      onChangeText={(text) => this.setState({cypherString: text})}
                                      placeholder={"Enter Cypher String"}
                                      style={[styles.quote]}
                                      value={this.state.cypherString}
                                  />
                              </View>
                              <TouchableOpacity style={[styles.saveBtn]}
                                                disabled={(this.state.publicKeyTo.length > 0 && this.state.publicKeyFrom.length > 0 && this.state.time.length > 0 && this.state.id.length > 0 && this.state.cypherString.length > 0) ? false : true}
                                                onPress={this.decryptMessage}>
                                  <Text style={[styles.buttonText,
                                      {
                                          color: (this.state.publicKeyTo.length > 0 && this.state.publicKeyFrom.length > 0 && this.state.time.length > 0 && this.state.id.length > 0 && this.state.cypherString.length > 0) ? "#FFF" : "rgba(255,255,255,.5)"
                                      }]}>
                                      Decrypt
                                  </Text>
                              </TouchableOpacity>
                              <KeyboardSpacer />
                          </View>
                      );


      }
      else {
        console.log('In no mode.. strange')
                return (
<View style={{flex: 1, backgroundColor: '#fff'}}>
<Text>Weird...</Text>
</View>
                );
      }
    }

}


// The function takes data from the app current state,
// and insert/links it into the props of our component.
// This function makes Redux know that this component needs to be passed a piece of the state
function mapStateToProps(state, props) {
    return {
        loading: state.dataReducer.loading,
        cards: state.dataReducer.cards,
        messages: state.dataReducer.cards
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ReduxActions, dispatch);
}

//Connect everything
export default connect(mapStateToProps, mapDispatchToProps)(Lockbox);



var styles = StyleSheet.create({
    saveBtn:{
        width: windowWidth,
        height: 44,
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor:"#6B9EFA"
    },

    buttonText:{
        fontWeight: "500",
    },

    quote: {
        fontSize: 17,
        lineHeight: 38,
        fontFamily: 'Helvetica Neue',
        color: "#333333",
        padding: 16,
        paddingLeft:0,
        flex:1,
        height: 150,
        marginBottom:50,
        borderTopWidth: 1,
        borderColor: "rgba(212,211,211, 0.3)",
    },

    title: {
        fontWeight: "400",
        lineHeight: 22,
        fontSize: 16,
        fontFamily: 'Helvetica Neue',
        height:25+32,
        padding: 16,
        paddingLeft:0
    },

    email: {
        fontWeight: "400",
        lineHeight: 22,
        fontSize: 16,
        fontFamily: 'Helvetica Neue',
        height:25+32,
        padding: 16,
        paddingLeft:0
    },
});
