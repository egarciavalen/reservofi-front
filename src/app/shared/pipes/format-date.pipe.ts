import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'formatDate',
})
export class FormatDatePipe implements PipeTransform {
  transform(value: any, ...args: any[]) {

    if (!value) {
      return '';
    }

    const fecha = new Date(value);

    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear().toString();
    
    let horas = fecha.getHours().toString();
    if (horas == "0") {
      horas = "00";
    }

    let minutos = fecha.getMinutes().toString();
    if (minutos == "0") {
      minutos = "00";
    }
    
    return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
  }
}
  

