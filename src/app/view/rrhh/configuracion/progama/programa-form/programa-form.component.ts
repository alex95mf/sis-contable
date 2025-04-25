import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { ProgamaService } from '../progama.service';

@Component({
  selector: 'app-programa-form',
  templateUrl: './programa-form.component.html',
  styleUrls: ['./programa-form.component.scss']
})
export class ProgramaFormComponent implements OnInit {

  msgSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  dataUser: any;

  @Input() isNew: any;
  @Input() data: any;

  vmButtons: any;

  programa = {
    nombre: null,
    descripcion: null,
    codigo: null,
    estado: null,
    tipo_programa: null,
    clasificacion_programa: null,

  }

  estadoList = [
    {valor: 'A' , descripcion: 'Activo'},
    {valor: 'I' , descripcion: 'Inactivo'},
  ]

  tipo_pro = [];
  calificacion_pro = [];

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private conceptosSrv: ProgamaService,
    private commonVarSrv: CommonVarService,
    private modalDet: NgbModal
  ) { }

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
      },
      {
        orig: "btnConceptoForm",
        paramAccion: "",
        boton: { icon: "fas fa-edit", texto: " EDITAR" },
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

    setTimeout(() => {
      this.fillCatalog()
    }, 50);

    if(this.isNew){
      this.vmButtons[0].showimg = true
      this.vmButtons[1].showimg = false
    }else{
      this.programa = this.data
      this.programa.clasificacion_programa = this.data.clasificacion_programa.valor
      this.programa.tipo_programa = this.data.tipo_programa[0].valor
      this.vmButtons[0].showimg = false
      this.vmButtons[1].showimg = true
    }

  }


  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.closeModal();
        break;
      case " GUARDAR":
        this.validar("SAVE");
        break;
      case " EDITAR":
        this.validar("UPDATE");
        break;
    }
  }

  closeModal() {
    
    this.activeModal.dismiss();
  }


  validar(valor){
    this.lcargando.ctlSpinner(true);
    this.msgSpinner = "Cargando Catalogs";
    if(this.programa.nombre == null){
      this.lcargando.ctlSpinner(false);
      return this.toastr.info('Ingrese los nombres');
    }else if(this.programa.descripcion == null){
      this.lcargando.ctlSpinner(false);
      return this.toastr.info('Ingrese la descripcion');
    }else if(this.programa.codigo == null){
      this.lcargando.ctlSpinner(false);
      return this.toastr.info('Ingrese el codigo');
    }else if(this.programa.estado == null){
      this.lcargando.ctlSpinner(false);
      return this.toastr.info('Escoja el estado');
    }else if(this.programa.tipo_programa == null){
      this.lcargando.ctlSpinner(false);
      return this.toastr.info('Escoja el tipo de programa');
    }else if(this.programa.clasificacion_programa == null){
      this.lcargando.ctlSpinner(false);
      return this.toastr.info('Escoja la clasificacion de programa');
    }else{
      if(valor === "SAVE"){
        this.save()

      }else if(valor === "UPDATE"){
        this.update()
      }
    }
  }

  fillCatalog() {
    this.lcargando.ctlSpinner(true);
    this.msgSpinner = "Cargando Catalogs";
    let data = {
      params: "'NOM_CLASIFICACION_PROGRAMA', 'NOM_TIPO_PROGRAMA'",
    };
    this.conceptosSrv.getCatalogs(data).subscribe(
      (res) => {
        // console.log(res);
        this.tipo_pro = res["data"]["NOM_TIPO_PROGRAMA"];
        this.calificacion_pro = res["data"]["NOM_CLASIFICACION_PROGRAMA"];

        // console.log(this.catalog);
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );


  }


  save(){
    this.conceptosSrv.setPrograma(this.programa).subscribe(
      (res)=>{
        console.log(res);
        this.lcargando.ctlSpinner(false);
        this.commonSrv.modalProgramaConfig.next()
        this.activeModal.dismiss();
      },
      (error)=>{
        console.log(error);
        this.lcargando.ctlSpinner(false);
      }
    )
  }

  update(){
    this.conceptosSrv.updateProgama(this.programa).subscribe(
      (res)=>{
        console.log(res);
        this.lcargando.ctlSpinner(false);
        this.commonSrv.modalProgramaConfig.next()
        this.activeModal.dismiss();
      },
      (error)=>{
        console.log(error);
        this.lcargando.ctlSpinner(false);
      }
    )
  }

}
