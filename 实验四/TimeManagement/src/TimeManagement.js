import * as d3 from "d3";

function TimeManagement(data, {
  width = 1500,
  height = 500,
  marginTop = 10,
  marginRight = 80,
  marginBottom = 20,
  marginLeft = 40,

} = {}) {
  const dateFormat = '%Y-%m-%d';
  const parseDate = d3.timeParse(dateFormat);


  data.forEach(d => {
    const dateString = d.date;
    const timestamp = parseDate(dateString).getTime();
    d.date = timestamp;
  });
  const series = d3.stack()
    .keys(d3.union(data.map(d => d.activity)))
    .value(([, D], key) => D.get(key).duration)
    (d3.index(data, d => d.date, d => d.activity));

  const x = d3.scaleUtc()
    .domain(d3.extent(data, d => d.date))
    .range([marginLeft, width - marginRight]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
    .rangeRound([height - marginBottom, marginTop]);

  const color = d3.scaleOrdinal()
    .domain(series.map(d => d.key))
    .range(d3.schemeTableau10);

  const area = d3.area()
    .x(d => x(d.data[0]))
    .y0(d => y(d[0]))
    .y1(d => y(d[1]))
    .curve(d3.curveCardinal);

  // Create the SVG container.
  const svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

  // Add the y-axis, remove the domain line, add grid lines and a label.
  // svg.append("g")
  //   .attr("transform", `translate(${marginLeft},0)`)
  //   .call(d3.axisLeft(y).ticks(height / 80))
  //   .call(g => g.select(".domain").remove())
  //   .call(g => g.selectAll(".tick line").clone()
  //     .attr("x2", width - marginLeft - marginRight))
  //   .call(g => g.append("text")
  //     .attr("x", -marginLeft)
  //     .attr("y", 20)
  //     .attr("fill", "currentColor")
  //     .attr("text-anchor", "start")
  //     .text("↑ duration "));
  svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y)
      .ticks(height / 80)
      .tickFormat(d3.format(".1f")) // 将刻度标签格式化为一位小数
    )
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line").clone()
      .attr("x2", width - marginLeft - marginRight))
    .call(g => g.append("text")
      .attr("x", -marginLeft)
      .attr("y", 20)
      .attr("fill", "currentColor")
      .attr("text-anchor", "start")
      .text("collected duration"));

  // Append a path for each series.
  svg.append("g")
    .selectAll()
    .data(series)
    .join("path")
    .attr("fill", d => color(d.key))
    .attr("d", area)
    .append("title")
    .text(d => d.key);

  // Append the horizontal axis atop the area.

  // svg.append("g")
  //   .attr("transform", `translate(0,${height - marginBottom})`)
  //   .call(d3.axisBottom(x).tickSizeOuter(0));
  svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x).ticks(d3.timeDay.every(1)).tickFormat(d3.timeFormat('%Y-%m-%d')))
  // 创建 x 轴的标签
  svg.append("text")
    .attr("x", width - marginRight + 60) // 在 x 轴的右端
    .attr("y", height - marginBottom + 20) // 稍微上移一些，使其不会与 x 轴重叠
    .attr("text-anchor", "end") // 设置文本锚点在右侧
    .attr("fill", "currentColor") // 文本颜色
    // 创建 x 轴的标签
    .style("font-size", "12px")
    .text("Date"); // 标签文本，可以根据你的数据类型进行调整

  // 在 SVG 外创建一个图例容器
  const legend = d3.select("body").append("div")
    .attr("class", "legend")
    .style("position", "absolute")
    .style("top", "20px")
    .style("right", "20px");

  // 获取所有不同的 activity 类别
  const activityCategories = series.map(d => d.key);

  // 为每个 activity 创建图例项
  legend.selectAll("div")
    .data(activityCategories)
    .enter().append("div")
    .style("margin", "5px")
    .style("display", "flex")
    .html(d => `
    <span style="background-color: ${color(d)}; width: 20px; height: 20px; margin-right: 5px;"></span>
    <span>${d}</span>
  `);



  return svg.node();
}

export default TimeManagement;