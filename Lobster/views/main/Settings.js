import { Form, Item, Input, Label, Button } from 'native-base';
import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import { logOut, updateHeight } from '../../redux/actions';

class Settings extends React.Component {
    render() {
      const {height, updateHeight, logOut} = this.props;
      return (
          <View style={styles.view}>
            <Button onPress={() => logOut()}><Label>Sign out</Label></Button>
            <View style={styles.innerContainer}>
                <Text style={styles.title}>Settings</Text>
                <View style={styles.form}>
                    <Form>
                        <Item style={styles.item} stackedLabel>
                            <Label style={styles.itemLabel}>Height (cm)</Label>
                            <Input keyboardType="number-pad" style={styles.input} value={height.toString()} onChangeText={text => updateHeight(Number(text.replace(/\D/g, "").toString()))}/>
                        </Item>
                    </Form>
                </View>
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
  height: state.height,
});

const mapDispatchToProps = (dispatch) => ({
  logOut: () => dispatch(logOut()),
  updateHeight: (height) => dispatch(updateHeight(height)),
});
    
export default connect(mapStateToProps, mapDispatchToProps)(Settings);
