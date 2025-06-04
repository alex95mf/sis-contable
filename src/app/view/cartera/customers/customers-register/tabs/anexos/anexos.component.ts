
import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, NgZone, Input } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import { CustomersRegisterService } from '../../customers-register.service';
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import { CommonService } from "../../../../../../services/commonServices";
import { environment } from '../../../../../../../environments/environment';
import * as myVarGlobals from '../../../../../../global';
import { IngresoService } from "../../../../../inventario/producto/ingreso/ingreso.service";
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';

declare const $: any;

@Component({
standalone: false,
  selector: 'app-anexos-customer',
  templateUrl: './anexos.component.html',
  styleUrls: ['./anexos.component.scss']
})
export class AnexosComponent implements OnInit {
  RegExp: RegExpConstructor;
  @ViewChild(DataTableDirective)
  input: ElementRef;
  dtElement: DataTableDirective;
  @Input() ext: any;
  // dtOptions: any = {};
  dtOptions: any = {};
  dtTrigger = new Subject();
  validaDtUser: any = false;
  guardaT: any = [];
  permisions: any;
  dataUser: any;
  desDocument: any;
  filesSelect: FileList;
  uri: string = environment.baseUrl;
  generalDocument: any = "";
  nombre: any = "";
  viewDelete: any = [];
  prueba = "1"; //prueba guardar Document
  dAction: any = false;
  extension: any = "";
  dtAnexoxShow: boolean = false; //view table anexos



  constructor(private customerServicio: CustomersRegisterService, private toastr: ToastrService, private router: Router, private zone: NgZone, private commonServices: CommonService,
    private ingresoSrv: IngresoService) {

    this.commonServices.actionsClient.asObservable().subscribe(res => {

      if (res.new) {
        this.dAction = true;
      } else if (res.cancel) {
        this.dAction = false;
        this.dtAnexoxShow = false;
        this.limpiar();
        this.guardaT = [];
      }
    });
    this.commonServices.actionsSearchClient.asObservable().subscribe(res => {
      //this.showDataTableClientes(res['anexos']);
      if (res['anexos'] == "" || res['anexos'] == undefined) {
        //this.toastr.info("Anexo no existe");
      } else if (res['anexos']) {
        this.showDataTableClientes(res['anexos']);
      }

    });
    this.commonServices.anexosClient.asObservable().subscribe(res => {
      let data = {
        anexos_delete: this.viewDelete,
      }
    this.commonServices.resAnexosClient.next(data);
    })
    this.commonServices.saveClientes.asObservable().subscribe(res => {
      if (this.filesSelect !== undefined) {
        res['description'] = (this.desDocument !== undefined) ? this.desDocument : "";
        res['module'] = this.permisions[0].id_modulo;
        res['component'] = myVarGlobals.fCliente;
        res['identifier'] = res.identifier;
        res['id_controlador'] = myVarGlobals.fCliente;
        res['accion'] = `Ingreso/Actualización de anexos proveedor ${res.identifier}`;
        res['ip'] = this.commonServices.getIpAddress();
        this.UploadFile(res);
      }
    });
  }

  ngOnInit() {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    let id_rol = this.dataUser.id_rol;
    let data = {
      codigo: myVarGlobals.fCliente,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'];
    })
  }

  showDataTableClientes(params) {
    if (params.length > 0) {
      this.dtAnexoxShow = true;
      this.guardaT = params;
    }
  }

  subiendoando(files) {
    this.filesSelect = undefined;
    if (files.length > 0) {
      this.filesSelect = files;
      setTimeout(() => {
        this.toastr.success("Ha seleccionado " +files.length+ " archivos" );
      }, 10);
    }
  }

  UploadFile(payload?: any): void {
    for (let i = 0; i < this.filesSelect.length; i++) {
      this.UploadService(this.filesSelect[i], payload);
    }
  }

  UploadService(file, payload?: any): void {
    this.ingresoSrv.fileService(file, payload).subscribe(res => {
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  AnexoDownload(item) {

    let datos: any = {
      storage: item.storage,
      name: item.name,
    };
    this.lcargando.ctlSpinner(true);
    this.customerServicio.descargar(datos).subscribe((resultado) => {
        this.lcargando.ctlSpinner(false);

        const url = URL.createObjectURL(resultado);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", item.name);
        document.body.appendChild(link);
        link.click();

        this.toastr.success("Se ha descargado Autamaticamente");
      }, (error) => {
        this.toastr.info(error.message);
        this.lcargando.ctlSpinner(false);
      }
    );


  }

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  AnexoView(item) {
    console.log("probando")
    $('#bd-example-modal-lg').appendTo("body").modal('show');

    this.generalDocument = "";
    this.nombre  = "";
    this.extension = item.original_extension;
    if (this.extension == '.docx' || this.extension == '.doc' || this.extension == '.xlsx' || this.extension == '.xls' || this.extension == '.pptx') {
      this.generalDocument = "assets/img/vista.png";
      this.nombre = item.name;
        let datos: any = {
          storage: item.storage,
          name: this.nombre,
        };
        this.lcargando.ctlSpinner(true);
        this.customerServicio.descargar(datos).subscribe((resultado) => {
            this.lcargando.ctlSpinner(false);
            const url = URL.createObjectURL(resultado);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", item.name);
            document.body.appendChild(link);
            link.click();
            this.toastr.success("Se ha descargado Autamaticamente");
          }, (error) => {
            this.toastr.info(error.message);
            this.lcargando.ctlSpinner(false);
          }
        );

      } else {
      this.nombre = item.name;

      let datos: any = {
        storage: item.storage,
        name: this.nombre,
      };
      console.log("this.generalDocument: ", datos)
      this.lcargando.ctlSpinner(true);
      this.customerServicio.descargar(datos).subscribe((resultado) => {
          this.lcargando.ctlSpinner(false);
          this.generalDocument = URL.createObjectURL(resultado);
        }, (error) => {
          this.toastr.info(error.message);
          this.lcargando.ctlSpinner(false);
        }
      );
    }
  }

  cerrarmodal(){
    this.generalDocument = "";
    this.nombre  = "";
  }

  AnexoDelete(item, pos) {
    this.viewDelete.push(item);
    this.guardaT.splice(pos, 1);
  }

  limpiar() {
    this.desDocument = "";
  }

}
