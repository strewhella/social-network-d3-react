export interface Person {
    id: string;
    tags: Set<string>;
}

export interface People {
    [id: number]: Person;
}

export interface FollowRelationship {
    source: string;
    target: string;
}
