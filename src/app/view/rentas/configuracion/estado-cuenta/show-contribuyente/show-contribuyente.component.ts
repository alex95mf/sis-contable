import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { CommonService } from "../../../../../services/commonServices";
import { CommonVarService } from "../../../../../services/common-var.services";
import { EstadoCuentaService } from "../estado-cuenta.service";
import "sweetalert2/src/sweetalert2.scss";
import { Socket } from "../../../../../services/socket.service";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { CcSpinerProcesarComponent } from "src/app/config/custom/cc-spiner-procesar.component";


@Component({
  selector: "app-show-contribuyente",
  templateUrl: "./show-contribuyente.component.html",
  styleUrls: ["./show-contribuyente.component.scss"],
})
export class ShowContribuyenteComponent implements OnInit {
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  dataDT: any = [];
  validaDt: any = false;
  dataUser: any;

  empresLogo: any;
  @Input() module_comp: any;
  @Input() eliminar: any;
  @Input() editar: any;
  @Input() permissions: any;
  @Input() verifyRestore: any;
  vmButtons: any;

  paginate: any;
  filter: any;

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonService: CommonService,
    private commonVarSrvice: CommonVarService,
    private contribuyenteSrv: EstadoCuentaService,
    private socket: Socket
  ) {}

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnListConRP",
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

    this.filter = {
      razon_social: undefined,
      num_documento: undefined,
      filterControl: ""
    };

    this.paginate = {
      length: 0,
      perPage: 5,
      page: 1,
      pageSizeOptions: [5,10]
    };

    setTimeout(()=>{
      this.cargarContribuyentes();
    },0);

  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "REGRESAR":
        this.closeModal();
        break;
    }
  }

  closeModal(data?:any) {
    if(data) {
      this.commonVarSrvice.selectContribuyenteConfRen.next(data);
    }
    this.activeModal.dismiss();
  }
/*
  getTableContribuyentes() {
    this.mensajeSppiner = 'Cargando lista de contribuynetes...';
    //this.lcargando.ctlSpinner(true);
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

    this.contribuyenteSrv.getContribuyentes().subscribe(
      (res) => {
        this.validaDt = true;
        this.dataDT = res["data"];
        setTimeout(() => {
          this.dtTrigger.next();
          //this.lcargando.ctlSpinner(false);
        }, 50);
      },
      (error) => {
        this.validaDt = true;
        this.dataDT = [];
        setTimeout(() => {
          this.dtTrigger.next();
          //this.lcargando.ctlSpinner(false);
        }, 50);
      }
    );
  }
*/
  // editarContribuyente(dt) {
  //   this.commonVarSrvice.editContribuyente.next(dt);
  //   this.closeModal();
  // }

  selectOption(data) {
    this.closeModal(data);
  }

  cargarContribuyentes(){
    this.mensajeSppiner = "Cargando lista de Contribuyentes...";
    this.lcargando.ctlSpinner(true);

    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate,
      }
    }

    this.contribuyenteSrv.getContribuyentesData(data).subscribe(
      (res) => {
        this.paginate.length = res['data']['total'];
        if (res['data']['current_page'] == 1) {
          this.dataDT = res['data']['data'];
        } else {
          this.dataDT = Object.values(res['data']['data']);
        }
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  cambiarPagina(evento) {
    let nuevaPagina = {
      perPage: evento.pageSize,
      page: evento.pageIndex + 1,
    };
    Object.assign(this.paginate, nuevaPagina);
    this.cargarContribuyentes();
  }
}
