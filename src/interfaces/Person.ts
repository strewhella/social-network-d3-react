import { SimulationNodeDatum } from 'd3';

export interface Person extends SimulationNodeDatum {
    id: number;
    tags: Set<string>;
    radius: number;
    following: Set<number>;
    followed: Set<number>;
}

export interface People {
    [id: number]: Person;
}

export interface FollowRelationship {
    source: number;
    target: number;
}
