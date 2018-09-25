import  { createStore, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import  composeWithDevTools  from 'redux-devtools-extension';

import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/hardSet';
import mainReducer from '../reducers/Reducers';// the value from combineReducers

const rootPersistConfig = {
    key: 'root',
    storage: storage,
    whitelist: ['nonce']
  }


const pReducer = persistReducer(rootPersistConfig, mainReducer);


export const store = createStore(pReducer);
export const persistor = persistStore(store);
