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
    const horas = fecha.getHours().toString();
    const minutos = fecha.getMinutes().toString();

    return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
  }
}
  

