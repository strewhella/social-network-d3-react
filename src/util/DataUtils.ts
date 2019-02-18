import { TagFrequency } from '../interfaces/TagFrequency';
import { Person } from '../interfaces/Person';
import { People } from '../interfaces/People';
import { random } from 'lodash';

export const calculateTagFrequencies = (people: Person[]): TagFrequency[] => {
    // Calculate how often each tag occurs
    const tagDict = {};
    people.forEach(person => {
        person.tags.forEach(tag => {
            // Find existing tags ignoring case
            // since twitter handles and hashtags are case insensitive
            const existingTag = Object.keys(tagDict).find(
                t => t.toLowerCase() === tag.toLowerCase()
            );

            if (existingTag) {
                tag = existingTag;
            }

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

export const normalizeTag = (tag: string) => {
    if (tag[tag.length - 1] === ':') {
        tag = tag.substring(0, tag.length - 1);
    }

    return tag;
};
