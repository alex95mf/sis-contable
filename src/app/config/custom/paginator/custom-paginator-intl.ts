import { MatPaginatorIntl } from "@angular/material/paginator";
import { Injectable } from "@angular/core";

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
  itemsPerPageLabel = "Registros por página: ";
  nextPageLabel = "Siguiente página";
  previousPageLabel = "Página Anterior";
  lastPageLabel = "Última página";
  firstPageLabel = "Primera página";

  getRangeLabel = function (page, pageSize, length) {
    if (length === 0 || pageSize === 0) {
      return "0 de " + length;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;

    return "Página "+(page+1)+" de "+(Math.ceil(length/pageSize));
    // return page + 1 + " - " + endIndex + " / " + length;
  };
}
