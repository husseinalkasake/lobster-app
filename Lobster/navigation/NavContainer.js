import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {connect} from 'react-redux';
import Start from './Start';
import MainNav from './MainNav';

function NavContainer({isSignedIn}) {
  return (
    <NavigationContainer>
      {isSignedIn ? <MainNav /> : <Start />}
    </NavigationContainer>
  );
}

const mapStateToProps = (state) => ({
  isSignedIn: state.isSignedIn,
});

export default connect(mapStateToProps)(NavContainer);
