import * as d3 from "d3";
function Histogram(data) {
 /* var radioData = [
    { label: '绝对数值映射', value: '0' },
    { label: '相对数值映射', value: '1' }    ];
  var radios = d3.select('#choose')
      .selectAll('label')
      .data(radioData)
      .enter()
      .append('label');
    radios.append('input')
      .attr('type', 'radio')
      .attr('name', 'options') 
      .attr('value', function(d) { return d.value; })
      .property('checked', function(d, i) { return i === 1; }); 
    radios.append('span')
      .text(function(d) { return d.label; });
    var selectedValue;
    d3.selectAll('input[type="radio"]').on('change', function() {
        selectedValue = d3.select('input[name="options"]:checked').node().value;
        console.log(selectedValue)
    })
  */
  const svgg = d3.select("#title")
    .attr("width", 600)
    .attr("height", 30)
    .attr("style", "max-width: 100%; height: auto;");
  svgg.append("g")
  .call(g => g.append("text")
    .attr("x", 0)
    .attr("y", 25)
    .attr("font-size",20)
    .attr("fill", "currentColor")
    .attr("text-anchor", "start")
    .text("Top Youtuber分区与所在地区社会发展情况的关系"));
  for(let i=0;i<data.length;i++){
     data[i].Animals*=1;
     data[i].Autos*=1;
     data[i].Comedy*=1;
     data[i].Education*=1;
     data[i].Entertainment*=1;
     data[i].Film*=1;
     data[i].Games*=1;
     data[i].Howto*=1;
     data[i].Music*=1;
     data[i].Nonprofit*=1;
     data[i].News*=1;
     data[i].People*=1;
     data[i].Sports*=1;
     data[i].Tech*=1;
  }
  console.log(data);
  var item = data.flatMap(({ ii, ...values }) =>
  Object.entries(values).map(([key, value]) => ({ ii, key, value }))
  )
  console.log(item);
  //var item1=item;
  var item1=Object.groupBy(item, (d) => d.ii[0])
  console.log(item1);
  var items=[]
  for(let i=0;i<data.length;i++){items[i]=item1[i].map(({ii,key,value})=>({axis:key,value}))}
  //var item2=items
  console.log(items)
    const mValue=[0,0,0]
    console.log(mValue)
    for(let i=0;i<items.length;i++){
      for(let j=0;j<items[i].length;j++)
      mValue[i]=Math.max(mValue[i],items[i][j].value)}
    for(let i=0;i<items.length;i++){
      for(let j=0;j<items[i].length;j++)
        items[i][j].value=items[i][j].value/mValue[i]*100} 
  const axesDomain=["Animals(3)","Autos(3)","Comedy(51)","Education(49)","Entertainment(304)","Film(42)","Games(98)","Howto(36)","Music(216)","News(30)","Nonprofit(2)","People(101)","Sports(13)","Tech(7)"]
  //const axesDomain = items[0].map(d => d.axis)
  //const maxValue =  d3.max(item.map(d => d.value))
  //console.log(maxValue)
  const maxValue=100
  const axesLength =  items[0].length
  const formatPercent = d3.format(',.0%')
  const width = 600
  const axisLabelFactor = 1.12
  const axisCircles = 2
  const dotRadius = 4
  const margin = 60
  const height = 600
  const radius = (height-(margin*2)) / 2
  const angleSlice = Math.PI * 2 / axesLength
  const device = d => ["受高等教育人口百分比", "失业人口百分比","城镇人口百分比"][d]
  var radarLine = d3.lineRadial()
    .curve(d3.curveCardinalClosed)
    .radius(d => rScale(d))
    .angle((d, i) => i * angleSlice)
  var rScale = d3.scaleLinear()
    .domain([0, maxValue])
    .range([0, radius])
  const color = d3.scaleOrdinal()
    .range(["#EDC951","#CC333F","#00A0B0","#003F3F"])
  const svg = d3.select("#svg1")
    .attr("width", width+20)
    .attr("height", height)
    .attr("viewBox", [0, 0, width+20, height])
    .attr("style", "max-width: 100%; height: auto;");
  for(let i=0;i<items.length;i++){
      svg.append("g")
        .call(g => g.append("text")
          .attr("x", 50)
          .attr("y", 30+15*i)
          .attr("font-size",10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text(device(i)));
      svg.append("g")
        .call(g=>g.append("rect")
          .attr("x",20)
          .attr("y",20+15*i)
          .attr("width",20)
          .attr("height",10)
          .attr("fill", color(i)));
    }
    svg.append("g")
    .call(g => g.append("text")
      .attr("x", 20)
      .attr("y", 580)
      .attr("font-size",10)
      .attr("fill", "currentColor")
      .attr("text-anchor", "start")
      .text("注：括号内数值为本类型频道参考youtuber数量"));
  const containerWidth = width-(margin*2);
  const containerHeight = height-(margin*2);
  const container = svg.append('g')
    .attr("width", containerWidth)
    .attr("height", containerHeight)
    .attr('transform', `translate(${(width/2)}, ${(height/2)})`);
  
	var axisGrid = container.append("g")
    .attr("class", "axisWrapper");
	axisGrid.selectAll(".levels")
	   .data(d3.range(1,(axisCircles+1)).reverse())
	   .enter()
      .append("circle")
      .attr("class", "gridCircle")
      .attr("r", (d, i) => radius/axisCircles*d)
      .style("fill", "#CDCDCD")
      .style("stroke", "#CDCDCD")
      .style("fill-opacity", 0.1);
	const axis = axisGrid.selectAll(".axis")
		.data(axesDomain)
		.enter()
      .append("g")
      .attr("class", "axis");

	axis.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", (d, i) => rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2))
		.attr("y2", (d, i) => rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2))
		.attr("class", "line")
		.style("stroke", "white")
		.style("stroke-width", "2px");
	axis.append("text")
		.attr("class", "legend")
		.style("font-size", "11px")
		.attr("text-anchor", "middle")
    .attr("font-family", "monospace")
    .attr("dy", "0.35em")
		.attr("x", (d, i) => rScale(maxValue * axisLabelFactor) * Math.cos(angleSlice*i - Math.PI/2))
		.attr("y", (d, i) => rScale(maxValue * axisLabelFactor) * Math.sin(angleSlice*i - Math.PI/2))
		.text(d => d);
  
  var plots = container.append('g')
    .selectAll()
    .data(items)
    .join('g')
      .attr("data-name", (d, i) => device(i))
      .attr("fill", (d, i) => color(i))
      .attr("stroke", (d, i) => color(i));
  //console.log(plots)
  plots.append('path')
    .attr("d", d => radarLine(d.map(v => v.value)))
    .attr("fill", (d, i) => color(i))
    .attr("fill-opacity", 0.1)
    .attr("stroke", (d, i) => color(i))
    .attr("stroke-width", 2);

	plots.selectAll("circle")
		.data(d => d)
    .join("circle")
		  .attr("r", dotRadius)
		  .attr("cx", (d,i) => rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2))
		  .attr("cy", (d,i) => rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2))
		  .style("fill-opacity", 0.8);
  return svg.node();
}
export default Histogram;
