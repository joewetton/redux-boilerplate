import React, {Component} from 'react';
import { View, AsyncStorage } from 'react-native';

import { Router, Scene } from 'react-native-router-flux';

import Home from './components/home'
import NewQuote from './components/new_quote'
import CardList from './components/card_list'
import Share from './components/share'
import ViewCard from './components/view_card'
import Scan from './components/scan'
import Data from './quotes.json'

import {connect} from 'react-redux';
import { getQuotes } from './actions'

class Main extends Component {
    componentDidMount() {
        console.log('here in componentDidMount!')
        var _this = this;
        //Check if any data exist
        AsyncStorage.getItem('data', (err, data) => {
            //if it doesn't exist, extract from json file
            //save the initial data in Async
            if (data === null){
                AsyncStorage.setItem('data', JSON.stringify(Data.quotes));
                _this.props.getQuotes();
                console.log(JSON.stringify(Data.quotes));
                console.log('gettingQuotes!')
            }
        });
        console.log('out of componentDidMount!')
    }

    render() {
        return (
            <Router>
                <Scene key="root">
                    <Scene key="home" component={Home} title="ID.ly" initial/>
                    <Scene key="new_quote" component={NewQuote} title="New Quote"/>
                    <Scene key="card_list" component={CardList} title="Card List"/>
                    <Scene key="share" component={Share} title="Share"/>
                    <Scene key="view_card" component={ViewCard} title="View Card"/>
                    <Scene key="scan" component={Scan} title="Scan"/>
                </Scene>
            </Router>
        );
    }
}

//Connect everything
export default connect(null, { getQuotes })(Main);
