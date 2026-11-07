export class UsuarioPerfilDTO {

  constructor(
    public nombre: string,
    public primerApellido: string,
    public segundoApellido: string,
    public contrasenia: string,
    public correoCorporativo: string,
    public activo: boolean,
  ) {}

}
