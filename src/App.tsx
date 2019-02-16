import React, { Component } from 'react';
import './App.css';
import { Store } from './interfaces/Store';
import * as d3 from 'd3';
import { Person, People, FollowRelationship } from './interfaces/Person';
import { uniq } from 'lodash';
import { Menu } from './Menu';
import { Point } from './interfaces/Point';
import { SocialNetwork } from './SocialNetwork';

declare var store: Store;

interface State {
    people: People;
    follows: FollowRelationship[];
    width: number;
    height: number;
    center: Point;
}

class App extends Component<{}, State> {
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
        const { width, height, follows, center } = this.state;

        const people = Object.keys(this.state.people).map(
            id => this.state.people[id]
        );

        return (
            <React.Fragment>
                <Menu onAdd={this.onAdd} onClear={this.onClear} />
                <SocialNetwork
                    people={people}
                    follows={follows}
                    width={width}
                    height={height}
                    center={center}
                />
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
                            source: follow[0],
                            target: follow[1]
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
            id,
            tags: new Set<string>(),
            radius: 0,
            following: new Set<number>(),
            followed: new Set<number>()
        };

        return people[id];
    }
}

export default App;
