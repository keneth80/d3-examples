import { select, event } from 'd3-selection';
import { line, linkHorizontal, linkVertical } from 'd3-shape';
import { brush } from 'd3-brush';

export const excute = () => {
    const shapeList = [
        {
            size: {
                width: 100,
                height: 100
            },
            position: {
                x: 10,
                y: 10
            },
            id: '1'
        },
        {
            size: {
                width: 100,
                height: 100
            },
            position: {
                x: 150,
                y: 150
            },
            id: '2'
        },
        {
            size: {
                width: 100,
                height: 100
            },
            position: {
                x: 290,
                y: 10
            },
            id: '3'
        }
    ]
    const d3BrushMiniMapExample = new D3BrushMiniMapExample({selector: '#result', data: shapeList});

};

export class D3BrushMiniMapExample {
    constructor(configuration = {
        selector,
        data
    }) {
        this.svg = null;
        this.svgWidth = 0;
        this.svgHeight = 0;
        this.selector = configuration.selector;
        this.data = configuration.data;

        this.minimapGroup = null;
        this.minimapWidth = 0;
        this.minimapHeight = 0;
        this.minimapMargin = {right: 20, bottom: 20};
        this.scale = 2;
        this.ratio = 4;

        this.mask = null;

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

        // minimap group
        this.minimapWidth = this.svgWidth / this.ratio;
        this.minimapHeight = this.svgHeight / this.ratio;
        this.minimapGroup = this.svg.append('g')
            .attr('transform', `translate(${(this.svgWidth - this.minimapWidth - this.minimapMargin.right)}, ${(this.svgHeight - this.minimapHeight- this.minimapMargin.bottom)})`);
        this.minimapGroup.append('rect')
            .style('fill', '#ccc')
            .style('stroke', '#888')
            .attr('class', 'minimap')
            .attr('width', this.minimapWidth)
            .attr('height', this.minimapHeight);

        // mask setup
        this.maks = this.svg.append('defs')
            .append('svg:clipPath')
            .attr('id', 'clip')
                .append('rect')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', 200)
                .attr('height', 100);
    }

    draw() {
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

        // minimap 도형 group
        const minimapGeometryGroup = this.minimapGroup.append('g').attr('class', 'minimap-geometry-group');

        minimapGeometryGroup.selectAll('.shape-rect').data(this.data).enter()
        .append('rect')
            .attr('class', 'shape-rect')
            .attr('x', (d) => d.position.x)
            .attr('y', (d) => d.position.y)
            .attr('width', (d) => d.size.width)
            .attr('height', (d) => d.size.height)
            .style('stroke', '#000')
            .style('fill', '#ff00ff');

        minimapGeometryGroup.attr('transform', 'translate(0,0) scale(0.25)');

        this.drawMiniMap();
    }

    drawMiniMap() {
        this.svg.select('.geometry-group')
            .attr('transform', `translate(0,0) scale(${this.scale})`)
            .attr('clip-path', () => { return 'url(#clip)'; });

        const brushMng = brush()
            .extent([[0, 0], [this.minimapWidth, this.minimapHeight]])
            .on('start brush', () => {
                const selected = event.selection;
                const position = selected[0]; // position informatin
                const size = selected[1]; // size informaion

                // group은 scale을 적용했으므로 scale 과 비율을 적용함.
                const brushX = (-position[0]) * this.ratio * this.scale;
                const brushY = (-position[1]) * this.ratio * this.scale;
                this.svg.selectAll('.geometry-group')
                    .attr('transform', `translate(${brushX}, ${brushY}) scale(${this.scale})`);

                // mask는 scale을 조정하지 않았으므로 scale 적용안함.
                this.maks.attr('width', size[0] * this.ratio)
                    .attr('height', size[1] * this.ratio);
            });

        this.minimapGroup.raise();
      
        this.minimapGroup.append('g')
            .attr('class', 'brush')
            .call(brushMng)
            .call(brushMng.move, [[0, 0], [this.minimapWidth / 2, this.minimapHeight / 2]]);
    }
}