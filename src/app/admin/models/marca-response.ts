import { CategoriaMarcaResponse } from "./categoriamarca-response";

export interface MarcaResponse {
    id: number;
    nombre: string;
    categorias: CategoriaMarcaResponse[];
}