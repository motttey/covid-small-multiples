import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function SmallMultiples(props: any) {
  const listItems = props.listItems.map((pref: any) =>
    <div className="column is-4" key={pref.name}>
      <h2>{pref.name}</h2>
    </div>
  );
  return (
    <div className="container">
      <div className="columns is-multiline">
        {listItems}
      </div>
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
      <header className="header">
        COVID-19 Small Multiples
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
