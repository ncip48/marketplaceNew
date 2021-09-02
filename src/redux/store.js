import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import {composeWithDevTools} from 'redux-devtools-extension';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import {global, auth, home, region, profile} from './reducers';

const reducer = combineReducers({
  global,
  auth,
  home,
  region,
  profile,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['global'],
};

const persistedReducer = persistReducer(persistConfig, reducer);

export default () => {
  // let store = createStore(persistedReducer, applyMiddleware(logger, thunk));
  let store = createStore(
    persistedReducer,
    // composeWithDevTools(applyMiddleware(logger, thunk)),
    composeWithDevTools(applyMiddleware(thunk)),
  );
  let persistor = persistStore(store);
  return {store, persistor};
};
