import * as React from 'react';
import { Point } from '../interfaces/Point';
import * as d3 from 'd3';
import { Person } from '../interfaces/Person';
import { FollowRelationship } from '../interfaces/FollowRelationship';
import { enterTransition, exitTransition } from '../util/D3Utils';
import { bound } from '../util/DataUtils';
import { random } from 'lodash';
import { Simulation } from 'd3';

interface Props {
    width: number;
    height: number;
    center: Point;
    people: Person[];
    follows: FollowRelationship[];
    onHover: (id?: number) => void;
}

const PI_2 = Math.PI / 2;
const LINK_FILL = '#B8B8B8';
const NODE_FILL = '#000000';

export class SocialNetwork extends React.PureComponent<Props> {
    private circleGroup: SVGElement | null;
    private triangleGroup: SVGElement | null;

    private simulation: Simulation<Person, FollowRelationship>;

    constructor(props: Props) {
        super(props);

        const { people, follows, center } = props;

        this.simulation = d3
            .forceSimulation(people)
            .force(
                'links',
                d3
                    .forceLink(follows)
                    .id((d: Person) => d.id as any)
                    .distance(
                        (d: any) => d.source.radius + d.target.radius + 10
                    )
                    .strength(0)
            )
            .force('center', d3.forceCenter(center.x, center.y))
            .force('charge', d3.forceManyBody().strength(-1))
            .force(
                'collide',
                d3.forceCollide().radius((d: Person) => d.radius)
            );
    }

    public render() {
        const { width, height, center, people, follows, onHover } = this.props;

        // Initialize node position so they start roughly in the center
        people.forEach(p => {
            p.x = p.x || random(center.x - 50, center.x + 50);
            p.y = p.y || random(center.y - 50, center.y + 50);
        });

        this.simulation.nodes(people);
        (this.simulation.force('links') as any).links(follows);
        this.simulation.alpha(1).restart();

        let circles = d3
            .select(this.circleGroup)
            .selectAll('circle')
            .data(people, (d: Person) => d.id + '');

        circles
            .exit()
            .on('mouseover', null)
            .on('mouseout', null)
            .transition(exitTransition)
            .style('transform', 'scale(0)')
            .remove();

        const enter = circles.enter().append('circle');

        enter
            .style('transform', 'scale(0)')
            .attr('fill', NODE_FILL)
            .attr('stroke', d => d.color)
            .attr('stroke-width', d => d.radius / 4)
            .attr('data-id', d => `id-${d.id}`)
            .transition(enterTransition)
            .style('transform-origin', 'center')
            .style('cursor', 'pointer')
            .style('transform', 'scale(1)');

        circles = enter
            .merge(circles as any)
            .on('mouseover', hovering => {
                d3.selectAll('circle').each(function(d: Person) {
                    d3.select(this).attr(
                        'opacity',
                        hovering.id === d.id || hovering.following.has(d.id)
                            ? 1
                            : 0.1
                    );
                });
                d3.selectAll('polygon').each(function(d: FollowRelationship) {
                    d3.select(this).attr(
                        'opacity',
                        hovering.id === d.source.id ? 1 : 0.05
                    );
                });
                d3.selectAll(`[data-id=id-${hovering.id}]`).attr(
                    'fill',
                    hovering.color
                );
                onHover(hovering.id);
            })
            .on('mouseout', function(d) {
                d3.selectAll(`circle[data-id=id-${d.id}]`).attr(
                    'fill',
                    NODE_FILL
                );
                d3.selectAll(`polygon[data-id=id-${d.id}]`).attr(
                    'fill',
                    LINK_FILL
                );
                d3.selectAll('circle').attr('opacity', 1);
                d3.selectAll('polygon').attr('opacity', 1);
                onHover();
            })
            .attr('r', d => d.radius)
            .attr('cx', center.x)
            .attr('cy', center.y)
            .attr('fill', d => (d.hovering ? d.color : NODE_FILL));

        let triangles = d3
            .select(this.triangleGroup)
            .selectAll('polygon')
            .data(follows);

        triangles
            .exit()
            .transition(exitTransition)
            .style('transform-origin', 'center')
            .style('transform', 'scale(0)')
            .remove();

        let triangleEnter = triangles
            .enter()
            .append('polygon')
            .style('cursor', 'pointer')
            .attr('data-id', (d: FollowRelationship) => `id-${d.source.id}`);

        triangles = triangleEnter
            .merge(triangles as any)
            .attr('fill', (d: any) => (d.hovering ? d.color : LINK_FILL));

        // Update the positions of the nodes and the lines based on their physics calculations
        this.simulation.nodes(people).on('tick', () => {
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
                const triangleSize = d.source.radius / 6;
                const x1 = Math.cos(angle + PI_2) * triangleSize + source.x;
                const x2 = Math.cos(angle - PI_2) * triangleSize + source.x;
                const y1 = Math.sin(angle + PI_2) * triangleSize + source.y;
                const y2 = Math.sin(angle - PI_2) * triangleSize + source.y;

                return `${x1},${y1} ${x2},${y2} ${x4},${y4}`;
            });
        });

        return (
            <svg width={width} height={height}>
                <g ref={r => (this.triangleGroup = r)} />
                <g ref={r => (this.circleGroup = r)} />
            </svg>
        );
    }
}
