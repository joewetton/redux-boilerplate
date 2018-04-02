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
    "Edit",
    "Delete",
    "Clear",
    'Cancel',
];

const CANCEL_INDEX = 3;

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.renderItem = this.renderItem.bind(this);
        this.showOptions = this.showOptions.bind(this);
    }

    componentDidMount() {
        this.props.getQuotes(); //call our action
    }

    showOptions(quote) {
        ActionSheetIOS.showActionSheetWithOptions({
                options: BUTTONS,
                cancelButtonIndex: CANCEL_INDEX,
                destructiveButtonIndex: 3,
            },
            (buttonIndex) => {
                if (buttonIndex === 0) Actions.new_quote({quote: quote, edit: true, title:"Edit Quote"})
                else if (buttonIndex === 1) this.props.deleteQuote(quote.id)
                else if (buttonIndex === 2) this.props.clearQuote()
            });
    }

    render() {

        if (this.props.loading) {
            return (
                <View style={styles.activityIndicatorContainer}>
                    <ActivityIndicator animating={true}/>
                </View>
            );
        } else {
            return (
                <View style={styles.container}>

                  <TouchableHighlight onPress={() => Actions.card_list({title:"Wallet", mode: true})} underlayColor='rgba(0,0,0,.2)'>
                      <View style={styles.row}>
                          <Text style={styles.author}>
                              Wallet
                          </Text>
                      </View>
                  </TouchableHighlight>

                  <TouchableHighlight onPress={() => Actions.card_list({title:"Rolodex", mode: false})} underlayColor='rgba(0,0,0,.2)'>
                      <View style={styles.row}>
                          <Text style={styles.author}>
                              Rolodex
                          </Text>
                      </View>
                  </TouchableHighlight>

                  <TouchableHighlight onPress={() => Actions.card_list()} underlayColor='rgba(0,0,0,.2)'>
                      <View style={styles.row}>
                          <Text style={styles.author}>
                              Inbox
                          </Text>
                      </View>
                  </TouchableHighlight>

                  <TouchableHighlight onPress={() => Actions.card_list()} underlayColor='rgba(0,0,0,.2)'>
                      <View style={styles.row}>
                          <Text style={styles.author}>
                              About
                          </Text>
                      </View>
                  </TouchableHighlight>

                  <TouchableHighlight onPress={() => Actions.scan()} underlayColor='rgba(0,0,0,.2)'>
                      <View style={styles.row}>
                          <Text style={styles.author}>
                              Scan
                          </Text>
                      </View>
                  </TouchableHighlight>

                    <FlatList
                        ref='listRef'
                        data={this.props.quotes}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => index}/>


                    <TouchableHighlight style={styles.addButton}
                                        underlayColor='#ff7043' onPress={() => Actions.new_quote()}>
                        <Text style={{fontSize: 25, color: 'white'}}>Add</Text>
                    </TouchableHighlight>

                    <TouchableHighlight style={styles.listButton}
                                        underlayColor='#ff7043' onPress={() => Actions.card_list()}>
                        <Text style={{fontSize: 25, color: 'white'}}>List</Text>
                    </TouchableHighlight>
                </View>
            );
        }
    }

    renderItem({item, index}) {
        return (
            <TouchableHighlight onPress={() => this.showOptions(item)} underlayColor='rgba(0,0,0,.2)'>
                <View style={styles.row}>
                    <Text style={styles.quote}>
                        {item.quote}
                    </Text>
                    <Text style={styles.author}>
                        {item.author}
                    </Text>
                    <Text style={styles.keys}>
                        {item.keys.n}
                    </Text>
                    <Text style={styles.owner}>
                        {item.owner.toString()}
                    </Text>
                </View>
            </TouchableHighlight>
        )
    }
};



// The function takes data from the app current state,
// and insert/links it into the props of our component.
// This function makes Redux know that this component needs to be passed a piece of the state
function mapStateToProps(state, props) {
    return {
        loading: state.dataReducer.loading,
        quotes: state.dataReducer.quotes
    }
}

// Doing this merges our actions into the component’s props,
// while wrapping them in dispatch() so that they immediately dispatch an Action.
// Just by doing this, we will have access to the actions defined in out actions file (action/home.js)
function mapDispatchToProps(dispatch) {
    return bindActionCreators(ReduxActions, dispatch);
}

//Connect everything
export default connect(mapStateToProps, mapDispatchToProps)(Home);

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
    },

    listButton: {
        backgroundColor: '#cccccc',
        borderColor: '#ff5722',
        borderWidth: 1,
        height: 50,
        width: 50,
        borderRadius: 50 / 2,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 20,
        right: 80,
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 0
        }
    }
});
