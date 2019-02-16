import React, { Component } from 'react';
import './App.css';
import { Store } from './interfaces/Store';
import * as d3 from 'd3';
import { Person, People, FollowRelationship } from './interfaces/Person';
import { uniq } from 'lodash';

declare var store: Store;

interface Props {}

interface State {
    people: People;
    follows: FollowRelationship[];
}

class App extends Component<Props, State> {
    private width: number;
    private height: number;
    private ref: SVGElement | null = null;

    constructor(props: {}) {
        super(props);

        this.state = {
            people: [],
            follows: []
        };

        this.onAdd = this.onAdd.bind(this);
    }

    public componentDidMount() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.onAdd();
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

        const people = Object.keys(this.state.people).map(
            id => this.state.people[id]
        );

        let circles = d3
            .select(this.ref)
            .selectAll('circle')
            .attr('cx', this.width / 2)
            .attr('cy', this.height / 2)
            .data(people);

        circles.exit().remove();

        const enter = circles.enter().append('circle');

        circles = enter
            .merge(circles as any)
            .attr('r', d => {
                return d.tags.size * 0.5 + 5;
            })
            .attr('fill', '#000000')
            .attr('cx', this.width / 2)
            .attr('cy', this.height / 2);

        let lines = d3
            .select(this.ref)
            .selectAll('line')
            .data(this.state.follows);

        let linkEnter = lines
            .enter()
            .append('line')
            .attr('stroke', function(d) {
                return '#ddd';
            })
            .attr('strokeWidth', _ => 4);

        lines = linkEnter.merge(lines as any);

        lines.exit().remove();

        // Create a force simulation that attracts circles to the center of the screen
        // but repel and collide with each other

        const simulation = d3
            .forceSimulation(people)
            .force(
                'links',
                d3.forceLink(this.state.follows).id(d => {
                    return d['id'] + '';
                })
            )
            .force(
                'center',
                d3
                    .forceCenter()
                    .x(this.width * 0.5)
                    .y(this.height * 0.5)
            )
            .force('charge', d3.forceManyBody())
            .force(
                'collide',
                d3.forceCollide().radius((d: Person) => d.tags.size * 0.5 + 5)
            );

        simulation.nodes(people).on('tick', () => {
            circles
                .attr('cx', (d: any) => {
                    if (d.x < 0) {
                        return 0;
                    } else if (d.x > this.width) {
                        return this.width;
                    }
                    return d.x;
                })
                .attr('cy', (d: any) => {
                    if (d.y < 0) {
                        return 0;
                    } else if (d.y > this.height) {
                        return this.height;
                    }
                    return d.y;
                });
            lines
                .attr('x1', (d: any) => d.source.x)
                .attr('x2', (d: any) => d.target.x)
                .attr('y1', (d: any) => d.source.y)
                .attr('y2', (d: any) => d.target.y);
        });

        return (
            <React.Fragment>
                <button
                    style={{
                        position: 'fixed',
                        top: '30px',
                        left: '30px',
                        backgroundColor: 'white',
                        border: 'black 3px solid',
                        width: '100px',
                        height: '100px'
                    }}
                    onClick={this.onAdd}
                >
                    Add
                </button>
                <svg
                    ref={r => (this.ref = r)}
                    width={this.width}
                    height={this.height}
                />
            </React.Fragment>
        );
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
            });

            // Add the following relationship to the people
            // follows.forEach(follow => {
            //     const a = people[follow[0]];
            //     const b = people[follow[1]];

            //     a.following.add(b.id);
            // });

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

    private addPerson(id: number, people: People) {
        people[id] = {
            id: `${id}`,
            tags: new Set<string>()
        };

        return people[id];
    }
}

export default App;
