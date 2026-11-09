export class PuestoGuardadoDTO {

  constructor(
    public id: string,
    public idSala: string,
    public nombre: string,
    public coordenadaX: number,
    public coordenadaY: number,
    public ancho: number,
    public alto: number
  ) {}

}
