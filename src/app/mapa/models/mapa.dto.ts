import { SalaDTO } from "../../sala/models/sala.dto";

export class MapaDTO {

  constructor(
    public salaDTO: SalaDTO | null,
    public rutaImagenSala: string | null
  ) {}

}
