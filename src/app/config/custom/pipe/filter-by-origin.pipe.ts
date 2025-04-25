import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "filterByOrigin",
})
export class FilterByOriginPipe implements PipeTransform {
  transform(listado: any[], filtro: string): any[] {
    var tmp: any[] = [];
    if (!listado) return [];
    if (!filtro) return listado;
    listado.forEach((element) => {
      if (element.orig == filtro) {
        tmp.push(element);
      }
    });
    return tmp;
  }
}
