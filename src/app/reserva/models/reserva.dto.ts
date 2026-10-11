export class ReservaDTO {

  constructor(
    public id: string,
    public idUsuario: string,
    public idPuesto: string,
    public fechaInicio: string,
    public fechaFin: string
  ) {}

}
