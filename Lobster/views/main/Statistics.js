import React from 'react';
import {Text, View, StyleSheet, ScrollView, Dimensions} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {connect} from 'react-redux';
import lobsterController from '../../controller/LobsterController';
import {WebView} from 'react-native-webview';

class Statistics extends React.Component {
    state = {
      results: {},
      error: "",
      isLoading: false,
      allSessions: [],
      sessionId: null,
    }

    componentDidMount() {
      const {userId} = this.props;

      this.setState({isLoading: true});
      
      lobsterController.getUserSessions(userId)
      .then(result => {
        const allSessions = result.data.results;
        const sessionId = allSessions[0].id;
        this.setState({allSessions, sessionId, error: ""});
        return lobsterController.getSessionSummary(userId, sessionId);
      })
      .then(result => this.setState({results: result.data.results, error: ""}))
      .catch(() => this.setState({error: "Unable to fetch session summary"}))
      .finally(() => this.setState({isLoading: false}));
    }

    updateSession(sessionId) {
      const {userId} = this.props;
      if(sessionId === this.state.sessionId) return;
      
      this.setState({sessionId, isLoading: true});
      lobsterController.getSessionSummary(userId, sessionId)
      .then(result => this.setState({results: result.data.results, error: ""}))
      .catch(() => this.setState({error: "Unable to fetch session summary"}))
      .finally(() => this.setState({isLoading: false}));
    }

    render() {
        const windowWidth = Dimensions.get('window').width;
        const windowHeight = Dimensions.get('window').height;

        const { results, error, isLoading } = this.state;
        const { average, sitting, standing } = results;

        const getDataPoints = results => {
          const graphData = [];

          if (!results) return graphData;
          
          const objectArray = Object.entries(results);

          objectArray.forEach(([key, value]) => {
            graphData.push({
              x: new Date(key * 1000).getTime(), // convert unix timestamp to date object
              y: Math.round(value.score),
            });
          });

          return graphData;
        };

        const options = {
          theme: "light2",
          backgroundColor: null,
          axisY: {
            suffix: "%",
          },
          axisX: {
            labelFontSize: 0,
          },
          legend: {
            verticalAlign: "top",
            horizontalAlign: "center",
            dockInsidePlotArea: true,
            fontSize: 16,
          },
          data: [
            {
              type: "line",
              axisYType: "primary",
              name: "Sitting",
              showInLegend: true,
              dataPoints: getDataPoints(sitting),
            },
            {
              type: "line",
              axisYType: "primary",
              name: "Standing",
              showInLegend: true,
              dataPoints: getDataPoints(standing),
            },
          ],
        };
			
        const score = average && average.score;
        const recommendations = (average && average.recommendations) ? average.recommendations : [];

        return (
            <View style={styles.view}>
              <Text style={{fontSize: 24, fontWeight: 'bold', position: 'absolute', left: 24, color: '#2B088E', top: '5%'}}>Statistics</Text>
              <Text style={{fontWeight: 'bold', position: 'absolute', top: '10%', left: 24, fontSize: 16}}>Performance over Session</Text>
              <Picker
                mode="dropdown"
                selectedValue={this.state.sessionId}
                onValueChange={(sessionId) => this.updateSession(sessionId)}
                style={{ width: 190, position: 'absolute', right: 0, top: '8.3%' }}
                itemStyle={{maxWidth: 160}}
              >
                {this.state.allSessions && this.state.allSessions.map(session => {
                  const date = new Date(session.created_on);
                  return(<Picker.Item label={Intl.DateTimeFormat('en-US', { dateStyle: 'short', timeStyle: 'short' }).format(date)} value={session.id} />);
                })}
              </Picker>
              {(isLoading || error !== "" || !results || Object.keys(results).length === 0) ? (
                <View style={styles.view}>
                  <Text style={{fontWeight: 'bold', color: isLoading ? 'black' : '#A30020'}}>{isLoading ? 'Fetching Summary...' : error}</Text>
                </View>
              ) : [
                <View style={{position: 'absolute', left: 0, top: '12%', marginHorizontal: 12, marginTop: 12, width: '94%', height: '40%'}}>
                  <WebView
                    originWhitelist={['*']}
                    style={{backgroundColor: 'transparent'}}
                    injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=0.5, maximum-scale=0.5, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `}
                    source={{ html: `<div id='chartContainer' style='height: 100%; width: 100%;'>Chart Renders Here</div><script src='https://canvasjs.com/assets/script/canvasjs.min.js'></script><script>window.onload=function(){var chart = new CanvasJS.Chart('chartContainer', ${JSON.stringify(options)}); chart.render();}</script>` }}
                  />
                  <View style={{position: 'absolute', left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0)'}}/>
                </View>,
                <View style={{position: 'absolute', top: '52%', left: 0, marginHorizontal: 24}}>
                  <Text style={{fontWeight: 'bold', marginVertical: 24, fontSize: 16}}>Overall Performance: {Math.round(score)}%</Text>
                  <Text style={{fontWeight: 'bold', fontSize: 16}}>Recommendations</Text>
                  <View style={{width: windowWidth - 36, left: 0, marginTop: 12, height: windowHeight - 600}}>
                    <ScrollView>
                      {recommendations.map((recommendation) => (
                        <View style={{marginVertical: 6}}>
                          <Text style={{fontWeight: 'bold'}}>{recommendation.property.substring(0,1).toUpperCase() + recommendation.property.substring(1)}</Text>
                          <Text>{recommendation.user_message}</Text>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              ]}
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
    userId: state.userId,
    sessionId: state.sessionId,
});

export default connect(mapStateToProps, null)(Statistics);
