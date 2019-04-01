import React, { Component } from 'react';
import Chart from './Chart';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Chart elementWidth={600} elementHeight={270} />
      </div>
    );
  }
}

export default App;
