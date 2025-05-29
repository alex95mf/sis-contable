import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { ConsultaService } from '../consulta.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../../services/commonServices'


@Component({
standalone: false,
  selector: 'app-modal-group',
  templateUrl: './modal-group.component.html',
  styleUrls: ['./modal-group.component.scss']
})
export class ModalGroupComponent implements OnInit {

  @Input() code: any;
  @Input() permisions: any;
  @Input() identificador: any;
  @Input() dataMod: any;
  @Input() controlador: any;
  nameGroup: any;
  claseGroup: any;
  nivelGroup: any;
  codigoGroup: any;
  codeFather: any;
  title: any;
  atfocus: any = false;

  constructor(
    public activeModal: NgbActiveModal,
    private consultaService: ConsultaService,
    private toastr: ToastrService,
    private commonServices: CommonService
  ) { }

  ngOnInit(): void {
    if (this.identificador != undefined) {
      this.modGroup();
    } else {
      this.consultMaxcodeNewGroup();
    }
  }

  modGroup() {
    this.nameGroup = this.dataMod.nombre;
    this.claseGroup = this.dataMod.clase;
    this.nivelGroup = this.dataMod.nivel;
    this.codigoGroup = this.dataMod.codigo;
    this.atfocus = true;
  }

  validaUpdate() {
    if (this.nameGroup == "") {
      this.toastr.info("Debes Ingresar un nombre de producto");
      document.getElementById("idName").focus();
    } else {
      Swal.fire({
        title: "Atención!!",
        text: "Seguro desea actualizar la información?",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: '#DC3545',
        confirmButtonColor: '#13A1EA',
        confirmButtonText: "Aceptar"
      }).then((result) => {
        if (result.value) {
          this.closeModal();
          let data = {
            id_group: this.dataMod.id_grupo,
            name: this.nameGroup.toUpperCase(),
            ip: this.commonServices.getIpAddress(),
            accion: `Actualización del grupo ${this.dataMod.nombre} se cambió a ${this.nameGroup.toUpperCase()} con codigo de grupo ${this.dataMod.codigo} `,
            id_controlador: this.controlador
          }
          this.consultaService.updateGroup(data).subscribe(res => {
            this.toastr.success(res['message']);
            this.commonServices.refreshTree.next();
          }, error => {
            this.toastr.info(error.error.message)
          })
        }
      })
    }
  }

  closeModal() {
    this.activeModal.dismiss();
  }

  consultMaxcodeNewGroup() {
    if (this.code == null) {
      this.title = " Grupo";
      let data = {
        code_father: 0
      }
      this.consultaService.getMaxCodeChildren(data).subscribe(res => {
        let cadenaSumada = parseInt(res['data'].codigo) + 1;
        this.codigoGroup = cadenaSumada.toString();
        this.claseGroup = "GRUPO";
        this.nivelGroup = 1;
        this.codeFather = 0;
        this.atfocus = true;
      }, error => {
        this.toastr.info(error.error.message);
      })
    } else {
      this.title = " Subgrupo";
      let data = {
        code_father: this.code.codigo
      }
      this.consultaService.getMaxCodeChildren(data).subscribe(res => {
        let codigo = res['data'].codigo;
        let subcadena = codigo.split(".", -1);
        let subcadenaFinal = subcadena[subcadena.length - 1];
        let cadenaSumada = parseInt(subcadenaFinal) + 1;
        this.codigoGroup = this.code.codigo + "." + cadenaSumada.toString();
        this.claseGroup = "GRUPO";
        this.nivelGroup = (parseInt(this.code.nivel) + 1).toString();
        this.codeFather = this.code.codigo;
        this.atfocus = true;
      }, error => {
        this.atfocus = true;
        this.codigoGroup = this.code.codigo + "." + "1";
        this.claseGroup = "GRUPO";
        this.nivelGroup = (parseInt(this.code.nivel) + 1).toString();
        this.codeFather = this.code.codigo;
      })
    }
  }



  validateInformation() {
    if (this.permisions.guardar == "0") {
      this.toastr.info("usted no tiene permiso para guardar");
      this.closeModal();
    } else {
      if (this.nameGroup == undefined || this.nameGroup == "") {
        this.toastr.info("Ingrese un nombre para el nuevo grupo");
      } else {
        Swal.fire({
          title: "Atención!!",
          text: "Seguro desea guardar la información?",
          icon: 'warning',
          showCancelButton: true,
          cancelButtonColor: '#DC3545',
          confirmButtonColor: '#13A1EA',
          confirmButtonText: "Aceptar"
        }).then((result) => {
          if (result.value) {
            let data = {
              nombre: (this.code == null) ? this.nameGroup.toUpperCase() : this.capitalize(this.nameGroup),
              clase: this.claseGroup,
              nivel: this.nivelGroup,
              codigo: this.codigoGroup,
              codigo_padre: this.codeFather,
              estado: "A",
              ip: this.commonServices.getIpAddress(),
              accion: `Creación del nuevo grupo ${this.nameGroup} con codigo de grupo ${this.codigoGroup} `,
              id_controlador: this.controlador
            }
            this.consultaService.saveNewGroup(data).subscribe(res => {
              this.toastr.success(res['message']);
              this.closeModal();
              this.commonServices.refreshTree.next();
            }, error => {
              this.toastr.info(error.error.message);
            })
          }
        })
      }
    }
  }

  capitalize(str) {
    let strVal = '';
    str = str.split(' ');
    for (var chr = 0; chr < str.length; chr++) {
      strVal += str[chr].substring(0, 1).toUpperCase() + str[chr].substring(1, str[chr].length) + ' '
    }
    return strVal
  }

}
