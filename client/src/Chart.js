import React, { Component } from 'react';
import * as d3 from "d3";

class Chart extends Component {

	constructor(props){
    	super(props);

	      let {elementWidth, elementHeight} = props;
	      this.margin = {top: 30, right: 20, bottom: 30, left: 50};
	      this.x = d3.scaleTime().range([0, elementWidth - this.margin.left - this.margin.right]);
	      this.y = d3.scaleLinear().range([elementHeight - this.margin.top - this.margin.bottom, 0]);
	      this.elementWidth = elementWidth;
	      this.elementHeight = elementHeight;

	      this.state = {
	          data: null
	      };

	}

	componentDidMount() {
		setInterval(() => {
			this.getData()
		}, 3000);
	}

	getData() {
		fetch('http://localhost:8081/getData')
		.then(res => res.json())
		.then(resJson => {
			console.log(resJson);
			let newData = resJson.map(val => {
				return {timeStamp: d3.utcParse("%Y-%m-%dT%H:%M:%S.%LZ")(val.timeStamp), price: val.price};
			})
			console.log(newData);
			this.x.domain(d3.extent(newData, val => val.timeStamp));
			this.y.domain([0, d3.max(newData, val => val.price)]);
			this.setState({
				data: newData
			});
		})
	}

	get xAxis(){
		return d3.axisBottom(this.x).ticks(5);
	}

	get yAxis(){
		return d3.axisLeft(this.y).ticks(5);
	}

	drawXAxis(){
		d3.select(this.refs.x).call(this.xAxis);
	}

	drawYAxis(){
		d3.select(this.refs.y).call(this.yAxis);
	}

	get line(){
		return d3.line()
		  .x((d)=> (this.x(d.timeStamp)))
		  .y((d)=> (this.y(d.price)));
	}

	path(){
		return (<path className="line" d={this.line(this.state.data)}/>);
	}

	render() {
		return (
			<svg width={this.elementWidth} height={this.elementHeight}>

			          <g transform={`translate(${this.margin.left}, ${this.margin.top})`}>
			                  {this.state.data ? this.path() : null}

			              <g ref="x" className="x axis" transform={`translate(0, ${this.elementHeight - this.margin.top - this.margin.bottom})`}>
			                  {this.state.data ? this.drawXAxis() : null}
			              </g>

			              <g ref='y' className="y axis">
			                  {this.state.data ? this.drawYAxis() : null}
			              </g>
			              
			          </g>

			</svg>
		);
	}
}

export default Chart;