import React, { Component } from 'react';
import './App.css';
import { Store } from './interfaces/Store';
import * as d3 from 'd3';
import { Person, People, FollowRelationship } from './interfaces/Person';
import { uniq } from 'lodash';
import { Menu } from './Menu';
import { Point } from './interfaces/Point';

declare var store: Store;

interface Props {}

interface State {
    people: People;
    follows: FollowRelationship[];
    width: number;
    height: number;
    center: Point;
}

class App extends Component<Props, State> {
    private ref: SVGElement | null = null;

    constructor(props: {}) {
        super(props);

        const width = window.innerWidth;
        const height = window.innerHeight;
        const center = { x: width / 2, y: height / 2 };

        this.state = {
            people: [],
            follows: [],
            width,
            height,
            center
        };

        this.onAdd = this.onAdd.bind(this);
        this.onClear = this.onClear.bind(this);
        this.onResize = this.onResize.bind(this);
    }

    public componentDidMount() {
        this.onAdd();

        window.addEventListener('resize', this.onResize);
    }

    public componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
    }

    public render() {
        // const max = d3.max(allFollows) || 0;
        // const min = d3.min(allFollows) || 0;
        // let yScale = d3
        //     .scaleLinear()
        //     .domain([min, max])
        //     .range([0, this.height / 2]);
        // let xScale = d3
        //     .scaleLinear()
        //     .domain([min, max])
        //     .range([0, this.width / 2]);

        const { width, height, follows, center } = this.state;

        console.log(width, height, center);

        const people = Object.keys(this.state.people).map(
            id => this.state.people[id]
        );

        let circles = d3
            .select(this.ref)
            .selectAll('circle')
            .attr('cx', center.x)
            .attr('cy', center.y)
            .data(people);

        circles.exit().remove();

        const enter = circles.enter().append('circle');

        circles = enter
            .merge(circles as any)
            .attr('r', d => d.radius)
            .attr('fill', '#000000')
            .attr('cx', center.x)
            .attr('cy', center.y);

        let lines = d3
            .select(this.ref)
            .selectAll('line')
            .data(follows);

        lines.exit().remove();

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
                d3.forceLink(follows).id(d => {
                    return d['id'] + '';
                })
            )
            .force(
                'center',
                d3
                    .forceCenter()
                    .x(width * 0.5)
                    .y(height * 0.5)
            )
            .force('charge', d3.forceManyBody().strength(-5))
            .force(
                'collide',
                d3.forceCollide().radius((d: Person) => d.radius)
            );

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

        return (
            <React.Fragment>
                <Menu onAdd={this.onAdd} onClear={this.onClear} />
                <svg ref={r => (this.ref = r)} width={width} height={height} />
            </React.Fragment>
        );
    }

    private onResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const center = { x: width / 2, y: height / 2 };

        this.setState({
            width,
            height,
            center
        });
    }

    private async onAdd() {
        try {
            const follows = await store.sample();

            const people = { ...this.state.people };

            // Figure out the new people
            const ids = uniq(follows.reduce((p, c) => p.concat(c), []));
            const newIds = ids.filter(id => !people[id]);

            // Fetch the tags for the new people in one go
            const newPeopleTags = await store.tags(newIds);
            // Create the new people and assign their tags
            newIds.forEach((id, i) => {
                const person = this.addPerson(id, people);
                person.tags = new Set<string>(newPeopleTags[i]);
                person.radius = person.tags.size * 0.3 + 4;
            });

            // Add the following relationship to the people
            follows.forEach(follow => {
                const a = people[follow[0]];
                const b = people[follow[1]];

                a.following.add(b.id);
                b.followed.add(a.id);
            });

            this.setState({
                people,
                follows: this.state.follows.concat(
                    follows.map(follow => {
                        return {
                            source: follow[0] + '',
                            target: follow[1] + ''
                        };
                    })
                )
            });
        } catch (err) {
            console.error(err);
        }
    }

    private onClear() {
        this.setState({
            people: {},
            follows: []
        });
    }

    private addPerson(id: number, people: People) {
        people[id] = {
            id: `${id}`,
            tags: new Set<string>(),
            radius: 0,
            following: new Set<string>(),
            followed: new Set<string>()
        };

        return people[id];
    }
}

export default App;
