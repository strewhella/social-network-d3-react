import * as React from 'react';
import { Point } from '../interfaces/Point';
import { Person } from '../interfaces/Person';
import * as d3 from 'd3';
import { random } from 'lodash';
import { TagFrequency } from '../interfaces/TagFrequency';
import { Simulation } from 'd3';
import { filterTags } from '../util/DataUtils';
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
    search?: string;
}

interface State {
    interacting?: boolean;
}

const PADDING = window.innerWidth / 20;

export class WordCloud extends React.PureComponent<Props, State> {
    private svg: SVGElement | null;
    private simulation: Simulation<TagFrequency, any>;

    constructor(props: Props) {
        super(props);

        this.state = {};

        this.simulation = this.createSimulation();
    }

    public componentWillReceiveProps(nextProps: Props) {
        if (
            (this.props.hoverPerson && !nextProps.hoverPerson) ||
            (!this.props.hoverPerson && nextProps.hoverPerson) ||
            this.props.search !== nextProps.search
        ) {
            this.setState({
                interacting: true
            });
        }

        if (
            this.state.interacting &&
            (!this.props.hoverPerson &&
                !nextProps.hoverPerson &&
                this.props.search === nextProps.search)
        ) {
            this.setState({
                interacting: false
            });
        }

        if (
            this.props.tagFrequencies.length === 0 &&
            nextProps.tagFrequencies.length > 0
        ) {
            this.simulation = this.createSimulation();
        }
    }

    public render() {
        const {
            width,
            height,
            tagFrequencies,
            hoverPerson,
            center,
            search
        } = this.props;
        const { interacting } = this.state;

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

        const exit = selection.exit();
        exit.interrupt('exit');
        exit.transition(exitTransition)
            .style('transform', 'scale(0)')
            .remove();

        const transition = d3.transition('words').duration(1000);

        const words = enter.merge(selection as any).text(d => d.tag);

        const filteredTags =
            (search && filterTags(tagFrequencies, search)) || [];

        words.interrupt('change');
        words
            .transition(stateChangeTransition)
            .attr('fill', d => {
                // Highlight tags of hovered person
                return (hoverPerson && hoverPerson.tags.has(d.tag)) ||
                    (search && filteredTags.some(t => d.tag === t))
                    ? '#000000'
                    : d.color;
            })
            .attr('opacity', d =>
                (hoverPerson && !hoverPerson.tags.has(d.tag)) ||
                (search && !filteredTags.some(t => d.tag === t))
                    ? 0.05
                    : 1
            );

        if (!interacting) {
            // Reset the positions of all tags to the center so they recalculate correctly
            tagFrequencies.forEach(p => {
                p.x = random(center.x - PADDING, center.x + PADDING);
                p.y = random(center.y - PADDING, center.y + PADDING);
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

    private createSimulation() {
        const { tagFrequencies, center } = this.props;
        return d3
            .forceSimulation(tagFrequencies)
            .force(
                'center',
                d3
                    .forceCenter()
                    .x(center.x)
                    .y(center.y)
            )
            .force(
                'charge',
                d3.forceManyBody().strength(-window.innerHeight / 4)
            )
            .force('collide', d3.forceCollide().strength(50));
    }
}
