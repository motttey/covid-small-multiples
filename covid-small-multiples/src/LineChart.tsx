import * as d3 from 'd3';
import React, { useRef, useEffect } from 'react';

interface Data {
  "IS03155-2": String;
  name_jp: String;
  ncurrentpatients: number;
  ndeaths: number;
  nexits: number;
  nheavycurrentpatients: number;
  ninspections: number;
  npatients: number;
  unknowns: number;
}

function LineChart(props: any) {
  const ref = useRef(null);

  const yValue = (d: Data): number => d.npatients;
  const xValue = (i: number): number => i;

  useEffect(
    () => {
      const tData = (props.data || []) as Array<Data>;

      const height = 150;
      const width = 250;
      const margin = { top: 10, right: 10, bottom: 30, left: 10 };

      const x = d3
        .scaleLinear()
        .domain([0, d3.max(tData.map((d: Data, i: number) => i)) || 1])
        .rangeRound([margin.left, width - margin.right]);

      console.log(x);

      let maxY = d3.max(tData, yValue) || 0;
      const y1 = d3
        .scaleLinear()
        .domain([0, maxY])
        .rangeRound([height - margin.bottom, margin.top]);

      const line = d3.line<Data>()
        .x((d: Data, i: number) => { return x(xValue(i)) || 0; })
        .y((d: Data) => { return y1(yValue(d)) || 0; });

      d3.select(ref.current)
        .attr("viewBox", "0 0 " + width  + " " + height)
        .attr("width", "100%")
        .attr("height", "100%");

      d3.select(ref.current)
        .select(".plot-area")
        .append("path")
        .datum(tData)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1)
        .attr("d", line);
    }, [props.data]
  );

  return (
    <svg
      ref={ref}
      style={{
        height: 250,
        width: "100%",
        marginTop: "50px",
        marginRight: "0px",
        marginLeft: "0px",
      }}
    >
      <g className="plot-area" />
    </svg>
  );
}

export default LineChart;
