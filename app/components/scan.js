import React, { Component } from 'react';
import {
  Alert,
  Linking,
  Dimensions,
  LayoutAnimation,
  Text,
  View,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';


import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import * as ReduxActions from '../actions'; //Import your actions

import {Actions} from 'react-native-router-flux'

class Scan extends Component {
  constructor(props) {
      super(props);
    this.state = {};
  }

  state = {
    hasCameraPermission: null,
    lastScannedUrl: null,
  };

  componentDidMount() {
    this._requestCameraPermission();
  }

  _requestCameraPermission = async () => {
  const { status } = await Permissions.askAsync(Permissions.CAMERA);
  this.setState({
    hasCameraPermission: status === 'granted',
  });
};

_handleBarCodeRead = result => {
  if (result.data !== this.state.lastScannedUrl) {
    LayoutAnimation.spring();
    this.setState({ lastScannedUrl: result.data });
    console.log("publickey: ",result.data)
  }
};

render() {
  return (
    <View style={styles.container}>

      {this.state.hasCameraPermission === null
        ? <Text>Requesting for camera permission</Text>
        : this.state.hasCameraPermission === false
            ? <Text style={{ color: '#fff' }}>
                Camera permission is not granted
              </Text>
            : <BarCodeScanner
                onBarCodeRead={this._handleBarCodeRead}
                style={{
                  height: Dimensions.get('window').height,
                  width: Dimensions.get('window').width,
                }}
              />}

      {this._maybeRenderUrl()}

      <StatusBar hidden />
    </View>
  );
}


_handlePressUrl = () => {
  Alert.alert(
    'Open this URL?',
    this.state.lastScannedUrl,
    [
      {
        text: 'Yes',
        onPress: () => Linking.openURL(this.state.lastScannedUrl),
      },
      { text: 'No', onPress: () => {} },
    ],
    { cancellable: false }
  );
};

_handlePressCancel = () => {
  this.setState({ lastScannedUrl: null });
};

_maybeRenderUrl = () => {
  if (!this.state.lastScannedUrl) {
    return;
  }

  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity style={styles.url} onPress={this._handlePressUrl}>
        <Text numberOfLines={1} style={styles.urlText}>
          {this.state.lastScannedUrl}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={this._handlePressCancel}>
        <Text style={styles.cancelButtonText}>
          Cancel
        </Text>
      </TouchableOpacity>
    </View>
  );
};
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    flexDirection: 'row',
  },
  url: {
    flex: 1,
  },
  urlText: {
    color: '#fff',
    fontSize: 20,
  },
  cancelButton: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 18,
  },
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
export default connect(mapStateToProps, mapDispatchToProps)(Scan);
