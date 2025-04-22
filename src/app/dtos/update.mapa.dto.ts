import { List } from './../../../node_modules/mongodb/src/utils';

export interface UpdateMapaDTO {
    id: string;
    rows: List<List<number>>
    availableSeats: number;
}