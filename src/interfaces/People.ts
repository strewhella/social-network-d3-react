import { Person } from './Person';

export interface People {
    [id: number]: Person;
    list?: Person[];
}
