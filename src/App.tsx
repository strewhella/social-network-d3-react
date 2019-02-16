import React, { Component } from 'react';
import './App.css';
import { Store } from './interfaces/Store';
import * as d3 from 'd3';
import { Person, People } from './interfaces/Person';
import { cloneDeep } from 'lodash';

declare var store: Store;

interface Props {}

interface State {
    people: People;
}

class App extends Component<Props, State> {
    private width: number;
    private height: number;
    private ref: SVGElement | null = null;

    constructor(props: {}) {
        super(props);

        this.state = {
            people: []
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
            .data(people);

        circles.exit().remove();

        const enter = circles.enter().append('circle');

        circles = enter
            .merge(circles as any)
            .attr('r', d => {
                return d.tags.size + 5;
            })
            .attr('fill', '#000000');

        // Create a force simulation that attracts circles to the center of the screen
        // but repel and collide with each other
        const simulation = d3
            .forceSimulation()
            .force(
                'center',
                d3
                    .forceCenter()
                    .x(this.width * 0.5)
                    .y(this.height * 0.5)
            )
            .force('charge', d3.forceManyBody())
            .force('collide', d3.forceCollide().radius(5));

        simulation.nodes(people).on('tick', () => {
            circles.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);
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
                <svg width={this.width} height={this.height}>
                    <g ref={r => (this.ref = r)} />
                </svg>
            </React.Fragment>
        );
    }

    private async onAdd() {
        try {
            const follows = await store.sample();

            const people = { ...this.state.people };

            // Figure out the new people
            const ids = follows.reduce((p, c) => p.concat(c), []);
            const newIds = ids.filter(id => !people[id]);

            // Fetch the tags for the new people in one go
            const newPeopleTags = await store.tags(newIds);
            // Create the new people and assign their tags
            newIds.forEach((id, i) => {
                const person = this.addPerson(id, people);
                person.tags = new Set<string>(newPeopleTags[i]);
            });

            // Add the following relationship to the people
            follows.forEach(follow => {
                const a = people[follow[0]];
                const b = people[follow[1]];

                a.following.add(b.id);
            });

            this.setState({
                people
            });
        } catch (err) {
            console.error(err);
        }
    }

    private addPerson(id: number, people: People) {
        people[id] = {
            id,
            following: new Set<number>(),
            tags: new Set<string>()
        };

        return people[id];
    }

    // Find a person by ID in the set of People, otherwise create them
    private getPerson(id: number, people: People) {
        if (!people[id]) {
            people[id] = {
                id,
                following: new Set<number>(),
                tags: new Set<string>()
            };
        } else {
            people[id] = cloneDeep(people[id]);
        }

        return people[id];
    }
}

export default App;
