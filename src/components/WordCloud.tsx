import * as React from 'react';
import { Point } from '../interfaces/Point';
import { Person } from '../interfaces/Person';
import * as d3 from 'd3';
import { calculateTagFrequencies } from '../util/DataUtils';
import { random } from 'lodash';
import { TagFrequency } from '../interfaces/TagFrequency';
import { enterTransition, exitTransition } from '../util/D3Utils';

interface Props {
    width: number;
    height: number;
    center: Point;
    people: Person[];
}

const PADDING = window.innerWidth / 20;

export class WordCloud extends React.PureComponent<Props> {
    private svg: SVGElement | null;

    public render() {
        const { width, height, center, people } = this.props;

        const tagFrequencies = calculateTagFrequencies(people);

        const selection = d3
            .select(this.svg)
            .selectAll('text')
            .data(tagFrequencies, (d: TagFrequency) => d.tag);

        const enter = selection
            .enter()
            .append('text')
            .style('transform-origin', 'center')
            .attr('x', _ => random(PADDING, width - PADDING))
            .attr('y', _ => random(PADDING, height - PADDING));
        enter.transition(enterTransition).style('transform', 'scale(1)');

        selection
            .exit()
            .transition(exitTransition)
            .style('transform', 'scale(0)')
            .remove();

        const transition = d3.transition('words').duration(1000);

        const words = enter
            .merge(selection as any)
            .text(d => d.tag)
            .attr('font-size', d => d.count * 3 + 'px')
            .attr('fill', '#bababa');

        const simulation = d3
            .forceSimulation(tagFrequencies)
            .force(
                'center',
                d3
                    .forceCenter()
                    .x(center.x)
                    .y(center.y)
            )
            .force('charge', d3.forceManyBody())
            .force('collide', d3.forceCollide());

        // Only run the simulation for 10 ticks, rather than continuously
        simulation.tick(10);
        simulation.stop();

        // Transition words to their force calculated positions
        words
            .transition(transition)
            .attr('x', d => d.x)
            .attr('y', d => d.y);

        return <svg ref={r => (this.svg = r)} width={width} height={height} />;
    }
}
