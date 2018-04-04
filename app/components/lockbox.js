import React, {Component} from 'react';
import {StyleSheet, View, Dimensions, Text, TextInput, TouchableOpacity} from 'react-native';

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
            publicKeyString: "",
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
      console.log(this.state.publicKeyString)
      console.log(this.state.cypherString)
      var RSAKey = require('react-native-rsa');
      var rsa = new RSAKey();

      var cardMatch = null;
      for (var i = 0, len = this.props.cards.length; i < len; i++) {
        console.log('iterating!', i)
        if (this.props.cards[i].keys.n === this.state.publicKeyString) {
          cardMatch = this.props.cards[i];
          break;
        }
      }
      if (cardMatch) {
        console.log('card match key output:', cardMatch.keys)
        var jsond = JSON.stringify(cardMatch.keys)
        rsa.setPrivateString(jsond);
        var decrypted = rsa.decrypt(this.state.cypherString); // decrypted == originText
        console.log('the cyper says:',decrypted)
        // TODO: add to messages!
      }
      else {
        console.log("couldnt find a matching public key users cards")
      }
      Actions.pop();
    }

    encryptMessage() {
      Actions.pop();
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
        return (
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                <View style={{flex:1, paddingLeft:10, paddingRight:10}}>
                    <TextInput
                        onChangeText={(text) => this.setState({author: text})}
                        placeholder={"Public Key"}
                        autoFocus={true}
                        style={[styles.title]}
                        value={this.state.author}
                    />
                    <TextInput
                        multiline={true}
                        onChangeText={(text) => this.setState({quote: text})}
                        placeholder={"Enter Cypher String"}
                        style={[styles.quote]}
                        value={this.state.quote}
                    />
                </View>
                <TouchableOpacity style={[styles.saveBtn]}
                                  disabled={(this.state.author.length > 0 && this.state.quote.length > 0) ? false : true}
                                  onPress={this.encryptMessage}>
                    <Text style={[styles.buttonText,
                        {
                            color: (this.state.author.length > 0 && this.state.quote.length > 0) ? "#FFF" : "rgba(255,255,255,.5)"
                        }]}>
                        Done
                    </Text>
                </TouchableOpacity>
                <KeyboardSpacer />
            </View>
        );
      }
      else if (this.props.mode === 'decrypt') {
                      console.log('In decrypt Mode')

                      return (
                          <View style={{flex: 1, backgroundColor: '#fff'}}>
                              <View style={{flex:1, paddingLeft:10, paddingRight:10}}>
                                  <TextInput
                                      onChangeText={(text) => this.setState({publicKeyString: text})}
                                      placeholder={"Public Key"}
                                      autoFocus={true}
                                      style={[styles.title]}
                                      value={this.state.publicKeyString}
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
                                                disabled={(this.state.publicKeyString.length > 0 && this.state.cypherString.length > 0) ? false : true}
                                                onPress={this.decryptMessage}>
                                  <Text style={[styles.buttonText,
                                      {
                                          color: (this.state.publicKeyString.length > 0 && this.state.cypherString.length > 0) ? "#FFF" : "rgba(255,255,255,.5)"
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
