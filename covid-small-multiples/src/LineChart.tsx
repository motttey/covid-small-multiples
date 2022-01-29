import * as d3 from 'd3';
import React, { useRef, useEffect } from 'react';

import { CovidData } from './@types/data';

function LineChart(props: any): any {
  const ref = useRef(null);

  const yValue = (d: CovidData): number => d[props.keyAttribute];
  const yValueAvg = (d: CovidData): number => d[props.avgKeyAttribute];
  const xValue = (i: number): number => i;

  const height = 200;
  const width = 250;
  const margin = { top: 10, right: 10, bottom: 50, left: 10 };

  const getMergedPath = (parentSvg: any, svgName: string, className: string) => {
    const svgClassName = svgName + "." + className;
    if (!parentSvg.select(svgClassName).node()) {
      parentSvg
        .append(svgName)
        .attr("class", className)
    }
    return parentSvg.select(svgClassName)
  }

  useEffect(
    () => {
      const tData = (props.data || []) as Array<CovidData>;

      const x = d3
        .scaleLinear()
        .domain([0, tData.length - 1 || 1])
        .range([margin.left, width - margin.right]);

      const maxY = d3.max(tData, yValue) || 0;
      const minY = d3.min(tData, yValue) || 0;

      const y1 = d3
        .scaleLinear()
        .domain([minY, maxY])
        .range([height - margin.bottom, margin.top]);

      const line = d3.line<CovidData>()
        .x((d: CovidData, i: number) => { return x(xValue(i)) || 0; })
        .y((d: CovidData) => { return y1(yValue(d)) || 0; });

      const lineAvg = d3.line<CovidData>()
        .curve (d3.curveCatmullRom)
        .x((d: CovidData, i: number) => { return x(xValue(i)) || 0; })
        .y((d: CovidData) => { return y1(yValueAvg(d)) || 0; });

      const currentPath = d3.select(ref.current)
        .select(".plot-area");

      d3.select(ref.current)
        .attr("viewBox", "0 0 " + width  + " " + height)
        .attr("width", "100%")
        .attr("height", "100%");

      getMergedPath(currentPath, "path", "attributePath")
        .datum(tData)
        .transition()
        .duration(1000)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1)
        .attr("d", line);

      getMergedPath(currentPath, "line", "baseline")
        .attr("x1", x(1))
        .attr("y1", y1(minY))
        .attr("x2", x(tData.length - 1))
        .attr("y2", y1(minY))
        .attr("stroke", "gray")
        .attr("stroke-width", 1);

      if (props.avgKeyAttribute in tData[0]) {
        getMergedPath(currentPath, "path", "movingAvgPath")
          .datum(tData)
          .transition()
          .duration(1000)
          .attr("class", "movingAvgPath")
          .attr("fill", "none")
          .attr("stroke", "green")
          .attr("stroke-width", 1)
          .attr("d", lineAvg);
      }

      getMergedPath(currentPath, "text", "maxValueText")
        .attr("x", x(1))
        .attr("y", y1(maxY) - 3)
        .text(maxY.toPrecision(5))
        .style("font-size", "16px");

      getMergedPath(currentPath, "line", "maxLinePath")
        .attr("x1", x(1))
        .attr("y1", y1(maxY))
        .attr("x2", x(tData.length - 1))
        .attr("y2", y1(maxY))
        .attr("stroke", "gray")
        .attr("opacity", 0.5)
        .attr("stroke-width", 1.5);

      getMergedPath(currentPath, "text", "minValueText")
        .attr("x", x(1))
        .attr("y", y1(minY) - 3)
        .text(minY.toPrecision(5))
        .style("font-size", "16px");

      getMergedPath(currentPath, "line", "minLinePath")
        .attr("x1", x(1))
        .attr("y1", y1(minY))
        .attr("x2", x(tData.length - 1))
        .attr("y2", y1(minY))
        .attr("stroke", "gray")
        .attr("opacity", 0.5)
        .attr("stroke-width", 1.5);

    }, [props.data, props.keyAttribute, props.avgKeyAttribute]
  );

  return (
    <svg
      ref={ref}
      style={{
        height: "100%",
        width: "100%",
        marginBottom: "100px",
        marginTop: "-30px",
        marginRight: "0px",
        marginLeft: "0px",
      }}
    >
      <g className="plot-area" />
    </svg>
  );
}

export default LineChart;
