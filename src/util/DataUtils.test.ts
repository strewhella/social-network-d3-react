import {
    calculateTagFrequencies,
    normalizeTag,
    mergeTagFrequencies
} from './DataUtils';

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
    ],
    [
        [createPerson(['a', 'A'])],
        [{ tag: 'a', count: 2 }],
        'should ignore case and take first instance'
    ]
])('DataUtils.calculateTagFrequencies', (people, expected, desc) => {
    test(desc, () => {
        const result = calculateTagFrequencies(people);
        expect(result).toEqual(expected);
    });
});

describe.each([
    ['@TechCrunch', '@TechCrunch', 'should leave valid tags alone'],
    ['@TechCrunch:', '@TechCrunch', 'should trim trailing colon'],
    ['@Tech:Crunch', '@Tech:Crunch', 'should ignore embedded colon']
])('DataUtils.normalizeTag', (input, expected, desc) => {
    test(desc, () => {
        expect(normalizeTag(input)).toEqual(expected);
    });
});

describe.each([
    [
        [{ tag: '1', count: 1 }],
        [{ tag: '1', count: 2 }],
        [{ tag: '1', count: 3 }],
        'should add same tag'
    ],
    [
        [{ tag: '1', count: 1 }],
        [{ tag: '2', count: 2 }],
        [{ tag: '1', count: 1 }, { tag: '2', count: 2 }],
        'should not add different tags'
    ]
])('DataUtils.mergeTagFrequencies', (first, second, expected, desc) => {
    test(desc, () => {
        expect(mergeTagFrequencies(first, second)).toEqual(expected);
    });
});
