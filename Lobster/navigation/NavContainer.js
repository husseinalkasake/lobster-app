import React from 'react';
import {Keyboard} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {connect} from 'react-redux';
import Start from './Start';
import MainNav from './MainNav';
import {updateKeyboard} from '../redux/actions';

class NavContainer extends React.Component {
  componentDidMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => this.props.updateKeyboard(true));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => this.props.updateKeyboard(false));
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  render() {
    return (
      <NavigationContainer>
        {this.props.isSignedIn ? <MainNav /> : <Start />}
      </NavigationContainer>
    );
  }
}

const mapStateToProps = (state) => ({
  isSignedIn: state.isSignedIn,
});

const mapDispatchToProps = (dispatch) => ({
	updateKeyboard: (keyboardShowing) => dispatch(updateKeyboard(keyboardShowing)),
});
  
export default connect(mapStateToProps, mapDispatchToProps)(NavContainer);
