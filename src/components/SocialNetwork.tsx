import * as React from 'react';
import { Point } from '../interfaces/Point';
import * as d3 from 'd3';
import { Person } from '../interfaces/Person';
import { FollowRelationship } from '../interfaces/FollowRelationship';
import { enterTransition, exitTransition } from '../util/D3Utils';
import { bound } from '../util/DataUtils';

interface Props {
    width: number;
    height: number;
    center: Point;
    people: Person[];
    follows: FollowRelationship[];
}

const PI_2 = Math.PI / 2;

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
            .style('transform', 'scale(0)')
            .remove();

        const enter = circles.enter().append('circle');
        enter
            .style('transform', 'scale(0)')
            .attr('fill', '#000000')
            .attr('stroke', d => d.color)
            .attr('stroke-width', d => d.radius / 4)
            .transition(enterTransition)
            .style('transform-origin', 'center')
            .style('transform', 'scale(1)');

        circles = enter
            .merge(circles as any)
            .attr('r', d => d.radius)
            .attr('cx', center.x)
            .attr('cy', center.y);

        let triangles = d3
            .select(this.svg)
            .selectAll('polygon')
            .data(follows);

        triangles
            .exit()
            .transition(exitTransition)
            .style('transform-origin', 'center')
            .style('transform', 'scale(0)')
            .remove();

        let triangleEnter = triangles.enter().append('polygon');

        triangles = triangleEnter.merge(triangles as any);

        // Create a force simulation that attracts circles to the center of the screen
        // but repel and collide with each other
        const simulation = d3
            .forceSimulation(people)
            .force(
                'links',
                d3
                    .forceLink(follows)
                    .id((d: Person) => d.id as any)
                    .distance(
                        (d: any) => d.source.radius + d.target.radius + 10
                    )
                    .strength(1)
            )
            .force('center', d3.forceCenter(center.x, center.y))
            .force('charge', d3.forceManyBody().strength(-40))
            .force(
                'collide',
                d3.forceCollide().radius((d: Person) => d.radius)
            );

        // Update the positions of the nodes and the lines based on their physics calculations
        simulation.nodes(people).on('tick', () => {
            // Keep nodes within the width and height bounds
            // https://bl.ocks.org/mbostock/1129492
            circles
                .attr('cx', (d: any) => bound(d.x, d.radius, width))
                .attr('cy', (d: any) => bound(d.y, d.radius, height));

            triangles.attr('points', (d: any) => {
                const source = {
                    x: bound(d.source.x, d.source.radius, width),
                    y: bound(d.source.y, d.source.radius, height)
                };
                const target = {
                    x: bound(d.target.x, d.target.radius, width),
                    y: bound(d.target.y, d.target.radius, height)
                };

                // Calculate the angle of the line between the nodes
                const angle = Math.atan2(
                    target.y - source.y,
                    target.x - source.x
                );

                // Move the target center point to the edge closest to the source node
                const x4 = Math.cos(angle) * -d.target.radius + target.x;
                const y4 = Math.sin(angle) * -d.target.radius + target.y;

                // Create 2 source points moved out from the source center
                // by a third the radius at right angles from the angle between nodes
                // to give directionality to follow relationship
                const triangleSize = d.source.radius / 3;
                const x1 = Math.cos(angle + PI_2) * triangleSize + source.x;
                const x2 = Math.cos(angle - PI_2) * triangleSize + source.x;
                const y1 = Math.sin(angle + PI_2) * triangleSize + source.y;
                const y2 = Math.sin(angle - PI_2) * triangleSize + source.y;

                return `${x1},${y1} ${x2},${y2} ${x4},${y4}`;
            });
        });

        return <svg ref={r => (this.svg = r)} width={width} height={height} />;
    }
}
