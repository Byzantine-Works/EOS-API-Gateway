import * as types from '../actions/actionsType';
import State from '../model/State';
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';

const updateNonce = (state = new State(), action) => {
    
    const { type } = action;
    let updatedState = null;
    switch (type) {
        
        case types.UPDATE_NONCE: {
            let user = action.payload.data;

                // let newNonce = state.nonce + 1;
                // updatedState = { ...state };
                // updatedState.nonce = newNonce; 
                // return updatedState;

            if(!state.nonce[user]) {
                updatedState = { ...state };
                updatedState.nonce[user] = 1;
                return updatedState; 
            } else {
                let newNonce = state.nonce[user] + 1;
                updatedState = { ...state };
                updatedState.nonce[user] = newNonce; 
                return updatedState; 
            }
        }
        default : {
            return state;
        }
    }
  
}
const updateState = (state = new State(), action) => {
    const { type } = action;
    let updatedState = null;
    switch (type) {
        case types.UPDATE_STATE: {
            updatedState = { ...state };
            updatedState[action.payload.data[0]] = action.payload.data[1];
            return updatedState;
        }
        case types.UPDATE_SCATTER: {
            let scatterStatus = !state.scatter;
            updatedState = { ...state, scatter: scatterStatus };
            return updatedState;
        }
        default : {
            return state;
        }
    
    }

}

// const noncePersistConfig = {
//     key: 'nonce',
//     storage: storage,
//   }
  
// const rootReducer = combineReducers({
//     nonce: persistReducer(noncePersistConfig, updateNonce),
//     other: updateState
//   })
  


const mainReducer = (state = new State(), action) => {
    let newState = updateNonce(state, action);
    newState = updateState(newState, action); 
    return newState;
}

export default mainReducer;

