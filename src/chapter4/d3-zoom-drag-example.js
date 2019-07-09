import { select, event } from 'd3-selection';
import { zoom, zoomIdentity } from 'd3-zoom';
import { drag } from 'd3-drag';

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
                x: 200,
                y: 80
            },
            id: '2'
        },
        {
            size: {
                width: 100,
                height: 100
            },
            position: {
                x: 390,
                y: 50
            },
            id: '3'
        }
    ]
    const d3ZoomDragExample = new D3ZoomDragExample({selector: '#result', data: shapeList});

    select('#btn').on('click', () => {
        d3ZoomDragExample.update({
            x: 200, y:150, k: 1
        });
    });
};

export class D3ZoomDragExample {
    constructor(configuration = {
        selector,
        data
    }) {
        this.svg = null;
        this.svgWidth = 0;
        this.svgHeight = 0;
        this.selector = configuration.selector;
        this.data = configuration.data;

        // zoom event variable
        this.zoomObj = null;

        // zoom event가 반영되어야 하는 target element
        this.zoomTarget = null;

        // transform 현상태를 저장 
        this.currentTransform = null;

        this.init();
        this.draw();
    }

    init() {
        //svg create
        this.svg = select(this.selector)
            .append('svg')
                .attr('width', '100%')
                .attr('height', 450)
                .style('background', '#cccccc');
        
        // svg size check
        this.svgWidth = parseFloat(this.svg.style('width'));
        this.svgHeight = parseFloat(this.svg.style('height'));

        // zoom setup
        this.zoomObj = zoom().touchable(true) // touchable : mobile
            .scaleExtent([0.5, 2])
            .on('zoom', () => {
                this.currentTransform = event.transform;
                this.zoomTarget.attr('transform', this.currentTransform);
            });

        this.svg.call(
            this.zoomObj
        );
    }

    draw() {
        // 도형 group
        this.zoomTarget = this.svg.append('g').attr('class', 'geometry-group');

        this.zoomTarget.selectAll('.shape-rect').data(this.data).enter()
            .append('rect')
                .attr('class', 'shape-rect')
                .attr('x', (d) => d.position.x)
                .attr('y', (d) => d.position.y)
                .attr('width', (d) => d.size.width)
                .attr('height', (d) => d.size.height)
                .style('stroke', '#000')
                .style('fill', '#ff00ff')
                .call(
                    drag().touchable(true)
                        .on('start', (d) => {
                            console.log('start : ', d);
                        })
                        .on('drag', (d, i, target) => {
                            // target select
                            const element = select(target[i]);

                            // data update
                            d.position.x += event.dx;
                            d.position.y += event.dy;

                            // element update
                            element
                            .attr('x', (d) => d.position.x)
                            .attr('y', (d) => d.position.y);
                        })
                        .on('end', (d) => {
                            console.log('end : ', d);
                        })
                );
    }

    update(position) {
        this.currentTransform = position;
        // https://github.com/d3/d3-zoom/blob/v1.7.3/README.md#zoomIdentity
        const transForm = zoomIdentity.translate(this.currentTransform.x, this.currentTransform.y).scale(this.currentTransform.k);
        this.svg.call(this.zoomObj.transform, transForm);
        // this.zoomTarget.attr('transform', `translate(${this.currentTransform.x},${this.currentTransform.y})scale(${this.currentTransform.k})`);
    }
}