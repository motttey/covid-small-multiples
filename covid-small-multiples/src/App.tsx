import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

interface StringKeyObject {
    // 今回はstring
    [key: string]: any;
}

function SmallMultiples(props: any) {
  const listItems = props.prefNameList.map((pref: any) =>
    <div className="column is-4" key={pref}>
      <h2>{pref}</h2>
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
  const [prefNameList, setPrefNameList] = useState([]);
  const [listItems, setListItems] = useState([]);

  const fetch = async () => {
    const result = await axios(
      "https://raw.githubusercontent.com/code4sabae/covid19/master/data/covid19japan-all.json"
    );
    const prefNameListObj = result.data[0].area.map((d: any) => d.name);

    const listItemsObj = result.data.slice(-50).map((d: any) => {
      let resultEachTime: StringKeyObject = {};
      prefNameListObj.forEach((p: string, i: number) => {
        resultEachTime[p] = d.area[i]["ncurrentpatients"]
      });
      return resultEachTime;
    });

    setPrefNameList(prefNameListObj);
    setListItems(listItemsObj);
  }
  fetch();

  return (
    <div className="App">
      <header className="header">
        COVID-19 Small Multiples
      </header>
      <section className="section">
        <SmallMultiples
          prefNameList={prefNameList}
        />
      </section>
    </div>
  );
}

export default App;
