import { UsuarioRolConsultaDTO } from "./usuario-rol-consulta.dto";

export class UsuarioConsultaDTO {

  constructor(
    public id: string,
    public nombre: string,
    public primerApellido: string,
    public segundoApellido: string,
    public correoCorporativo: string,
    public activo: boolean,
    public roles: UsuarioRolConsultaDTO[],
  ) {}

}
