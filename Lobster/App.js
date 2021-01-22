/**
 * @format
 * @flow strict-local
 */

import React from 'react';
import {SafeAreaView, StyleSheet, StatusBar} from 'react-native';
import NavContainer from './navigation/NavContainer';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import getStore from './redux/store';
import {Root} from 'native-base';

function App() {
  // persisted state stuff
  const {store, persistor} = getStore();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.safeAreaView}>
          <Root>
            <NavContainer />
          </Root>
        </SafeAreaView>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default App;
