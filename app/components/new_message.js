import React, {Component} from 'react';
import {StyleSheet, View, Dimensions, Text, TextInput, TouchableOpacity} from 'react-native';

import { addMessage } from '../actions'
import { Actions } from 'react-native-router-flux';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { Select, Option } from 'react-native-select-list';
//import {RSAKeychain, RSA} from 'react-native-rsa-native';

import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import * as ReduxActions from '../actions'; //Import your actions

const {width: windowWidth, height: windowHeight} = Dimensions.get('window');

class NewMessage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            to: "",
            from: "",
            message: ""
        };

        this.generateID = this.generateID.bind(this);
        this.addMessage = this.addMessage.bind(this);
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

    generateTimestamp() {
      var time = new Date().getTime()/1000
      var time_round = parseInt(time)
      return time_round
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
      console.log(privateKey)

      rsa.setPublicString(publicKey);
      var originText = 'sample String Value';
      console.log(originText)
      var encrypted = rsa.encrypt(originText);
      console.log(encrypted)
      var decrypted = rsa.decrypt(encrypted); // decrypted == originText
      console.log(decrypted)
      return privateKey;
    }

    addMessage() {

            let id = this.generateID();
            let unix = this.generateTimestamp();
            //let keys_json = JSON.parse(keys);
            console.log(unix)
            console.log(id)
            console.log(this.state.to)
            console.log(this.state.from)
            console.log(this.state.message)
            let message = {"id": id, "to": this.state.to, "from": this.state.from, "message": this.state.message, "time": unix, "read": false};
            console.log(message.id)
            console.log(message.to)
            console.log(message.from)
            console.log(message.message)
            console.log(message.time)

            this.props.addMessage(message);

        Actions.pop();
    }

    render() {
      //console.log(this.props.cards)
        //var arr = [[]];
        //{this.props.cards.map(function(card, index){
        //  arr[index]=[];
        //  arr[index][0]=card.keys.n
        //  arr[index][1]=card.author
      //  })}
      //console.log(arr)

      const from = this.props.cards.filter(function(obj) {return obj.owner == true}).map(card => {
        return (
          <Option value={card.keys.n}>{card.author}</Option>
        )
      })
      from.unshift(<Option value={0}>Sender</Option>)

      const to = this.props.cards.filter(function(obj) {return obj.owner == false}).map(card => {
        return (
          <Option value={card.keys.n}>{card.author}</Option>
        )
      })
      to.unshift(<Option value={0}>Receiver</Option>)
        //var array = this.props.cards
        console.log('cards')
        console.log(this.props.cards)
        console.log('messages')
        console.log(this.props.messages)


        if (this.props.reply) {
          console.log('in reply mode', this.props.to, this.props.from)
          this.state.from = this.props.from;
          this.state.to = this.props.to;
          return (
          <View style={{flex: 1, backgroundColor: '#fff'}}>
              <View style={{flex:1, paddingLeft:10, paddingRight:10}}>

                <Text style={styles.keys}>
                    To: {this.props.to}
                </Text>

              <Text style={styles.keys}>
                  From: {this.props.from}
              </Text>


                  <TextInput
                      multiline={true}
                      onChangeText={(text) => this.setState({message: text})}
                      placeholder={"Enter Message"}
                      style={[styles.quote]}
                      value={this.state.quote}
                  />
              </View>
              <TouchableOpacity style={[styles.saveBtn]}
                                disabled={(this.state.to != 0 && this.state.from != 0 && this.state.message.length > 0) ? false : true}
                                onPress={this.addMessage}>
                  <Text style={[styles.buttonText,
                      {
                          color: (this.state.to != 0 && this.state.from != 0 && this.state.message.length > 0) ? "#FFF" : "rgba(255,255,255,.5)"
                      }]}>
                      Send
                  </Text>
              </TouchableOpacity>
              <KeyboardSpacer />
          </View>
        );
        } else {
          return (
              <View style={{flex: 1, backgroundColor: '#fff'}}>
                  <View style={{flex:1, paddingLeft:5, paddingRight:5}}>

                    <Select onSelect={text => this.setState({ to: text })}>
                    {to}
                    </Select>

                    <Select onSelect={text => this.setState({ from: text })}>
                    {from}
                    </Select>


                      <TextInput
                          multiline={true}
                          onChangeText={(text) => this.setState({message: text})}
                          placeholder={"Enter Message"}
                          style={[styles.quote]}
                          value={this.state.quote}
                      />
                  </View>
                  <TouchableOpacity style={[styles.saveBtn]}
                                    disabled={(this.state.to != 0 && this.state.from != 0 && this.state.message.length > 0) ? false : true}
                                    onPress={this.addMessage}>
                      <Text style={[styles.buttonText,
                          {
                              color: (this.state.to != 0 && this.state.from != 0 && this.state.message.length > 0) ? "#FFF" : "rgba(255,255,255,.5)"
                          }]}>
                          Send
                      </Text>
                  </TouchableOpacity>
                  <KeyboardSpacer />
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
        cards: state.dataReducer.cards,
        messages: state.dataReducer.messages
    }
}

// Doing this merges our actions into the component’s props,
// while wrapping them in dispatch() so that they immediately dispatch an Action.
// Just by doing this, we will have access to the actions defined in out actions file (action/home.js)
function mapDispatchToProps(dispatch) {
    return bindActionCreators(ReduxActions, dispatch);
}

//Connect everything
export default connect(mapStateToProps, mapDispatchToProps)(NewMessage);


//Connect everything
//export default connect(null, {addMessage})(NewMessage);

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

    keys: {
        fontSize: 10,
        fontWeight: "600",
        marginTop: 8 * 2
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
