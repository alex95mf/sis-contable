import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import Swal from 'sweetalert2';
import { DepartamentoService } from '../departamento.service';
import { ModalAreaComponent } from '../modal-area/modal-area.component';

@Component({
standalone: false,
  selector: 'app-modal-new-upd',
  templateUrl: './modal-new-upd.component.html',
  styleUrls: ['./modal-new-upd.component.scss']
})
export class ModalNewUpdComponent implements OnInit {

  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;

  @Input() dato: any;
  @Input() validacion: any;

  vmButtons: any;

  onDestroy$: Subject<void> = new Subject();

  constructor(
    public activeModal: NgbActiveModal,
    private service: DepartamentoService,
    private commonVarSrv: CommonVarService,
    private modal: NgbModal
  ) {
    this.commonVarSrv.modalAreaDepartamento.pipe(takeUntil(this.onDestroy$)).subscribe(
    (res)=>{
      this.departamento.id_area = res.id_area
      this.departamento.are_nombre = res.are_nombre
    }
    )
  }

  ngOnDestroy() {
    this.onDestroy$.next(null);
    this.onDestroy$.complete();
  }

  departamento: any = {
    dep_nombre: null,
    dep_descripcion: null,
    dep_keyword: null,
    id_area: null,
    are_nombre: null,
    estado: 0
  }

  estado: any = [
    {valor: 'I', descripcion: 'Inactivo'},
    {valor: 'A', descripcion: 'Activo'}
  ]

  ngOnInit(): void {

    this.vmButtons = [
      {
        orig: "btnConceptoForm",
        paramAccion: "",
        boton: { icon: "fas fa-save", texto: " GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },{
        orig: "btnConceptoForm",
        paramAccion: "",
        boton: { icon: "fas fa-save", texto: " EDITAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnConceptoForm",
        paramAccion: "",
        boton: { icon: "fas fa-chevron-left", texto: " REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ];

    if(this.validacion){
      this.vmButtons[0].showimg = true;
      this.vmButtons[1].showimg = false;
    }else{
      this.vmButtons[0].showimg = false;
      this.vmButtons[1].showimg = true;
      console.log(this.dato);
      this.departamento = this.dato;
      this.departamento.are_nombre = this.dato.are?.are_nombre;
      this.departamento.id_area = this.dato.are?.id_area;
    }
  }


  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.activeModal.close();
        break;
      case " GUARDAR":
        this.guardar();
        break;
      case " EDITAR":
      this.editar();
        break;
    }
  }


  guardar(){
    this.mensajeSppiner = 'Cargar Departamento... '
    this.lcargando.ctlSpinner(true);
    this.service.setDepartamento(this.departamento).subscribe(
      (res)=>{
        Swal.fire({
          icon: "success",
          title: "Departamento Registrado",
          text: res['message'],
          showCloseButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#20A8D8',
        });
        this.lcargando.ctlSpinner(false);
        this.commonVarSrv.modalDepartamento.next(null)
        this.activeModal.close();
      }
    )
  }

  editar(){
    this.mensajeSppiner = 'Cargar Departamento... '
    this.lcargando.ctlSpinner(true);
    this.service.updatetDepartamento(this.departamento).subscribe(
      (res)=>{
        Swal.fire({
          icon: "success",
          title: "Departamento Actualizado",
          text: res['message'],
          showCloseButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#20A8D8',
        });
        this.lcargando.ctlSpinner(false);
        this.commonVarSrv.modalDepartamento.next(null)
        this.activeModal.close();

      }
    )
  }

  modalArea(){
    const modal = this.modal.open(ModalAreaComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
  }


}
