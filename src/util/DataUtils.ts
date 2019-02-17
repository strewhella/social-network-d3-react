import { TagFrequency } from '../interfaces/TagFrequency';
import { Person } from '../interfaces/Person';
import { People } from '../interfaces/People';

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
    people[id] = {
        id,
        tags: new Set<string>(),
        radius: 0,
        following: new Set<number>(),
        followed: new Set<number>()
    };

    return people[id];
};

export const bound = (num: number, min: number, max: number) =>
    Math.max(min, Math.min(max - min, num));
