import * as React from 'react';
import { Point } from '../interfaces/Point';
import * as d3 from 'd3';
import { Person } from '../interfaces/Person';
import { FollowRelationship } from '../interfaces/FollowRelationship';
import { transition } from 'd3';
import { enterTransition, exitTransition } from '../util/D3Utils';

interface Props {
    width: number;
    height: number;
    center: Point;
    people: Person[];
    follows: FollowRelationship[];
}

export class SocialNetwork extends React.PureComponent<Props> {
    private svg: SVGElement | null;

    public render() {
        const { width, height, center, people, follows } = this.props;

        let circles = d3
            .select(this.svg)
            .selectAll('circle')
            .attr('cx', center.x)
            .attr('cy', center.y)
            .data(people, (d: Person) => d.id + '');

        circles
            .exit()
            .transition(exitTransition)
            .style('transform-origin', 'center')
            .style('transform', 'scale(0)')
            .remove();

        const enter = circles.enter().append('circle');
        enter
            .style('transform', 'scale(0)')
            .transition(enterTransition)
            .style('transform-origin', 'center')
            .style('transform', 'scale(1)');

        circles = enter
            .merge(circles as any)
            .attr('r', d => d.radius)
            .attr('fill', '#000000')
            .attr('cx', center.x)
            .attr('cy', center.y);

        let lines = d3
            .select(this.svg)
            .selectAll('line')
            .data(follows);

        lines
            .exit()
            .transition(exitTransition)
            .style('transform-origin', 'center')
            .style('transform', 'scale(0)')
            .remove();

        let linkEnter = lines
            .enter()
            .append('line')
            .attr('stroke', function(d) {
                return '#ddd';
            })
            .attr('strokeWidth', _ => 4);

        lines = linkEnter.merge(lines as any);

        // Create a force simulation that attracts circles to the center of the screen
        // but repel and collide with each other
        const simulation = d3
            .forceSimulation(people)
            .force(
                'links',
                d3.forceLink(follows).id((d: Person) => d.id as any)
            )
            .force(
                'center',
                d3
                    .forceCenter()
                    .x(center.x)
                    .y(center.y)
            )
            .force('charge', d3.forceManyBody().strength(-5))
            .force(
                'collide',
                d3.forceCollide().radius((d: Person) => d.radius)
            );

        // Update the positions of the nodes and the lines based on their physics calculations
        simulation.nodes(people).on('tick', () => {
            circles
                .attr('cx', (d: any) =>
                    Math.max(d.radius, Math.min(width - d.radius, d.x))
                )
                .attr('cy', (d: any) =>
                    Math.max(d.radius, Math.min(height - d.radius, d.y))
                );
            lines
                .attr('x1', (d: any) => d.source.x)
                .attr('x2', (d: any) => d.target.x)
                .attr('y1', (d: any) => d.source.y)
                .attr('y2', (d: any) => d.target.y);
        });

        return <svg ref={r => (this.svg = r)} width={width} height={height} />;
    }
}
