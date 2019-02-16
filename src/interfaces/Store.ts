export interface Store {
    sample(): Promise<number[][]>;
    tags(ids: number[]): Promise<string[][]>;
}
