import { select } from 'd3-selection';
import { line } from 'd3-shape';

export class D3ShapeExample {
    constructor(configuration = {
        selector,
        data
    }) {
        this.svg = null;
        this.svgWidth = 0;
        this.svgHeight = 0;
        this.selector = configuration.selector;
        this.data = configuration.data;
        this.init();
        this.draw();
    }

    init() {
        //svg create
        this.svg = select(this.selector)
            .append('svg')
                .attr('width', '100%')
                .attr('height', 350)
                .style('background', '#cccccc');
        
        // svg size check
        this.svgWidth = parseFloat(this.svg.style('width'));
        this.svgHeight = parseFloat(this.svg.style('height'));
    }

    draw() {
        // line group
        const lineGroup = this.svg.append('g').attr('class', 'line-group');
        
        // 도형 group
        const geometryGroup = this.svg.append('g').attr('class', 'geometry-group');

        geometryGroup.selectAll('.shape-rect').data(this.data).enter()
            .append('rect')
                .attr('class', 'shape-rect')
                .attr('x', (d) => d.position.x)
                .attr('y', (d) => d.position.y)
                .attr('width', (d) => d.size.width)
                .attr('height', (d) => d.size.height)
                .style('stroke', '#000')
                .style('fill', '#ff00ff');

        const positions = [];
        geometryGroup.selectAll('.shape-rect')
            .each((data, index, nodeList) => {
                const nextTarget = nodeList[index + 1];
                const position = [];
                // from position
                position.push({
                    x: data.position.x + data.size.width/2, // width
                    y: data.position.y + data.size.height/2
                });
                // to position
                if (nextTarget) {
                    const nextTargetSelection = select(nextTarget);
                    position.push({
                        x: parseFloat(nextTargetSelection.attr('x')) + data.size.width/2, // not
                        y: parseFloat(nextTargetSelection.attr('y')) + data.size.height/2
                    });
                }
                positions.push(position);
            });
        
        const lineFunction = line()
            .x((d) => {
                return d.x; 
            })
            .y((d) => { 
                return d.y; 
            });
        
        lineGroup.selectAll('.line').data(positions).enter()
            .append('path')
                .attr('class', 'line')
                .style('stroke', '#000000')
                .style('stroke-width', 5)
                .attr('d', (data) => {
                    return lineFunction(data);
                });
        
    }
}