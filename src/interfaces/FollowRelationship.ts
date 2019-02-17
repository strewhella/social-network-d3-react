import { SimulationLinkDatum } from 'd3';
import { Person } from './Person';

export interface FollowRelationship extends SimulationLinkDatum<Person> {
    source: number | Person;
    target: number | Person;
}
