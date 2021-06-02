import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import axios from 'axios';
import './App.css';

function SmallMultiples(props: any) {
  const listItems = props.listItems.map((pref: any) =>
    <div className="column is-2">
      <h2>{pref.name}</h2>
    </div>
  );
  return (
    <div className="container">
      <div className="columns">{listItems}</div>
    </div>
  )
}

function App() {
  const [listItems, setListItems] = useState([]);

  const fetch = async () => {
    const result = await axios(
      "https://raw.githubusercontent.com/code4sabae/covid19/master/data/covid19japan-all.json"
    );
    setListItems(result.data[0].area);
  }
  fetch();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
      </header>
      <section className="section">
        <SmallMultiples
          listItems={listItems}
        />
      </section>
    </div>
  );
}

export default App;
