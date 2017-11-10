import React, { Component } from 'react';
import GameViewWrapper from './view/gameViewWrapper';
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <br />
        <GameViewWrapper />
      </div>
    );
  }
}

export default App;
