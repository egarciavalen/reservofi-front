export class UsuarioDTO {

  constructor(
    public id: string,
    public nombre: string,
    public primerApellido: string,
    public segundoApellido: string,
    public correoCorporativo: string,
    public activo: boolean,
    public idsRoles: string[],
  ) {}

}
