import React, { Component } from 'react';
import { Store } from '../interfaces/Store';
import { uniq } from 'lodash';
import { Interface } from './Interface';
import { Point } from '../interfaces/Point';
import { SocialNetwork } from './SocialNetwork';
import { People } from '../interfaces/People';
import { FollowRelationship } from '../interfaces/FollowRelationship';
import { addPerson } from '../util/DataUtils';
import { WordCloud } from './WordCloud';
import { Person } from '../interfaces/Person';

declare var store: Store;

interface State {
    people: People;
    follows: FollowRelationship[];
    width: number;
    height: number;
    center: Point;
    hoveringPerson?: Person;
}

class App extends Component<{}, State> {
    constructor(props: {}) {
        super(props);

        const width = window.innerWidth;
        const height = window.innerHeight;
        const center = { x: width / 2, y: height / 2 };

        this.state = {
            people: {},
            follows: [],
            width,
            height,
            center
        };

        this.onAdd = this.onAdd.bind(this);
        this.onClear = this.onClear.bind(this);
        this.onResize = this.onResize.bind(this);
        this.onHoverPerson = this.onHoverPerson.bind(this);
    }

    public componentDidMount() {
        this.onAdd();

        window.addEventListener('resize', this.onResize);
    }

    public componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
    }

    public render() {
        const {
            width,
            height,
            follows,
            center,
            hoveringPerson,
            people
        } = this.state;

        return (
            <React.Fragment>
                <WordCloud
                    width={width}
                    height={height}
                    center={center}
                    people={people.list || []}
                    hoverPerson={hoveringPerson}
                />
                <SocialNetwork
                    people={people.list || []}
                    follows={follows}
                    width={width}
                    height={height}
                    center={center}
                    onHover={this.onHoverPerson}
                    // hoveringPerson={hoveringPerson}
                />
                <Interface onAdd={this.onAdd} onClear={this.onClear} />
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
                const person = addPerson(id, people);
                person.tags = new Set<string>(newPeopleTags[i]);
                person.radius = person.tags.size * 0.3 + 4;
            });

            people.list = Object.keys(people)
                .filter(k => k !== 'list')
                .map(id => people[id]);

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

    private onHoverPerson(id: number) {
        const { people } = this.state;

        this.setState({
            hoveringPerson: people[id]
        });
    }

    private onClear() {
        this.setState({
            people: {},
            follows: []
        });
    }
}

export default App;
