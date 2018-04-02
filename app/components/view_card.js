import React, { Component } from 'react';
import QRCode from 'react-native-qrcode';
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

const {width: windowWidth, height: windowHeight} = Dimensions.get('window');

//Buttons for Action Sheet
const BUTTONS = [
    "Edit",
    "Delete",
    "Clear",
    'Cancel',
];

const CANCEL_INDEX = 3;

class ViewCard extends Component {
    constructor(props) {
        super(props);

        this.state = {};
        this.renderItem = this.renderItem.bind(this);
        this.showOptions = this.showOptions.bind(this);
    }

    componentDidMount() {
        this.props.getCards(); //call our action
    }

    showOptions(card) {
        ActionSheetIOS.showActionSheetWithOptions({
                options: BUTTONS,
                cancelButtonIndex: CANCEL_INDEX,
                destructiveButtonIndex: 3,
            },
            (buttonIndex) => {
                if (buttonIndex === 0) Actions.new_card({card: card, edit: true, title:"Edit Card"})
                else if (buttonIndex === 1) this.props.deleteCard(card.id)
                else if (buttonIndex === 2) this.props.clearAll()
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

        } else if (this.props.mode == true) {
                console.log('In Wallet Mode')
            return (
                <View style={styles.container}>
                    <FlatList
                        ref='listRef'
                        data={this.props.cards}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => index}/>


                    <TouchableHighlight style={styles.addButton}
                                        underlayColor='#ff7043' onPress={() => Actions.new_card()}>
                        <Text style={{fontSize: 25, color: 'white'}}>+</Text>
                    </TouchableHighlight>

                </View>
            );

    } else {
      console.log('In Rolodex Mode')
          return (
                <View style={styles.container}>
                    <FlatList
                        ref='listRef'
                        data={this.props.cards}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => index}/>
                </View>
          );
    }
  }

  renderItem({item, index}) {
    console.log(item.id)
    if (item.id == this.props.item.id){
      console.log('Viewing ID:', this.props.id)

      if (item.owner == true) {
              console.log('Viewing your card (can edit)')
        return (
          <View style={{flex: 1, backgroundColor: '#fff'}}>
              <TouchableHighlight onPress={() => this.showOptions(item)} underlayColor='rgba(0,0,0,.2)'>
                <View style={{flex:1, paddingLeft:10, paddingRight:10}}>
                    <Text style={styles.quote}>
                        {item.quote}
                    </Text>
                    <Text style={styles.author}>
                        {item.author}
                    </Text>
                    <Text style={styles.keys}>
                        {item.keys.n}
                    </Text>
                    <Text style={styles.email}>
                        {item.email}
                    </Text>
                    <Text style={styles.owner}>
                        {item.owner.toString()}
                    </Text>
                </View>
            </TouchableHighlight>


            <TouchableOpacity style={styles.saveBtn}
                              onPress={() => Actions.share({card: item})}>
                <Text style={styles.buttonText}>
                    Share QR
                </Text>

            </TouchableOpacity>
            </View>
        )
    } else {
                    console.log('Viewing someone elses card (cannot edit)')
      return (
        <View style={{flex: 1, backgroundColor: '#fff'}}>
            <TouchableHighlight underlayColor='rgba(0,0,0,.2)'>
              <View style={{flex: 1, backgroundColor: '#fff'}}>
                  <Text style={styles.quote}>
                      {item.quote}
                  </Text>
                  <Text style={styles.author}>
                      {item.author}
                  </Text>
                  <Text style={styles.keys}>
                      {item.keys.n}
                  </Text>
                  <Text style={styles.email}>
                      {item.email}
                  </Text>
                  <Text style={styles.owner}>
                      {item.owner.toString()}
                  </Text>
              </View>
          </TouchableHighlight>

          <TouchableOpacity style={[styles.saveBtn]}
                            onPress={() => Actions.share({card: item})}>
              <Text style={styles.buttonText}>
                  Share QR
              </Text>
          </TouchableOpacity>
        </View>
      )
    }




}
  }
};



// The function takes data from the app current state,
// and insert/links it into the props of our component.
// This function makes Redux know that this component needs to be passed a piece of the state
function mapStateToProps(state, props) {
    return {
        loading: state.dataReducer.loading,
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
export default connect(mapStateToProps, mapDispatchToProps)(ViewCard);

const styles = StyleSheet.create({

    container:{
        flex:1,
        backgroundColor: '#F5F5F5'
    },

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
