import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { CommonService } from "../../../../../services/commonServices";
import { CommonVarService } from "../../../../../services/common-var.services";
import { ConceptoService } from "../concepto.service";
import Swal from "sweetalert2/dist/sweetalert2";
import * as moment from "moment";
import { CcSpinerProcesarComponent } from "../../../../../config/custom/cc-spiner-procesar.component";

@Component({
standalone: false,
  selector: "app-show-concepto",
  templateUrl: "./show-concepto.component.html",
  styleUrls: ["./show-concepto.component.scss"],
})
export class ShowConceptoComponent implements OnInit {
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtInstance: Promise<any>;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  dataDT: any = [];
  validaDt: any = false;
  dataUser: any;

  empresLogo: any;
  @Input() module_comp: any;
  @Input() eliminar: any;
  @Input() editar: any;
  vmButtons: any;

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonService: CommonService,
    private commonVarSrvice: CommonVarService,
    private conceptoSrv: ConceptoService,
  ) {}

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnShowConceptos",
        paramAccion: "",
        boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      },
    ];
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.getTableConceptos();
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "REGRESAR":
        this.closeModal();
        break;
    }
  }

  closeModal() {
    this.activeModal.dismiss();
  }

  getTableConceptos() {
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      search: true,
      paging: true,
      scrollY: "500px",
      scrollCollapse: true,
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json",
      },
    };

    //this.lcargando.ctlSpinner(true);
    this.conceptoSrv.getConceptos().subscribe(
      (res) => {
        this.validaDt = true;
        this.dataDT = res["data"];
        //this.lcargando.ctlSpinner(false);
        setTimeout(() => {
          this.dtTrigger.next(null);
        }, 50);
      },
      (error) => {
        this.validaDt = true;
        this.dataDT = [];
        //this.lcargando.ctlSpinner(false);
        setTimeout(() => {
          this.dtTrigger.next(null);
        }, 50);
      }
    );
  }

  editarConcepto(dt) {
    this.commonVarSrvice.editConcepto.next(dt);
    this.closeModal();
  }

  deleteConcepto(dt, index) {
    if (this.eliminar == "0") {
      this.toastr.info("Usuario no tiene permiso para eliminar registro");
    } else {
      Swal.fire({
        title: "Atención!!",
        text: "Seguro desea eliminar el registro?",
        icon: "warning",
        confirmButtonColor: "#d33",
        confirmButtonText: "Ok",
      }).then((result) => {
        if (result.value) {
          //this.lcargando.ctlSpinner(true);
          let data = {
            id_concepto: dt.id_concepto,
            ip: this.commonService.getIpAddress(),
            accion: "Eliminación de concepto",
            id_controlador: this.module_comp,
          };
          this.conceptoSrv.deleteConcepto(data).subscribe(
            (res) => {
              this.dataDT.splice(index, 1);
              this.rerender();
              //this.lcargando.ctlSpinner(false);
              //this.toastr.success(res["message"]);
              Swal.fire({
                title: "Operación exitosa",
                text: res["message"],
                type: "success",
              })
            },
            (error) => {
              //this.lcargando.ctlSpinner(false);
              //this.toastr.info(error.error.message);
              Swal.fire({
                title: "¡Error!",
                text: error.error.message,
                icon: "warning",
              })
            }
          );
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: any) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next(null);
    });
  }

}
