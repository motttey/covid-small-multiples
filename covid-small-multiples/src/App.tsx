import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LineChart from './LineChart';
import * as d3 from 'd3';
import { CovidData } from './@types/data';

import './App.css';

function SmallMultiples(props: any) {
  const prefList = props.listItems.map((pref: any) =>
    <div className="column is-4" key={pref[0].name_jp}>
      <h3 className="title is-3">{pref[0].name_jp}</h3>
      <LineChart
        data={pref}
        keyAttribute={props.keyAttribute}
        avgKeyAttribute={props.keyAttribute + "Avg"}
      />
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

function SortButtons(props: any) {
  const sliceMin = (data: Array<CovidData>, days: number): number =>
    d3.min(data.slice(days).map((d: any) => d[props.keyAttribute]));

  const sliceMax = (data: Array<CovidData>, days: number): number =>
    d3.max(data.slice(days).map((d: any) => d[props.keyAttribute]));

  const sortByMax = (a: Array<CovidData>, b: Array<CovidData>) => {
    return d3.max(b.map((d: any) => d[props.keyAttribute])) - d3.max(a.map((d: any) => d[props.keyAttribute]))
  }

  const sortByRatio = (a: Array<CovidData>, b: Array<CovidData>) => {
    const ratioFunc = (data: Array<CovidData>) =>
      (sliceMax(data, -14) !== 0) ? sliceMax(data, 14)/sliceMax(data, -14) : 0;
    return ratioFunc(b) - ratioFunc(a);
  }

  const sortByMinMaxRatio = (a: Array<CovidData>, b: Array<CovidData>) => {
    const ratioFunc = (data: Array<CovidData>) => {
      const minVal = (sliceMin(data, 0) > 0)? sliceMin(data, 0): 1;
      return sliceMax(data, 0) / minVal;
    }
    return ratioFunc(b) - ratioFunc(a);
  }

  return (
    <div className="container">
      <div className="columns is-multiline">
        <div className="column">
          <div className="button" onClick={() => props.execFunc(sortByMax)}>
            SortByMaxPatients
          </div>
        </div>
        <div className="column">
          <div className="button" onClick={() => props.execFunc(sortByRatio)}>
            SortByRatioPatients
          </div>
        </div>
        <div className="column">
          <div className="button" onClick={() => props.execFunc(sortByMinMaxRatio)}>
            SortByMinMaxRatio
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [listItems, setListItems] = useState([]);
  const [keyAttribute, setKeyAttribute] = useState("npatients");

  const executeSort = (func: (a: Array<CovidData>, b: Array<CovidData>) => number) => {
    setListItems((list) => [...list.sort(func)]);
  }

  const mapKeyValue = (arr: Array<CovidData>, key: string) => {
    return arr.map((d: CovidData) => {
      return d[key];
    });
  }

  const sortValue = (arr: Array<number>) => {
    return arr.map((d: number, i: number, arr: Array<number>) => {
      return d - arr[(i || 1) - 1];
    });
  }

  const generation_days = 7;
  const report_interval = 5;
  const fetch = async () => {
    const result = await axios(
      "https://raw.githubusercontent.com/code4sabae/covid19/master/data/covid19japan-all.json"
    );
    const dataSlice = result.data;
    const listTimeSeriesObj = result.data[0].area
      .map((d: any) => d.name)
      .map((p: string, idx: number) => {
        return dataSlice.map((d: any, i: number, arr: Array<any>) => {
          const prefCurArray = d.area[idx];
          const prefPrevArray = (i > 0)? arr[i - 1].area[idx]: prefCurArray;

          const avgSliceArray = arr.slice(i - generation_days, i).map((d) => d.area[idx])

          const sumPatientGenerationDays = d.area[idx]["npatients"] - arr[i - (generation_days - 1)]?.area[idx]["npatients"];
          const sumPatientPastGenerationDays = arr[i - (generation_days)]?.area[idx]["npatients"] - arr[i - (generation_days * 2 - 1)]?.area[idx]["npatients"];

          return {
            name_jp: prefCurArray["name_jp"],
            ndeaths:  prefCurArray["ndeaths"] - prefPrevArray["ndeaths"],
            npatients: prefCurArray["npatients"] - prefPrevArray["npatients"],
            ninspections: prefCurArray["ninspections"] - prefPrevArray["ninspections"],
            ndeathsAvg: d3.mean(
              sortValue(mapKeyValue(avgSliceArray, "ndeaths"))
            ),
            npatientsAvg: d3.mean(
              sortValue(mapKeyValue(avgSliceArray, "npatients"))
            ),
            ninspectionsAvg: d3.mean(
              sortValue(mapKeyValue(avgSliceArray, "ninspections"))
            ),
            effectiveReproductionNum: (sumPatientPastGenerationDays > 0) ? Math.pow(
                (sumPatientGenerationDays / sumPatientPastGenerationDays), (report_interval/generation_days)
            ) : 0
          };
        }).slice(-50);
      });

    setListItems(listTimeSeriesObj);
  }

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div className="App">
      <header className="header">
        <h1 className="title is-1">
          COVID-19 Small Multiples
        </h1>
        <p>
          指標とソート基準を選択してください。<br/>
          <a href="https://github.com/code4sabae/covid19">データ取得元</a>
        </p>
      </header>
      <section className="section">
        <div className="column">
          <div className="select">
            <select onChange={(event) => setKeyAttribute(event.target.value)}>
              {
                ["npatients", "ndeaths", "ninspections", "effectiveReproductionNum"].map((key) => {
                  return <option key={key} value={key}>{key}</option>
                })
              }
            </select>
          </div>
        </div>
        <SortButtons
          keyAttribute={keyAttribute}
          setAttributes={setKeyAttribute}
          execFunc={executeSort}
        />
      </section>
      <section className="section">
        <SmallMultiples
          keyAttribute={keyAttribute}
          listItems={listItems}
        />
      </section>
    </div>
  );
}

export default App;
