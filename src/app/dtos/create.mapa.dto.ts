import { List } from './../../../node_modules/mongodb/src/utils';
import { Long} from "typeorm";

export interface CreateMapaDTO {
    numberOfRows: number
    rows: List<List<number>>
    availableSeats: number
    eventoId: string
}