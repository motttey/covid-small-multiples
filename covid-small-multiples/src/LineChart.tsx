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

  const yValue = (d: Data): number => d.ncurrentpatients;
  const xValue = (d: Data, i: number): number => i;

  useEffect(
    () => {
      const tData = (props.data || []) as Array<Data>;

      const height = 100;
      const width = 100;
      const margin = { top: 20, right: 10, bottom: 20, left: 10 };

      const x = d3
        .scaleLinear()
        .domain(tData.map((d: Data, i: number) => i))
        .rangeRound([margin.left, width - margin.right]);

      let maxY = d3.max(tData, yValue) || new Date();
      const y1 = d3
        .scaleLinear()
        .domain([0, maxY])
        .rangeRound([height - margin.bottom, margin.top]);

      const line = d3.line<Data>()
        .x((d: Data, i: number) => { return x(xValue(d, i)) || 0; })
        .y((d: Data) => { return y1(yValue(d)) || 0; });

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
        height: 500,
        width: "100%",
        marginRight: "0px",
        marginLeft: "0px",
      }}
    >
      <g className="plot-area" />
    </svg>
  );
}

export default LineChart;
