export interface TipoComprobante {
    id: number;
    prefijo: string;
    descripcion: string;
}
  
export interface TipoCondicion {
    id: number;
    nombre: string;
    diascredito: number;
    descripcion: string;
}
  
export interface TipoPago {
    id:number;
    nombre: string;
    descripcion: string;
}
  
export interface TipoMoneda {
    id: number;
    nombre: string;
}

export interface TipadoDocumentos {
    tipocomprobantes: TipoComprobante[];
    tipocondiciones: TipoCondicion[];
    tipopagos: TipoPago[];
    tipomonedas: TipoMoneda[];
}