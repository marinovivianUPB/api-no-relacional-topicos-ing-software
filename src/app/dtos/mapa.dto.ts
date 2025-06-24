export interface MapaDTO {
    id: string;
    numberOfRows: number
    rows: Array<Array<number>>
    availableSeats: number
    original: boolean
}