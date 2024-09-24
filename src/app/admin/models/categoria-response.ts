import { SubCategoriaResponse } from './subcategoria-response';

export interface CategoriaResponse {
  id: number;
  nombre: string;
  descripcion: string;
  subcategorias: SubCategoriaResponse[];
}
