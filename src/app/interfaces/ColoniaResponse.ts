
import { Colonia } from "./Colonia";

export interface ColoniaResponse{
    totalPages: number,
    currentPage: number,
    coloniasJSON: Colonia[]
}