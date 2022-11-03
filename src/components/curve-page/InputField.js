import React, { Component, createRef, memo } from 'react'
import * as d3 from 'd3';

class InputField extends Component {
    constructor(props){
        super(props)
        this.createLineChart = this.createLineChart.bind(this);
        this.node = createRef();
        const { duration, data, getCurrent, setCurrent, changeValuesInCurve, sectionsData } = props;
        this.data = data;
        this.sectionsData = sectionsData || [
            0.0,
            duration
        ];
        this.duration = duration;
        this.getCurrent = getCurrent;
        this.setCurrent = setCurrent;
        this.option = {
            'r': 10,
            'color': "#000"
        };
        this.changeValuesInCurve = changeValuesInCurve;
    }

    componentDidMount() {
        this.createLineChart(this.node.current);
    }

    createLineChart(node) {
        const self = this;
        const margin = { top: 20, right: 20, bottom: 20, left: 40 };
        this.margin = margin;

        this.svg = d3.select(node);
        this.size = {
            width: 760,
            height: 156,
        };
        this.axis = {
            minValue: -1.0,
            maxValue: 1.0
        };

        this.xScale = d3.scaleLinear()
            .domain([0, this.duration])
            .range([margin.left, this.size.width - margin.right]);
        this.yScale = d3.scaleLinear()
            .domain([this.axis.maxValue, this.axis.minValue])
            .range([margin.top, this.size.height - margin.bottom]);
        var xScale = this.xScale;
        var yScale = this.yScale;
        var xAxis = d3.axisBottom(this.xScale);
        var yAxis = d3.axisLeft(this.yScale);

        this.svg.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', this.size.width)
            .attr('height', this.size.height)
            .attr('fill', 'white');
        

        this.svg.append("g").attr("class", "axis")
            .attr("transform", "translate(" + [0, this.size.height - margin.bottom] + ")")
            .call(xAxis);

        this.svg.append("g").attr("class", "axis")
            .attr("transform", "translate(" + [margin.left, 0] + ")")
            .call(yAxis);
        
        this.svg.select('rect').on("click", function() {
            var coords = d3.mouse(this);
            var newData = {
                x: Math.round(xScale.invert(coords[0]) * 100) / 100,
                y: Math.round(yScale.invert(coords[1]) * 100) / 100,
                axis: 'hv',
                type: 'custom',
                state: 'middle'
            };

            if(0 <= newData.x && newData.x <= self.duration && 
                self.axis.minValue <= newData.y && newData.y <= self.axis.maxValue) {
                self.data.push(newData);
                self.updateChart();
            }
        });

        this.line = d3.line()
            .x((_, i) => {
                return this.xScale(this.data[i].x);
            })
            .y((_, i) => {
                return this.yScale(this.data[i].y);
            });
        
        this.svg.append("path")
            .attr("class", "line")
            .attr("fill", 'white')
            .attr("d", this.line(this.data))
            .attr("stroke", this.option.color);
        
        this.headLine = this.svg.append("line")
            .attr('class', 'head-line')
            .attr('x1', this.xScale(this.current))
            .attr('y1', margin.top)
            .attr('x2', this.xScale(this.current))
            .attr('y2', this.size.height - margin.bottom)
            .attr("stroke-width",4)
            .attr("stroke","#0e9aa7");

        setInterval(() => {
            this.current = this.getCurrent();
            this.headLine
                .attr("x1", this.xScale(this.current))
                .attr("x2", this.xScale(this.current));
        }, 500);
        this.updateChart();
    }

    updateChart() {
        const xScale = this.xScale;
        const yScale = this.yScale;
        this.data.sort((d1, d2) => { 
            if(d1.x > d2.x) return 1;
            else if(d1.x < d2.x) return -1;
            return 0;
        });

        this.sectionsData.sort((d1, d2) => { 
            if(d1 > d2) return 1;
            else if(d1 < d2) return -1;
            return 0;
        });

        const sectionsDataLength = this.sectionsData.length;
        const colorScale = d3.scaleOrdinal(d3.schemeSet3);
        const sectionRects = this.svg.selectAll(".section")
            .data(this.sectionsData);
        sectionRects.enter().append("rect")
            .merge(sectionRects)
            .attr("class", "section")
            .attr("x", d => xScale(d))
            .attr("y", _ => yScale(-1))
            .attr("width", (d, i) => {
                if(i < sectionsDataLength - 1) {
                    return xScale(this.sectionsData[i + 1]) - xScale(this.sectionsData[i]);
                } else {
                    return 0.0;
                }
            })
            .attr("height", 10)
            .attr("fill", (_, i) => colorScale(i))
            .on("click", d => {
                this.sectionsData.push(xScale.invert(d3.event.offsetX));
                this.updateChart();
            });
        sectionRects.exit()
            .remove();
        
        const sectionLines = this.svg.selectAll(".sectionLine")
            .data(this.sectionsData);
        sectionLines.enter().append("line")
            .merge(sectionLines)
            .attr("class", "sectionLine")
            .attr("x1", d => xScale(d))
            .attr("x2", d => xScale(d))
            .attr("y1", yScale(-1))
            .attr("y2", yScale(-1) + 10)
            .attr("stroke-width", 4)
            .attr("stroke", "#000")
            .style("cursor", 'ew-resize')
            .call(this.onDraggableSection(xScale))
            .on('dblclick', (d, i) => {
                if(i == 0 || i == this.sectionsData.length - 1) {
                    return;
                }
                this.sectionsData.splice(i, 1);
                this.updateChart();
            });

        const circle = this.svg.selectAll("circle")
            .data(this.data, d => { return d; });
        this.svg.select(".line").attr("d", this.line(this.data));
        circle.enter().append("circle")
            .merge(circle)
            .attr("fill", d => {
                if(d.state == "start") return "green";
                else if(d.state == "end") return "red";
                else return "white";
            })
            .attr("stroke", "rgb(0, 0, 0)")
            .attr("class", "graph-point")
            .attr("cx", (d) => { 
                return xScale(d.x); 
            })
            .attr("cy", (d) => { 
                return yScale(d.y);
            })
            .style("cursor", function(d) { 
                if(d.axis.includes('v') && d.axis.includes('h')) return 'all-scroll';
                else if(d.axis.includes('v')) return 'ns-resize';
                else if(d.axis.includes('h')) return 'ew-resize';
                else return 'pointer';
            })
            .attr("r", this.option.r)
            .call(this.onDraggablePoint())
            .on('dblclick', (d, i) => {
                if(d.type === 'custom') {
                    this.data.splice(i, 1);
                    this.updateChart();
                }
            });
        circle.exit().remove();
    }

    onDraggablePoint() {
        var self = this;
        const xScale = this.xScale;
        const yScale = this.yScale;
        const vis = this.svg.select('rect');
        return d3.drag()
            .on('start', d => {
                this.selected = d;
                this.setCurrent(d.x);
            })
            .on('drag', d => {
                const coords = d3.mouse(vis.node());
                this.selected.x = d.axis.includes('h') ? 
                    Math.max(0, Math.min(this.duration, Math.round(xScale.invert(coords[0]) * 100) / 100)) : d.x;
                    this.selected.y = d.axis.includes('v') ? Math.max(this.axis.minValue, 
                    Math.min(this.axis.maxValue, Math.round(yScale.invert(coords[1]) * 100) / 100)) : d.y;
                self.updateChart();
            })
            .on('end', d => {
                this.selected = undefined;
                this.changeValuesInCurve(this.data);
            });
    }

    onDraggableSection(xScale) {
        var self = this;
        return d3.drag()
            .on('start', d => {
            })
            .on('drag', (_, i) => {
                this.sectionsData[i] = xScale.invert(d3.event.x);
                this.updateChart();
            })
            .on('end', d => {
            });
    }

    render() {
        return <svg width="100%" ref={this.node} />
    }
}

export default memo(InputField);