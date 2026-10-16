export class MapaPuestoDTO {

  constructor(
    public nombre: string | undefined,
    public idSala: string | undefined,
    public coordenadaX: number,
    public coordenadaY: number,
    public ancho: number,
    public alto: number
  ) {}

}
