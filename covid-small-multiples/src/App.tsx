import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LineChart from './LineChart';
import * as d3 from 'd3';
import { CovidData } from './@types/data';

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

function SortByMaxPatients(data: Array<any>) {
  data.sort((a: Array<CovidData>, b: Array<CovidData>) => {
    return  d3.max(b.map((d: any) => d.npatients)) - d3.max(a.map((d: any) => d.npatients))
  });
  return data;
}

function App() {
  const [listItems, setListItems] = useState([]);

  const fetch = async () => {
    const result = await axios(
      "https://raw.githubusercontent.com/code4sabae/covid19/master/data/covid19japan-all.json"
    );
    const dataSlice = result.data;
    let listTimeSeriesObj = result.data[0].area
      .map((d: any) => d.name)
      .map((p: string, idx: number) => {
        return dataSlice.map((d: any, i: number, arr: Array<any>) => {
          const prefCurArray = d.area[idx];
          const prefPrevArray = (i > 0)? arr[i - 1].area[idx]: prefCurArray;
          const prefAvgArray = arr.slice(i - 7, i).map((d) => d.area[idx])
            .map((d: CovidData, i: number, arr: Array<CovidData>) => {
              return d.npatients - arr[(i || 1) - 1].npatients;
            });

          return {
            name_jp: prefCurArray["name_jp"],
            npatients: prefCurArray["npatients"] - prefPrevArray["npatients"],
            avgNpatients: d3.mean(prefAvgArray)
          };
        }).slice(-50);
      });

    listTimeSeriesObj = SortByMaxPatients(listTimeSeriesObj);
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
