
import { UserInfo } from "./user-info";
import { Entidad } from "./entidad-response";
import { TipoCondicion, TipoMoneda, TipoPago } from "./tipado-documentos";

export interface RegistrarVentaRequest {
    prefijo: string;
    numeracion: number;
    documento_cliente: string;
    usuario_id: string;
    id_tipocondicion: number;
    id_tipopago: number;
    id_tipomoneda: number;
    tipo_cambio: number;
    fecha_emision?: string;
    fecha_vencimiento?: string;
    nota: string;
    gravada: number;
    impuesto: number;
    total: number;
    fechapago?: string;
    formapago: string;
    detalles: DetalleVentaRequest[];
  }
  
  export interface DetalleVentaRequest {
    id_producto?: string;
    nombre: string;
    cantidad: number;
    series: string[];
    precio_unitario: number;
    precio_total: number;
  }

export interface VentaResponse {
    id: string;
    correlativo: CorrelativoResponse;
    cliente: Entidad;
    usuario: UserInfo;
    tipocondicion: TipoCondicion;
    tipopago: TipoPago;
    tipomoneda: TipoMoneda;
    tipo_cambio: number;
    fecha_emision: string[];
    fecha_vencimiento: string[];
    nota: string;
    gravada: number;
    impuesto: number;
    total: number;
    fechapago: string[];
    formapago: string;
}
export interface CorrelativoResponse{
    prefijo: string;
    numeracion: number;
    correlativo: number;
    documento: string;
}