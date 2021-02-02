import React from 'react';
import {Text, View, Button, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {MAIN_WORK_SESSION_ROUTE} from '../../navigation/routes';

class Home extends React.Component {
    render() {
        return (
          <View style={styles.view}>
            <Text>Home</Text>
            <Button title='Start New Work Session' onPress={() => this.props.navigation.navigate(MAIN_WORK_SESSION_ROUTE)}></Button>
          </View>
        );
    }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    width: '80%',
    position: 'absolute',
    top: '25%',
  },
  form: {
    width: '100%',
    marginTop: 25
  },
  item: {
    marginLeft: 0
  },
  itemLabel: {
    fontSize: 12
  },
  input: {
    paddingLeft: 0
  },
  title: {
    textAlign: 'left',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2B088E',
  },
});

const mapStateToProps = (state) => ({
    firstName: state.firstName,
    lastName: state.lastName,
    email: state.email,
    height: state.height,
});

const mapDispatchToProps = (dispatch) => ({
	updateHeight: (height) => dispatch(updateHeight(height)),
});
  
  export default connect(mapStateToProps, mapDispatchToProps)(Home);
