import * as React from 'react';
import { Point } from '../interfaces/Point';
import { Person } from '../interfaces/Person';
import * as d3 from 'd3';
import { calculateTagFrequencies } from '../util/DataUtils';

interface Props {
    width: number;
    height: number;
    center: Point;
    people: Person[];
}

export class WordCloud extends React.PureComponent<Props> {
    private svg: SVGElement | null;

    public render() {
        const { width, height, center, people } = this.props;

        const tagFrequencies = calculateTagFrequencies(people);

        let words = d3
            .select(this.svg)
            .selectAll('text')
            .data(tagFrequencies);

        const enter = words.enter().append('text');

        words.exit().remove();

        words = enter
            .merge(words as any)
            .attr('x', center.x)
            .attr('y', center.y)
            .text(d => d.tag)
            .attr('font-size', d => d.count * 6 + 'px')
            .attr('color', '#000000')
            .attr('font-family', 'sans-serif');

        const simulation = d3
            .forceSimulation(tagFrequencies)
            .force(
                'center',
                d3
                    .forceCenter()
                    .x(center.x)
                    .y(center.y)
            )
            // .force('charge', d3.forceManyBody())
            .force(
                'collide',
                d3.forceCollide().radius((d: Person) => d.radius)
            );

        simulation.nodes(tagFrequencies).on('tick', () => {
            words.attr('x', d => d.x).attr('y', d => d.y);
        });

        return <svg ref={r => (this.svg = r)} width={width} height={height} />;
    }
}
