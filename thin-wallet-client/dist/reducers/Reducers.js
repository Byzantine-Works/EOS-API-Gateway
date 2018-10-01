var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import * as types from '../actions/actionsType';
import State from '../model/State';
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';

const updateNonce = (state = new State(), action) => {

    const { type } = action;
    let updatedState = null;
    switch (type) {

        case types.UPDATE_NONCE:
            {
                let user = action.payload.data;

                // let newNonce = state.nonce + 1;
                // updatedState = { ...state };
                // updatedState.nonce = newNonce; 
                // return updatedState;

                if (!state.nonce[user]) {
                    updatedState = _extends({}, state);
                    updatedState.nonce[user] = 1;
                    return updatedState;
                } else {
                    let newNonce = state.nonce[user] + 1;
                    updatedState = _extends({}, state);
                    updatedState.nonce[user] = newNonce;
                    return updatedState;
                }
            }
        default:
            {
                return state;
            }
    }
};
const updateState = (state = new State(), action) => {
    const { type } = action;
    let updatedState = null;
    switch (type) {
        case types.UPDATE_STATE:
            {
                updatedState = _extends({}, state);
                updatedState[action.payload.data[0]] = action.payload.data[1];

                if (action.payload.data[0] === 'amount') {
                    updatedState.amRend = action.payload.data[1];
                    updatedState.amount = Number(action.payload.data[1]);
                } else if (action.payload.data[0] === 'fiatAm') {
                    updatedState.fiatAmRend = action.payload.data[1];
                    updatedState.fiatAm = Number(action.payload.data[1]);
                } else if (action.payload.data[0] === 'fiatAmRend') {
                    console.log("in update fiatamrend");
                    updatedState[action.payload.data[0]] = Number(action.payload.data[1]).toFixed(4);
                } else if (action.payload.data[0] === 'amRend') {
                    updatedState[action.payload.data[0]] = Number(action.payload.data[1]).toFixed(state.balance[state.token].precision);
                } else {
                    updatedState[action.payload.data[0]] = action.payload.data[1];
                }

                return updatedState;
            }
        case types.UPDATE_SCATTER:
            {
                let scatterStatus = !state.scatter;
                updatedState = _extends({}, state, { scatter: scatterStatus });
                return updatedState;
            }
        default:
            {
                return state;
            }

    }
};

const mainReducer = (state = new State(), action) => {
    let newState = updateNonce(state, action);
    newState = updateState(newState, action);
    return newState;
};

export default mainReducer;