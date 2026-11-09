export class PuestoConsultaDTO {

  constructor(
    public id: string,
    public idSala: string,
    public nombre: string,
    public coordenadaX: number,
    public coordenadaY: number,
    public ancho: number,
    public alto: number,
    public nombreSala: string,
    public rutaImagen: string
  ) {}

}
