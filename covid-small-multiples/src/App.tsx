import React from 'react';
import logo from './logo.svg';
import './App.css';

function SmallMultiples() {
  const listItems = ["Tokyo", "Osaka", "Aichi", "Kanagawa", "Hokkaido"].map((pref) =>
    <div className="column is-2">
      <h2>{pref}</h2>
    </div>
  );
  return (
    <div className="container">
      <div className="columns">{listItems}</div>
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
      </header>
      <section className="section">
        <SmallMultiples />
      </section>
    </div>
  );
}

export default App;
