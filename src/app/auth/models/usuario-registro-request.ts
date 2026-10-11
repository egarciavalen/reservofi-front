export class UsuarioRegistroRequestDTO {

  constructor(
    public nombre: string,
    public primerApellido: string,
    public segundoApellido: string,
    public correoCorporativo: string,
    public contrasenia: string,
    public activo: boolean
  ) {}

}
