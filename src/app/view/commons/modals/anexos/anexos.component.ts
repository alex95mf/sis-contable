import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from '../modal.service'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../../environments/environment';

@Component({
standalone: false,
  selector: 'app-anexos',
  templateUrl: './anexos.component.html',
  styleUrls: ['./anexos.component.scss']
})
export class AnexosComponent implements OnInit {
  @Input() params: any;
  dtAnexoxShow: boolean = false;
  dtanexos: Array<any> = [];
  general: any = "";
  viewer: boolean = true;
  vmButtons:any;

  constructor(public activeModal: NgbActiveModal, private toastr: ToastrService,
    private modalSrv: ModalService) { }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnGlobalAnexos", paramAccion: "", boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];
    this.getAnexos();
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "REGRESAR":
        this.closeModal();
        break;
    }
  }

  /* Commons Methods */
  showAnexo(item) {
    this.viewer = false

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

  downloadAnexo(item) {
    const url = `${environment.baseUrl}/general/download-files/?storage=${item.storage}&name=${item.name}`;
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", item.name);
    document.body.appendChild(link);
    link.click();
  }

  /* Api Calls */
  getAnexos() {
    this.modalSrv.searchAnexos(this.params).subscribe(res => {
      this.dtanexos = res['data']
      setTimeout(() => {
        this.dtAnexoxShow = true;
      }, 100);
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  /* actions modals */
  closeModal() {
    this.activeModal.dismiss();
  }
}
