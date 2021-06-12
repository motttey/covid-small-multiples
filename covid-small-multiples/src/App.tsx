import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LineChart from './LineChart';

import './App.css';

function SmallMultiples(props: any) {

  const prefList = props.listItems.map((pref: any, index: number) =>
    <div className="column is-4" key={pref[0].name_jp}>
      <h2>{pref[0].name_jp}</h2>
      <LineChart data={pref} />
    </div>
  );
  return (
    <div className="container">
      <div className="columns is-multiline">
        {prefList}
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
    const dataSlice = result.data
    const listTimeSeriesObj = result.data[0].area
      .map((d: any) => d.name)
      .map((p: string, idx: number) => {
        return dataSlice.map((d: any, i: number, arr: Array<any>) => {
          const prefCurArray = d.area[idx];
          const prefPrevArray = (i > 0)? arr[i - 1].area[idx]: prefCurArray;

          return {
            name_jp: prefCurArray["name_jp"],
            ncurrentpatients: prefCurArray["ncurrentpatients"] - prefPrevArray["ncurrentpatients"]
          };
        }).slice(-50);
      });

    console.log(listTimeSeriesObj[0]);

    setListItems(listTimeSeriesObj);
  }

  useEffect(() => {
    fetch();
  }, []);

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
