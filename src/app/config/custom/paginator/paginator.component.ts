import { Component, Input, ViewChild, Output, EventEmitter, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { PaginatorService } from "./paginator.service";

@Component({
standalone: false,
  selector: "app-paginator",
  templateUrl: "./paginator.component.html",
  styleUrls: ["./paginator.component.css"],
})
export class PaginatorComponent implements OnInit {
  @Input() length: number;
  @Input() pageSize: number;
  @Input() showOption: any;
  @Input() dataSourceP: string;
  @Input() dataInput: any;
  @Output() refreshData: EventEmitter<any> = new EventEmitter<any>();
  manualPage = null;
  private _currentPage: number = 1;
  display = false;
  consultaQuery: any;
  setOffsetQuery: number = 10;
  maxLimit: number = 600;
  reloadData: number = 1;
  indexQuery: number = 0;
  @ViewChild(MatPaginator, { static: false }) public paginator: MatPaginator;

  public get currentPage(): number {
    return this._currentPage;
  }
  public set currentPage(value: number) {
    this._currentPage = value;
  }

  constructor(
    public dialog: MatDialog,
    private paginadorService: PaginatorService
  ) {
    this.paginadorService.missionAnnounced$.subscribe((data: any) => {
      if (data) {
        this.consultaQuery = data.tipoConsulta;
        this.reloadNewData();
      }
    });
  }

  ngOnInit(): void {
    this.currentPage = 1;
  }

  updateCurrentPage(param: any) {
    if (param) {
      this.currentPage = param;
    } else {
      this.currentPage = this.paginator.pageIndex + 1;
    }
  }

  public reloadNewData() {
    if (this.paginator._nextButtonsDisabled()) {
      if (this.paginator.getNumberOfPages() * this.paginator.pageSize < this.maxLimit) {
        let dataLoadForSend: any = {
          consulta: this.consultaQuery,
          nuevoIndex: this.paginator.length + this.setOffsetQuery,
          numeroConsulta: 0,
          banderaConsulta: true,
        };
        if (this.reloadData == 1) {
          this.refreshDataB(dataLoadForSend);
          this.reloadData = 1 + this.reloadData;
        }
      }
    } else {
      this.paginadorService.clearPageLoad();
      this.reloadData = 1;
    }
  }

  refreshDataB(say: any) {
    this.refreshData.emit(say);
  }

  public updateManualPage(index: number): void {
    var getMaxIndex = this.paginator.getNumberOfPages();
    this.manualPage = index;
    if (index <= getMaxIndex) {
      this.paginator.pageIndex = this.manualPage - 1;
      this.paginator.page.next({
        pageIndex: this.paginator.pageIndex,
        pageSize: this.paginator.pageSize,
        length: this.paginator.length,
      });
    }
  }
  public clearManualPage(): void {
    this.manualPage = null;
  }

  public setPageIndex(index: number) {
    this.paginator.pageIndex = index;
  }
  ngAfterViewInit() {}
}
