import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { CommonService } from "../../../../../services/commonServices";
import { CommonVarService } from "../../../../../services/common-var.services";
import { DistribuidorService } from "../distribuidor.service";
import "sweetalert2/src/sweetalert2.scss";
import Swal from 'sweetalert2';
import { Socket } from "../../../../../services/socket.service";
import * as moment from "moment";
import { CcSpinerProcesarComponent } from "../../../../../config/custom/cc-spiner-procesar.component";

@Component({
standalone: false,
  selector: "app-show-distribuidor",
  templateUrl: "./show-distribuidor.component.html",
  styleUrls: ["./show-distribuidor.component.scss"],
})
export class ShowDistribuidorComponent implements OnInit {
  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
   dtOptions: any = {};
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
    private distribuidorSrv: DistribuidorService,
    private socket: Socket
  ) {}

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnShowDistribuidores",
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
    this.getTableDistribuidores();
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

  getTableDistribuidores() {
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 5,
      search: true,
      paging: true,
      scrollY: "200px",
      scrollCollapse: true,
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json",
      },
    };

    this.distribuidorSrv.getDistribuidores().subscribe(
      (res) => {
        this.validaDt = true;
        this.dataDT = res["data"];
        setTimeout(() => {
          this.dtTrigger.next(null);
        }, 50);
      },
      (error) => {
        this.validaDt = true;
        this.dataDT = [];
        setTimeout(() => {
          this.dtTrigger.next(null);
        }, 50);
      }
    );
  }

  editarDistribuidor(dt) {
    this.commonVarSrvice.editDistribuidor.next(dt);
    this.closeModal();
  }

  deleteDistribuidor(dt) {
    if (this.eliminar == "0") {
      this.toastr.info("usuario no tiene permiso para eliminar  registro");
    } else {
      Swal.fire({
        title: "Atención!!",
        text: "Seguro desea eliminar el registro?",
        icon: "warning",
        confirmButtonColor: "#d33",
        confirmButtonText: "Ok",
      }).then((result) => {
        if (result.value) {
          this.lcargando.ctlSpinner(true);
          let data = {
            id_distribuidor: dt.id,
            ip: this.commonService.getIpAddress(),
            accion: "Eliminación de distribuidor",
            id_controlador: this.module_comp,
          };
          this.distribuidorSrv.deleteDistribuidor(data).subscribe(
            (res) => {
              this.lcargando.ctlSpinner(false);
              this.toastr.success(res["message"]);
              this.closeModal();
            },
            (error) => {
              this.lcargando.ctlSpinner(false);
              this.toastr.info(error.error.message);
            }
          );
        }
      });
    }
  }
}
