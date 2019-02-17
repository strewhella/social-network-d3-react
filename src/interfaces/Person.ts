import { SimulationNodeDatum } from 'd3';

export interface Person extends SimulationNodeDatum {
    id: number;
    tags: Set<string>;
    radius: number;
    following: Set<number>;
    followed: Set<number>;
    color: string;
}
