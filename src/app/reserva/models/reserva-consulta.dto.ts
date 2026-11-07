export class ReservaConsultaDTO {

  constructor(
    public id: string,
    public idUsuario: string,
    public idPuesto: string,
    public fechaInicio: string,
    public fechaFin: string,
    public nombrePuesto: string,
    public nombreSala: string,
    public rutaImagen: string
  ) {}

}
