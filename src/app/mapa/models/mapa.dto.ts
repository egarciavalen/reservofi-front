import { SalaDTO } from "../../sala/models/sala.dto";

export class MapaDTO {

  constructor(
    public idSala: string | null,
    public rutaImagenSala: string | null
  ) {}

}
