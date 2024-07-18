import { PrivilegioResponse } from "./privilegio-response";

export interface RolResponse {
    id: string;
    nombre: string;
    descripcion: string;
    privilegios: PrivilegioResponse[];
}
