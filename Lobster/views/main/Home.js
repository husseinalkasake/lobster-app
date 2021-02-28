import React from 'react';
import {Text, View, Button, StyleSheet, Image, Dimensions, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {MAIN_WORK_SESSION_ROUTE} from '../../navigation/routes';
import HomeImage from "../../images/home.svg";

class Home extends React.Component {
    render() {
        const { fullName } = this.props;
        const windowWidth = Dimensions.get('window').width;
        const windowHeight = Dimensions.get('window').height;
        const hourOfDay = new Date().getHours();
        let time = "";
        if (hourOfDay >= 18 || hourOfDay < 4)
          time = "Evening";
        else if (hourOfDay >= 12)
          time = "Afternoon";
        else
          time = "Morning";
        
        return (
          <View style={styles.view}>
            <View style={styles.innerContainer}>
              <Text style={styles.title}>Good {time} {fullName.substr(0, fullName.indexOf(" "))}</Text>
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <HomeImage width={windowWidth/2} height={windowHeight/2}/>
              </View>
              <TouchableOpacity
              style={styles.button}
              onPress={() => this.props.navigation.navigate(MAIN_WORK_SESSION_ROUTE)}>
                <Text style={styles.buttonText}>Start New Work Session</Text>
              </TouchableOpacity>
            </View>
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
    top: '20%',
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
  button: {
    width: '100%',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    textTransform: 'uppercase',
    fontSize: 14,
    alignSelf: 'center',
    textAlignVertical: 'center',
    paddingVertical: 10,
    height: 85,
  },
});

const mapStateToProps = (state) => ({
    fullName: state.fullName,
});
  
  export default connect(mapStateToProps, null)(Home);
