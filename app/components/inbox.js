import React, { Component } from 'react';
import {
    StyleSheet,
    FlatList,
    View,
    Text,
    ActivityIndicator, TouchableHighlight, ActionSheetIOS
} from 'react-native';

import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import * as ReduxActions from '../actions'; //Import your actions

import {Actions} from 'react-native-router-flux'

//Buttons for Action Sheet
const BUTTONS = [
    "Delete",
    "Clear",
    'Cancel',
];

const CANCEL_INDEX = 2;

class Inbox extends Component {
    constructor(props) {
        super(props);

        this.state = {};
        this.renderItem = this.renderItem.bind(this);
        this.showOptions = this.showOptions.bind(this);
    }

    componentDidMount() {
        this.props.getMessages(); //call our action
    }

    showOptions(message) {
        ActionSheetIOS.showActionSheetWithOptions({
                options: BUTTONS,
                cancelButtonIndex: CANCEL_INDEX,
                destructiveButtonIndex: 2,
            },
            (buttonIndex) => {
                if (buttonIndex === 0) this.props.deleteMessage(message.id)
                else if (buttonIndex === 1) this.props.clearAll()
            });
    }

    getAuthor(publicKey) {
      var author = publicKey;
      for (var i = 0, len = this.props.cards.length; i < len; i++) {
        if (this.props.cards[i].keys.n === publicKey) {
          author = this.props.cards[i].author
        }
      }
      return author;
    }

    render() {

        if (this.props.loading) {
          console.log('In Loading Mode')
            return (
                <View style={styles.activityIndicatorContainer}>
                    <ActivityIndicator animating={true}/>
                </View>
            );

    } else {
      console.log('In Inbox Mode')
      var arr = [];
      //arr.push({"to": "hi", "from": "hello"})
      console.log('arr', arr[0])
      //console.log( .size(this.props.messages.Data) );
      for (var i = 0, len = this.props.messages.length; i < len; i++) {
        console.log('iterating!', i)
        console.log(this.props.messages[i].to)
        // check array for to and from pair
        var present = false;

        for (var j = 0, len2 = arr.length; j < len2; j++ ) {
          console.log('checking arr!', j, arr[j].to.toString())
          console.log('trouble:',arr[j].to === this.props.messages[i].to)
          if (arr[j].to === this.props.messages[i].to && arr[j].from === this.props.messages[i].from) {
            present = true;
          }
          if (arr[j].to === this.props.messages[i].from && arr[j].from === this.props.messages[i].to) {
            present = true;
          }
        }
        // now add to array if combination not present
        if (present == false) {
          console.log('adding to array!', j)
          arr.push({to: this.props.messages[i].to, from: this.props.messages[i].from})
        }
        else {
          console.log('not adding because its already in list!', j)
        }
      }

      console.log('pairs hopefully', arr)
      //arr = [[]];
      //console.log('cleared', arr)
          return (
                <View style={styles.container}>
                    <FlatList
                        ref='listRef'
                        data={arr}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => index}/>

                <TouchableHighlight style={styles.addButton}
                                    underlayColor='#ff7043' onPress={() => Actions.new_message()}>
                    <Text style={{fontSize: 25, color: 'white'}}>+</Text>
                </TouchableHighlight>

                </View>
          );
    }
  }

  renderItem({item, index}) {
    console.log(item.owner)
    if (item.owner == this.props.mode){
      console.log('In Mode:', this.props.mode)
      var toAuthor = this.getAuthor(item.to);
      var fromAuthor = this.getAuthor(item.from);

      return (
          <TouchableHighlight onPress={() => Actions.message_thread({senderRecieverKeys: item})} underlayColor='rgba(0,0,0,.2)'>
              <View style={styles.row}>
                  <Text style={styles.quote}>
                      {toAuthor}
                  </Text>
                  <Text style={styles.author}>
                      {fromAuthor}
                  </Text>
              </View>
          </TouchableHighlight>

      )
}
  }


};



// The function takes data from the app current state,
// and insert/links it into the props of our component.
// This function makes Redux know that this component needs to be passed a piece of the state
function mapStateToProps(state, props) {
    return {
        loading: state.dataReducer.loading,
        messages: state.dataReducer.messages,
        cards: state.dataReducer.cards
    }
}

// Doing this merges our actions into the component’s props,
// while wrapping them in dispatch() so that they immediately dispatch an Action.
// Just by doing this, we will have access to the actions defined in out actions file (action/home.js)
function mapDispatchToProps(dispatch) {
    return bindActionCreators(ReduxActions, dispatch);
}

//Connect everything
export default connect(mapStateToProps, mapDispatchToProps)(Inbox);

const styles = StyleSheet.create({

    container:{
        flex:1,
        backgroundColor: '#F5F5F5'
    },

    activityIndicatorContainer:{
        backgroundColor: "#fff",
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },

    row:{
        borderBottomWidth: 1,
        borderColor: "#ccc",
        padding: 10
    },

    author: {
        fontSize: 14,
        fontWeight: "600",
        marginTop: 8 * 2
    },

    keys: {
        fontSize: 10,
        fontWeight: "600",
        marginTop: 8 * 2
    },

    email: {
        fontSize: 10,
        fontWeight: "600",
        marginTop: 8 * 2
    },

    owner: {
        fontSize: 10,
        fontWeight: "600",
        marginTop: 8 * 2
    },

    quote: {
        marginTop: 5,
        fontSize: 14,
    },

    addButton: {
        backgroundColor: '#ff5722',
        borderColor: '#ff5722',
        borderWidth: 1,
        height: 50,
        width: 50,
        borderRadius: 50 / 2,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 20,
        right: 20,
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 0
        }
    }
});
