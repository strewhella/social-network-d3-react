import { TagFrequency } from '../interfaces/TagFrequency';
import { Person } from '../interfaces/Person';
import { People } from '../interfaces/People';
import { random } from 'lodash';

export const calculateTagFrequencies = (people: Person[]): TagFrequency[] => {
    // Calculate how often each tag occurs
    const tagDict = {};
    people.forEach(person => {
        person.tags.forEach(tag => {
            tag = tag.replace(new RegExp(':', 'g'), '');

            if (!tagDict[tag]) {
                tagDict[tag] = 0;
            }

            tagDict[tag]++;
        });
    });

    return Object.keys(tagDict).map(tag => ({
        tag,
        count: tagDict[tag]
    }));
};

export const addPerson = (id: number, people: People) => {
    const r = random(0, 255);
    const g = random(0, 255);
    const b = random(0, 255);
    const color = `rgb(${r},${g},${b})`;

    people[id] = {
        id,
        tags: new Set<string>(),
        radius: 0,
        following: new Set<number>(),
        followed: new Set<number>(),
        color
    };

    return people[id];
};

export const bound = (num: number, min: number, max: number) =>
    Math.max(min, Math.min(max - min, num));
