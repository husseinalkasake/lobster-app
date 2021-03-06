import {createStore} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import rootReducer from './reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  timeout: 0,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
  const store = createStore(persistedReducer);
  const persistor = persistStore(store);
  return {store, persistor};
};
