import { RolResponse } from "./rol-response";

export interface UserInfo {
    id: string;
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    email: string;
    email_verified: boolean;
    locale: string;
    password: string;
    tenantId: string;
    tenantName: string;
    regist: boolean;
    tiponegocio: string;
    rol: RolResponse | null;
}