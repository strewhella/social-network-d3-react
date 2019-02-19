import { SimulationNodeDatum } from 'd3';

export interface TagFrequency extends SimulationNodeDatum {
    tag: string;
    count: number;
    color: string;
}
