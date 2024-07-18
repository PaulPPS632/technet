import { UserInfo } from "./user-info";
import { ProductoResponse } from "./producto-response";

export interface PedidoResponse {
    id: string;
    usuario: UserInfo;
    fecha: string[];
    producto: ProductoResponse;
    estado: string;
    cantidad: number;
    nota: string;
    tenantId: string;
}
export interface PedidoRequest {
    id: string;
    id_usuario: string;
    fecha: string;
    id_producto: string;
    estado: string;
    cantidad: number;
    nota: string;
    tenantId: string;
}