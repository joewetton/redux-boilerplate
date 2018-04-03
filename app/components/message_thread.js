import React, { Component } from 'react';
import {
    StyleSheet,
    FlatList,
    View,
    Text,
    Dimensions,
    ActivityIndicator, TouchableHighlight, ActionSheetIOS, TouchableOpacity
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

const {width: windowWidth, height: windowHeight} = Dimensions.get('window');

class MessageThread extends Component {
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

    render() {

        if (this.props.loading) {
          console.log('In Loading Mode')
            return (
                <View style={styles.activityIndicatorContainer}>
                    <ActivityIndicator animating={true}/>
                </View>
            );

    } else {
      console.log('In Thread Mode')
      console.log('item', this.props.senderRecieverKeys, this.props.senderRecieverKeys.to, this.props.senderRecieverKeys.from)
          return (
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                <View style={{flex:1, paddingLeft:10, paddingRight:10}}>
                    <FlatList
                      inverted
                        ref='listRef'
                        data={this.props.messages}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => index}/>
                        </View>
                        <TouchableHighlight style={styles.addButton}
                                            underlayColor='#ff7043' onPress={() => Actions.new_message({to: this.props.senderRecieverKeys.to, from: this.props.senderRecieverKeys.from, reply: true, title:"Reply"})}>
                            <Text style={{fontSize: 25, color: 'white'}}>+</Text>
                        </TouchableHighlight>

                </View>

          );
    }
  }

  renderItem({item, index}) {
    console.log(item.owner)
    if ((item.to === this.props.senderRecieverKeys.to && item.from === this.props.senderRecieverKeys.from) || (item.to === this.props.senderRecieverKeys.from && item.from === this.props.senderRecieverKeys.to)) {
      return (
          <TouchableHighlight onPress={() => this.showOptions(item)} underlayColor='rgba(0,0,0,.2)'>
              <View style={styles.row}>
                  <Text style={styles.quote}>
                      {item.to}
                  </Text>
                  <Text style={styles.author}>
                      {item.from}
                  </Text>
                  <Text style={styles.keys}>
                      {item.message}
                  </Text>
                  <Text style={styles.email}>
                      {item.time}
                  </Text>
                  <Text style={styles.owner}>
                      {item.read.toString()}
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
export default connect(mapStateToProps, mapDispatchToProps)(MessageThread);

const styles = StyleSheet.create({

    container:{
        flex:1,
        backgroundColor: '#F5F5F5'
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
