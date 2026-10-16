export class MapaPuestoDTO {

  constructor(
    public nombre: string | null,
    public idSala: string | null,
    public coordenadaX: number,
    public coordenadaY: number,
    public ancho: number,
    public alto: number
  ) {}

}
