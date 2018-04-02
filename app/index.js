import React, {Component} from 'react';
import { View, AsyncStorage } from 'react-native';

import { Router, Scene } from 'react-native-router-flux';

import Home from './components/home'
import NewCard from './components/new_card'
import CardList from './components/card_list'
import Share from './components/share'
import ViewCard from './components/view_card'
import Scan from './components/scan'
import NewMessage from './components/new_message'
import MessageList from './components/message_list'

import CardData from './cards.json'
import MessageData from './messages.json'

import {connect} from 'react-redux';
import { getCards, getMessages } from './actions'

class Main extends Component {
    componentDidMount() {
        console.log('here in componentDidMount!')
        var _this = this;
        //Check if any card data exists
        AsyncStorage.getItem('carddata', (err, carddata) => {
            //if it doesn't exist, extract from json file
            //save the initial data in Async
            if (carddata === null){
                AsyncStorage.setItem('carddata', JSON.stringify(CardData.cards));
                _this.props.getCards();
                console.log(JSON.stringify(CardData.cards));
                console.log('getting cards!')
            }
        });
        // check if any message data exists
        AsyncStorage.getItem('messagedata', (err, messagedata) => {
            //if it doesn't exist, extract from json file
            //save the initial data in Async
            if (messagedata === null){
                AsyncStorage.setItem('messagedata', JSON.stringify(MessageData.messages));
                _this.props.getMessages();
                console.log(JSON.stringify(MessageData.messages));
                console.log('getting messsages!')
            }
        });
        console.log('out of componentDidMount!')
    }

    render() {
        return (
            <Router>
                <Scene key="root">
                    <Scene key="home" component={Home} title="ID.ly" initial/>
                    <Scene key="new_card" component={NewCard} title="New Card"/>
                    <Scene key="card_list" component={CardList} title="Card List"/>
                    <Scene key="share" component={Share} title="Share"/>
                    <Scene key="view_card" component={ViewCard} title="View Card"/>
                    <Scene key="scan" component={Scan} title="Scan"/>
                    <Scene key="new_message" component={NewMessage} title="New Message"/>
                    <Scene key="message_list" component={MessageList} title="Message List"/>
                </Scene>
            </Router>
        );
    }
}

//Connect everything
export default connect(null, { getCards, getMessages })(Main);
