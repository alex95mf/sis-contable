import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { CommonService } from "../../../../../services/commonServices";
import { CommonVarService } from "../../../../../services/common-var.services";
import { VendedorService } from "../vendedor.service";
import "sweetalert2/src/sweetalert2.scss";
import Swal from 'sweetalert2';
import { Socket } from "../../../../../services/socket.service";
import * as moment from "moment";
import { CcSpinerProcesarComponent } from "../../../../../config/custom/cc-spiner-procesar.component";

@Component({
standalone: false,
  selector: "app-show-vendedor",
  templateUrl: "./show-vendedor.component.html",
  styleUrls: ["./show-vendedor.component.scss"],
})
export class ShowVendedorComponent implements OnInit {
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
    private vendedorSrv: VendedorService,
    private socket: Socket
  ) {}

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnShowVendedores",
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
    this.getTableVendedores();
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

  getTableVendedores() {
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

    this.vendedorSrv.getVendedores().subscribe(
      (res) => {
        this.validaDt = true;
        this.dataDT = res["data"];
        /* this.dataDT.forEach(element => {
          element['total'] = parseFloat(element['total']).toFixed(2);
        }); */
        setTimeout(() => {
          this.dtTrigger.next(null);
          /* this.commonVarSrvice.updPerm.next(false); */
        }, 50);
      },
      (error) => {
        this.validaDt = true;
        this.dataDT = [];
        setTimeout(() => {
          this.dtTrigger.next(null);
          /* this.commonVarSrvice.updPerm.next(false); */
        }, 50);
      }
    );
  }

  editarVendedor(dt) {
    this.commonVarSrvice.editVendedorContact.next(dt["detalle_contactos"]);
    this.commonVarSrvice.editVendedor.next(dt);
    this.closeModal();
  }

  deleteVendedor(dt) {
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
            id_vendedor: dt.id,
            ip: this.commonService.getIpAddress(),
            accion: "Eliminación de vendedor",
            id_controlador: this.module_comp,
          };
          this.vendedorSrv.deleteVendedor(data).subscribe(
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
