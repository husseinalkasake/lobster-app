import React from 'react';
import {Text, View, Button, StyleSheet, Image, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import {MAIN_WORK_SESSION_ROUTE} from '../../navigation/routes';
import HomeImage from "../../images/home.svg";

class Home extends React.Component {
    render() {
        const windowWidth = Dimensions.get('window').width;
        const windowHeight = Dimensions.get('window').height;
        return (
          <View style={styles.view}>
            <HomeImage width={windowWidth/2} height={windowHeight/2}/>
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
