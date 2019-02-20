import React, { Component } from 'react';
import { Store } from '../interfaces/Store';
import { uniq, cloneDeep } from 'lodash';
import { Interface } from './Interface';
import { Point } from '../interfaces/Point';
import { SocialNetwork } from './SocialNetwork';
import { People } from '../interfaces/People';
import { FollowRelationship } from '../interfaces/FollowRelationship';
import {
    addPerson,
    normalizeTag,
    calculateTagFrequencies,
    mergeTagFrequencies
} from '../util/DataUtils';
import { WordCloud } from './WordCloud';
import { Person } from '../interfaces/Person';
import { TagFrequency } from '../interfaces/TagFrequency';

declare var store: Store;

interface State {
    people: People;
    follows: FollowRelationship[];
    width: number;
    height: number;
    center: Point;
    hoveringPerson?: Person;
    tagFrequencies: TagFrequency[];
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
            center,
            tagFrequencies: []
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
            people,
            tagFrequencies
        } = this.state;

        return (
            <React.Fragment>
                <WordCloud
                    width={width}
                    height={height}
                    center={center}
                    hoverPerson={hoveringPerson}
                    tagFrequencies={tagFrequencies}
                />
                <SocialNetwork
                    people={people.list || []}
                    follows={follows}
                    width={width}
                    height={height}
                    center={center}
                    onHover={this.onHoverPerson}
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
            const newPeople = newIds.map((id, i) => {
                const person = addPerson(id, people);
                person.tags = new Set<string>(
                    newPeopleTags[i].map(normalizeTag)
                );
                person.radius = person.tags.size * 0.3 + 4;
                return person;
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

            const newTagFrequencies = calculateTagFrequencies(newPeople);
            const tagFrequencies = mergeTagFrequencies(
                this.state.tagFrequencies,
                newTagFrequencies
            );

            this.setState({
                people,
                tagFrequencies,
                follows: this.state.follows.concat(
                    follows.map(follow => {
                        return {
                            source: follow[0] as any,
                            target: follow[1] as any
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
            follows: [],
            tagFrequencies: []
        });
    }
}

export default App;
