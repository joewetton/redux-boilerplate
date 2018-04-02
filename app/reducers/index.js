import { combineReducers } from 'redux';

import { CARDS_AVAILABLE, ADD_CARD, UPDATE_CARD, DELETE_CARD, CLEAR_ALL } from "../actions/" //Import the actions types constant we defined in our actions

let dataState = { cards: [], loading:true };

import Data from '../cards.json'

const dataReducer = (state = dataState, action) => {
    switch (action.type) {
        case ADD_CARD:{
            let cards =  cloneObject(state.cards) //clone the current state
            cards.unshift(action.card); //add the new card to the top
            state = Object.assign({}, state, { cards: cards});
            return state;
        }

        case CARDS_AVAILABLE:
            state = Object.assign({}, state, { cards: action.cards, loading:false });
            return state;

        case UPDATE_CARD:{
            let card = action.card;
            let cards =  cloneObject(state.cards) //clone the current state
            let index = getIndex(cards, card.id); //find the index of the card with the card id passed
            if (index !== -1) {
                cards[index]['author'] = card.author;
                cards[index]['text'] = card.text;
                cards[index]['email'] = card.email;
            }
            state = Object.assign({}, state, { cards: cards});
            return state;
        }

        case DELETE_CARD:{
            let cards =  cloneObject(state.cards) //clone the current state
            let index = getIndex(cards, action.id); //find the index of the card with the id passed
            if(index !== -1) cards.splice(index, 1);//if yes, undo, remove the CARD
            state = Object.assign({}, state, { cards: cards});
            return state;
        }

        case CLEAR_ALL:{
            state = Object.assign({}, state, dataState);
            return state;
        }

        default:
            return state;
    }
};


function cloneObject(object){
    return JSON.parse(JSON.stringify(object));
}

function getIndex(data, id){
    let clone = JSON.parse(JSON.stringify(data));
    return clone.findIndex((obj) => parseInt(obj.id) === parseInt(id));
}

// Combine all the reducers
const rootReducer = combineReducers({
    dataReducer
})

export default rootReducer;
