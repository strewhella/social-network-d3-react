import * as React from 'react';
import { Point } from '../interfaces/Point';
import { Person } from '../interfaces/Person';
import * as d3 from 'd3';
import { random } from 'lodash';
import { TagFrequency } from '../interfaces/TagFrequency';
import { Simulation } from 'd3';
import {
    enterTransition,
    exitTransition,
    stateChangeTransition
} from '../util/D3Utils';

interface Props {
    width: number;
    height: number;
    center: Point;
    hoverPerson?: Person;
    tagFrequencies: TagFrequency[];
}

interface State {
    finishingHover?: boolean;
}

const PADDING = window.innerWidth / 20;

export class WordCloud extends React.PureComponent<Props, State> {
    private svg: SVGElement | null;
    private simulation: Simulation<TagFrequency, any>;

    constructor(props: Props) {
        super(props);

        this.state = {};

        this.simulation = d3
            .forceSimulation(props.tagFrequencies)
            .force(
                'center',
                d3
                    .forceCenter()
                    .x(props.center.x)
                    .y(props.center.y)
            )
            .force('charge', d3.forceManyBody())
            .force('collide', d3.forceCollide());
    }

    public componentWillReceiveProps(nextProps: Props) {
        if (this.props.hoverPerson && !nextProps.hoverPerson) {
            this.setState({
                finishingHover: true
            });
        }

        if (
            this.state.finishingHover &&
            !this.props.hoverPerson &&
            !nextProps.hoverPerson
        ) {
            this.setState({
                finishingHover: false
            });
        }
    }

    public render() {
        const {
            width,
            height,
            tagFrequencies,
            hoverPerson,
            center
        } = this.props;
        const { finishingHover } = this.state;

        const selection = d3
            .select(this.svg)
            .selectAll('text')
            .data(tagFrequencies, (d: TagFrequency) => d.tag);

        const enter = selection
            .enter()
            .append('text')
            .style('transform-origin', 'center')
            .style('transform', 'scale(0)')
            .attr('x', _ => random(PADDING, width - PADDING))
            .attr('y', _ => random(PADDING, height - PADDING));
        enter.transition(enterTransition).style('transform', 'scale(1)');

        const exit = selection.exit();
        exit.interrupt('exit');
        exit.transition(exitTransition)
            .style('transform', 'scale(0)')
            .remove();

        const transition = d3.transition('words').duration(1000);

        const words = enter.merge(selection as any).text(d => d.tag);

        words.interrupt('change');
        words
            .transition(stateChangeTransition)
            .attr('fill', d => {
                // Highlight tags of hovered person
                return hoverPerson && hoverPerson.tags.has(d.tag)
                    ? hoverPerson.color
                    : d.color;
            })
            .attr('opacity', d =>
                hoverPerson && !hoverPerson.tags.has(d.tag) ? 0.1 : 1
            );

        if (!hoverPerson && !finishingHover) {
            // Reset the positions of all tags to the center so they recalculate correctly
            tagFrequencies.forEach(p => {
                p.x = random(center.x - 50, center.x + 50);
                p.y = random(center.y - 50, center.y + 50);
            });

            this.simulation.nodes(tagFrequencies);
            // Only run the simulation for a few ticks, rather than continuously
            this.simulation.tick(3);
            this.simulation.stop();
        }

        // Transition words to their force calculated positions
        words
            .transition(transition)
            .attr('x', d => d.x)
            .attr('y', d => d.y)
            .attr('font-size', d => d.count * 3 + 6 + 'px');

        return <svg ref={r => (this.svg = r)} width={width} height={height} />;
    }
}
