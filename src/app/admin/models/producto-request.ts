export interface ProductoRequest {
    id: string;
    nombre: string;
    pn: string;
    descripcion: string;
    stock: number;
    precio: number;
    id_categoriamarca: number;
    id_subcategoria : number;
    garantia_cliente: number;
    garantia_total: number;
    imagen_principal: string;
    imageurl: string[];
} 