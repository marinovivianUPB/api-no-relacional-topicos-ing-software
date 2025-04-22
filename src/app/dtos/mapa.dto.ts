import { List } from './../../../node_modules/mongodb/src/utils';

export interface MapaDTO {
    id: string;
    numberOfRows: number
    rows: List<List<number>>
    availableSeats: number
    original: boolean
}