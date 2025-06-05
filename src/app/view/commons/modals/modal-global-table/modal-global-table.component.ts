import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { DataTableDirective } from "angular-datatables";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { CcSpinerProcesarComponent } from "src/app/config/custom/cc-spiner-procesar.component";
import { DatatableLanguage } from "src/app/models/es-ES";
import { JornadaNominaResponseI } from "src/app/models/responseJornada.interface";
import { PersonalResponseI } from "src/app/models/responsePersonal.interface";
import { CommonVarService } from "src/app/services/common-var.services";
import { CommonService } from "src/app/services/commonServices";
import { GeneralService } from "src/app/services/general.service";
import { ModalService } from "../modal.service";

@Component({
standalone: false,
  selector: "app-modal-global-table",
  templateUrl: "./modal-global-table.component.html",
  styleUrls: ["./modal-global-table.component.scss"],
})
export class ModalGlobalTableComponent implements OnInit {
  
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
   dtOptions: any = {};
  dtTrigger = new Subject();
  @Input() title: any;
  @Input() periodo_id: any;
  @Input() module: any;
  @Input() component: any;
  @Input() documento_id: any;
  dataDT: any = [];

  dataDTPersonal: PersonalResponseI;
  dataDTJornada: JornadaNominaResponseI;

  validaDt: any = false;
  dataUser: any;
  nameUser: any;
  permissions: any;
  prefict: any;
  latestStatus: any;
  vmButtons: any;

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: ModalService,
    private toastr: ToastrService,
    private commonService: CommonService,
    private commonVarSrvice: CommonVarService,
    private generalService: GeneralService
  ) {}

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnGlobal",
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

    this.getDataTableGlobals();
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "REGRESAR":
        this.closeModal();
        break;
    }
  }

  getDataTableGlobals() {
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      search: true,
      paging: true,
      scrollY: "200px",
      scrollCollapse: true,
      order:[[1, 'desc']] ,
      language: DatatableLanguage.datatableSpanish,
      // language: {
      //   url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json",
      // },
    };

    let data = {
      module: this.module,
      component: this.component,
    };
    let parameter_periodo_id = this.periodo_id;
    console.log(parameter_periodo_id)
    if (this.title == "PERSONAL") {
      // this.modalService.searchProviders(data).subscribe(
      this.generalService.getPersonal(parameter_periodo_id).subscribe(
        (res: PersonalResponseI) => {
          console.log(res);
          this.validaDt = true;
          // this.dataDT = res["data"];
          this.dataDTPersonal = res;
          setTimeout(() => {
            this.dtTrigger.next(null);
            this.commonVarSrvice.updPerm.next(false);
          }, 50);
        },
        (error) => {
          this.validaDt = true;
          this.dataDT = [];
          this.commonVarSrvice.updPerm.next(false);
          setTimeout(() => {
            this.dtTrigger.next(null);
          }, 50);
        }
      );
    } else if (this.title == "JORNADA") {
      this.generalService.getJornadas().subscribe(
        (res: JornadaNominaResponseI) => {
          console.log(res);
          this.validaDt = true;
          // this.dataDT = res["data"];
         // res.estado? res.estado:[];
          this.dataDTJornada = res;
          setTimeout(() => {
            this.dtTrigger.next(null);
            this.commonVarSrvice.updPerm.next(false);
          }, 50);
        },
        (error) => {
          this.validaDt = true;
          this.dataDT = [];
          this.commonVarSrvice.updPerm.next(false);
          setTimeout(() => {
            this.dtTrigger.next(null);
          }, 50);
        }
      );
    }
  }

  closeModal() {
    this.activeModal.dismiss();
  }

  setDataModalproviders(data) {
    //console.log(providers);
    this.commonVarSrvice.setPersonalNom.next(data);
    this.closeModal();
  }


  setDataModalJornadaproviders(data) {
    //console.log(providers);
    this.commonVarSrvice.setJornadaNom.next(data);
    this.closeModal();
  }
}
