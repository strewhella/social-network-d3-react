export interface Person {
    id: number;
    following: Set<number>;
    tags: Set<string>;
}

export interface People {
    [id: number]: Person;
}
