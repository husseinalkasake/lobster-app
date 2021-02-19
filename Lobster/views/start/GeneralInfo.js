import { Form, Item, Input, Label, Button } from 'native-base';
import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {
  START_SIGN_UP_ROUTE,
} from '../../navigation/routes';
import {connect} from 'react-redux';
import { updateHeight } from '../../redux/actions';
import lobsterController from '../../controller/LobsterController';

class GeneralInfo extends React.Component {
    register() {
        const {firstName, lastName, email, height} = this.props;
        lobsterController.createUser(`${firstName} ${lastName}`, email, height)
        .then(response => {
            if (response.data.status) {
             console.log(response);
           } 
        })
        .catch(error => {
            console.log(error);
        });
    }
    render() {
        const {height, updateHeight} = this.props;
        return (
          <View style={styles.view}>
            <View style={styles.innerContainer}>
              <Text style={styles.title}>General Information</Text>
              <View style={styles.form}>
                  <Form>
                      <Item style={styles.item} stackedLabel>
                          <Label style={styles.itemLabel}>Height (cm)</Label>
                          <Input keyboardType="number-pad" style={styles.input} value={height} onChangeText={text => updateHeight(Number(text.replace(/\D/g, "")))}/>
                      </Item>
                  </Form>
              </View>
              <Button style={{width: '100%', justifyContent: 'center', marginTop: '20%'}} disabled={!height} onPress={() => this.register()}>
                <Label style={{textTransform: 'uppercase', color: 'white'}}>Confirm</Label>
              </Button>
              <Text style={{color: 'red', fontWeight: 'bold', fontSize: 12, alignSelf: 'center', marginTop: '5%'}}>{"No matching account found. Please try again."}</Text>
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
  
export default connect(mapStateToProps, mapDispatchToProps)(GeneralInfo);
