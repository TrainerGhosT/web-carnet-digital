import type { UsuarioData } from "./IUsuario";

export interface Usuario {
  Usuario: UsuarioData;
  access_token: string;
  refresh_token: string;
  usuarioID: number;
  expires_in: string;
  nombre_completo: string;
}
