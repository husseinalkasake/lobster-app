import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import lobsterController from '../../controller/LobsterController';
import {WebView} from 'react-native-webview';
import * as data from './temp.json';

class Statistics extends React.Component {
    state = {
      results: {},
    }

    componentDidMount() {
      const temp = this.props;
      debugger;
      lobsterController.getSessionSummary(7, 29)
      .then(result => {
        debugger;
        this.setState({results: result.data.results});
      })
      .catch(error => {
        debugger;
      });
    }

    render() {
        const { average, sitting, standing } = this.state.results;

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
            title: "Score",
            suffix: "%",
          },
          axisX: {
            labelFontSize: 0,
          },
          legend: {
            verticalAlign: "top",
            horizontalAlign: "center",
            dockInsidePlotArea: true,
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

        return (
          <View style={styles.view}>
            <Text style={{fontSize: 24, fontWeight: 'bold', position: 'absolute', left: 24, color: '#2B088E', top: '5%'}}>Statistics</Text>
            <View style={{position: 'absolute', left: 0, top: '10%', marginHorizontal: 12, marginTop: 12, width: '94%', height: '40%'}}>
              <WebView
                originWhitelist={['*']}
                style={{backgroundColor: 'transparent'}}
                injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=0.5, maximum-scale=0.5, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `}
                source={{ html: `<div id='chartContainer' style='height: 100%; width: 100%;'>Chart Renders Here</div><script src='https://canvasjs.com/assets/script/canvasjs.min.js'></script><script>window.onload=function(){var chart = new CanvasJS.Chart('chartContainer', ${JSON.stringify(options)}); chart.render();}</script>` }}
              />
              <View style={{position: 'absolute', left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0)'}}/>
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
    userId: state.userId,
    sessionId: state.sessionId,
    temp: state,
});

export default connect(mapStateToProps, null)(Statistics);
