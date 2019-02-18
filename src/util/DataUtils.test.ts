import { calculateTagFrequencies } from './DataUtils';

const createPerson = (tags: string[]) => {
    return {
        tags: new Set(tags)
    };
};

describe.each([
    [
        [createPerson(['1'])],
        [{ tag: '1', count: 1 }],
        'should count single tag with single person'
    ],
    [
        [createPerson(['1', '2'])],
        [{ tag: '1', count: 1 }, { tag: '2', count: 1 }],
        'should count distinct tags in single person'
    ],
    [
        [createPerson(['1']), createPerson(['1'])],
        [{ tag: '1', count: 2 }],
        'should count same tag across people'
    ],
    [
        [createPerson(['1']), createPerson(['2'])],
        [{ tag: '1', count: 1 }, { tag: '2', count: 1 }],
        'should count different tags across people'
    ],
    [
        [createPerson(['1', '2']), createPerson(['2', '1'])],
        [{ tag: '1', count: 2 }, { tag: '2', count: 2 }],
        'should count multiple same tags across people'
    ]
])('DataUtils.calculateTagFrequencies', (people, expected, desc) => {
    test(desc, () => {
        const result = calculateTagFrequencies(people);
        expect(result).toEqual(expected);
    });
});
