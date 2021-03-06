import React, { Component } from 'react'
import QRCode from 'react-native-qrcode';

import {
  StyleSheet,
  FlatList,
  TextInput,
  View,
  Text,
  ActivityIndicator, TouchableHighlight, ActionSheetIOS
} from 'react-native';


import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import * as ReduxActions from '../actions'; //Import your actions

import {Actions} from 'react-native-router-flux'

class Share extends Component {
  constructor(props) {
      super(props);
    this.state = {};
    this.packageCard = this.packageCard.bind(this);
  }

  packageCard() {
    var jsonCard = JSON.stringify(this.props.card);
    var jsonCard2 = JSON.parse(jsonCard);
    console.log(jsonCard2)
    var jsonKey = jsonCard2.keys.n;
    console.log(jsonKey)
    jsonCard2.keys = {};
    jsonCard2.keys = {"n": jsonKey};
    jsonCard2.owner = false;
    console.log('object to display in QR',jsonCard2)
    var res = JSON.stringify(jsonCard2);
    return res;
  }

  render() {
    var packageCard = this.packageCard();
    console.log(packageCard)
    return (
      <View style={styles.container}>
        <QRCode
          value={packageCard}
          size={350}
          bgColor='black'
          fgColor='white'/>
      </View>
    );
  };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },

    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        margin: 10,
        borderRadius: 5,
        padding: 5,
    }
});

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
export default connect(mapStateToProps, mapDispatchToProps)(Share);
