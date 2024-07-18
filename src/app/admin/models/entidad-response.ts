export interface Entidad {
    id:string;
    nombre: string;
    documento: string;
    direccion: string;
    telefono: string;
    email: string;
    tipoEntidad: TipoEntidad;
}

export interface TipoEntidad{
    id:number;
    descripcion:string;
    cantdigitos:number;
}
  