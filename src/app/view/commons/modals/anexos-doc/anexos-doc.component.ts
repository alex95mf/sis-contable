import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from '../modal.service'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../../environments/environment';
import { CommonVarService } from '../../../../services/common-var.services'
import { CommonService } from '../../../../services/commonServices'
import 'sweetalert2/src/sweetalert2.scss';
const Swal = require('sweetalert2');
import { FileUploader } from "ng2-file-upload";
import { ConfirmationDialogService } from "../../../../config/custom/confirmation-dialog/confirmation-dialog.service";


@Component({
standalone: false,
  selector: 'app-anexos-doc',
  templateUrl: './anexos-doc.component.html',
  styleUrls: ['./anexos-doc.component.scss']
})
export class AnexosDocComponent implements OnInit {
  @Input() params: any;
  dtAnexoxShow: boolean = false;
  dtanexos: Array<any> = [];
  general: any = "";
  viewer: boolean = true;
  docSelect: any;
  vmButtons: any;
  generalDocument: any = "assets/img/vista.png";
  filesSelect: any;
  itemSeleccionado: any = undefined;

  /**ARCHIVOS */
  public uploader: FileUploader = new FileUploader(null);
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;
  lArchivo: any;
  fileItem: any;
  isSucc: boolean = false;
  dataUser: any;


  constructor(public activeModal: NgbActiveModal, private toastr: ToastrService,
    private modalSrv: ModalService, private commonVarService: CommonVarService,
    private confirmationDialogService: ConfirmationDialogService,
    private commoSrv: CommonService) { }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "GUARDAR ARCHIVOS":
        this.addDoc();
        break;
      case "CANCELAR":
        this.closeModal();
        break;
    }
  }

  ngOnInit(): void {

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    setTimeout(() => {
      this.commonVarService.updPerm.next(true);
    }, 50);

    this.vmButtons = [
      { orig: "btnCloseAnexo", paramAccion: "", boton: { icon: "far fa-save", texto: "GUARDAR ARCHIVOS" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnCloseAnexo", paramAccion: "", boton: { icon: "far fa-window-close", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];
    setTimeout(() => {
      this.commonVarService.updPerm.next(false);
    }, 1000);
    /* this.getAnexos(); */
  }

  changeSelec() {
    if (this.uploader.queue.length > 0) {
      for (let j = 0; j < this.uploader.queue.length; j++) {
        this.fileItem = this.uploader.queue[j]._file;
        if (this.fileItem.type === "image/jpeg" || this.fileItem.type === "image/jpg" || this.fileItem.type === "image/bmp" || this.fileItem.type === "image/png"
          || this.fileItem.type === "image/gif" || this.fileItem.type === "image/tif" ||
          this.fileItem.type === "application/pdf"
          || this.fileItem.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          || this.fileItem.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          || this.fileItem.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
          || this.fileItem.type === "application/msword"
        ) {
          this.isSucc = true;
        } else {
          this.uploader.queue[j].isError = true;
          this.uploader.queue.splice(j, 1);
        }
      }
    }
    this.lArchivo = null;
  }

  abrirVistaArchivo(valor: any) {
    console.log(valor)
    const blob = new Blob([valor.file.rawFile], { type: valor.file.type });
    console.log(blob)
    setTimeout(() => {
      const objectUrl: string = URL.createObjectURL(blob);
      this.generalDocument = objectUrl;
      if (valor.file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        || valor.file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        || valor.file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        || valor.file.type === "application/msword"
      ) {
        this.closeModal();
      }
    }, 100);
  }



  public fileOverBase(e: any): void {
    if (this.uploader.queue.length > 0) {
      this.hasBaseDropZoneOver = e;
      this.changeSelec();
    }
  }

  addDoc() {
    if (this.uploader.queue.length > 0 ) {
    /* if (this.docSelect != undefined) { */
      /* this.commonVarService.setDocOrder.next(this.docSelect); */
      this.commonVarService.setDocOrder.next(this.uploader.queue);
      this.closeModal();
    } else {
      this.confirmAction();
    }
  }

  async confirmAction() {
    Swal.fire({
      title: "Atención!!",
      text: "Seguro no desea seleccionar un documento?",
      type: 'error',
      showCancelButton: true,
      cancelButtonColor: '#DC3545',
      confirmButtonColor: '#13A1EA',
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.value) {
        this.closeModal();
      }
    })
  }

  remover() {
    if (this.uploader.queue.length === 0) {
      this.isSucc = false;
    } else {
      for (let j = 0; j < this.uploader.queue.length; j++) {
        if (this.uploader.queue[j].isSuccess === true) {
          this.isSucc = false;
        }
      }
    }
  }



  eliminarArchivoExistente(valor: any) {
    Swal.fire({
      title: "Atención!!",
      text: "¿Esta seguro de realizar esta accion?",
      type: "warning",
      showCancelButton: true,
      cancelButtonColor: "#DC3545",
      confirmButtonColor: "#13A1EA",
      confirmButtonText: "Aceptar",
    }).then((result) => {
      if (result.value) {
        valor.ip = this.commoSrv.getIpAddress();
        valor.accion = `Eliminacion del archivo adjunto ${valor.original_name}, del documento con id ${valor.identifier} del centro de costo`;
        valor.id_controlador = this.params.component;
        /* this.centroCostoSrv.eliminarArchivo(valor).subscribe(datos=>{
          this.commonVarService.updPerm.next(false);
          this.toastr.success("El archivo se elimino correctamente");
          this.recargar();
        }, error=>{
          this.commonVarService.updPerm.next(false);
          this.toastr.info("Error inesperado, no hubo conexion con el servidor")
        }); */
      }
    });
  }





























  subiendoando(files) {
    this.filesSelect = undefined;
    if (files.length > 0) {
      this.filesSelect = files[0];
      this.generalDocument = URL.createObjectURL(this.filesSelect);
    }
  }


  /* Commons Methods */
  showAnexo(item) {
    this.viewer = false
    this.docSelect = item;

    setTimeout(() => {
      if (item.original_extension == '.pdf'
        || item.original_extension == '.png'
        || item.original_extension == '.jpg'
        || item.original_extension == '.jpeg') {
        this.general = `${environment.baseUrl}/storage${item.location}`;
      } else {
        this.general = "assets/img/vista.png";
      }
      this.viewer = true
    }, 1000);
  }

  downloadAnexo() {
    const url = `${environment.baseUrl}/general/download-files/?storage=${this.docSelect.storage}&name=${this.docSelect.name}`;
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", this.docSelect.name);
    document.body.appendChild(link);
    link.click();
  }

  /* Api Calls */
  getAnexos() {
    this.modalSrv.searchAnexosFilter(this.params).subscribe(res => {
      this.dtanexos = res['data']
      setTimeout(() => {
        this.dtAnexoxShow = true;
      }, 100);
      this.commonVarService.updPerm.next(false);
    }, error => {
      this.commonVarService.updPerm.next(false);
      this.toastr.info(error.error.message);
    })
  }

  /* actions modals */
  closeModal() {
    this.activeModal.dismiss();
  }

 

}
