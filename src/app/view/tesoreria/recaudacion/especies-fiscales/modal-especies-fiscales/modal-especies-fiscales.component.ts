import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { EspeciesFiscalesService } from '../especies-fiscales.service';
import { CierreMesService } from 'src/app/view/contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-especies-fiscales',
  templateUrl: './modal-especies-fiscales.component.html',
  styleUrls: ['./modal-especies-fiscales.component.scss']
})
export class ModalEspeciesFiscalesComponent implements OnInit {

  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, {static:false})
  lcargando: CcSpinerProcesarComponent;


  @Input() new: any;
  @Input() data:any

  @Input() tipo: any;

  fTitle = "Anulacion de especie fiscales";

  catalog: any = []

  vmButtons: any;

  dat = {
    id_especie_fiscal: 0,
    tipo_especie: '',
    desde: '',
    hasta: '',
    costo: '',
    fecha: '',
    cantidad: 0
  }

  constructor(
    private modal: NgbActiveModal,
    private service: EspeciesFiscalesService,
    private toastr: ToastrService,
    private modalDet: NgbModal,
    private commonVarSrv: CommonVarService,
    private cierremesService: CierreMesService
  ) {

  }


  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsConfiguracionContable",
        paramAccion: "",
        boton: { icon: "far fa-save", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsConfiguracionContable",
        paramAccion: "",
        boton: { icon: "fas fa-edit", texto: "EDITAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsConfiguracionContable",
        paramAccion: "",
        boton: { icon: "fas fa-window-close", texto: "CERRAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      },
    ]

    console.log(this.new);

    setTimeout(() => {
      if(this.new){
        this.vmButtons[1].showimg = false
        this.fTitle = 'Nueva configuracion contable'
        console.log(this.tipo);
        this.dat.tipo_especie = this.tipo;
  
      }else{
        console.log('WHAT UP');
        this.vmButtons[0].showimg = false;
        this.fTitle = 'Edicion de configuracion contable';

        
        this.dat.id_especie_fiscal = this.data.id_especie_fiscal
        this.dat.desde = this.data.desde
        this.dat.hasta = this.data.hasta;
        this.dat.costo = this.data.costo;
        this.dat.fecha = this.data.fecha;
        this.dat.cantidad = this.data.cantidad;
        
      }
    }, 5);


    setTimeout(() => {
      this.fillCatalog()
      
    }, 500);
  }





  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "GUARDAR":
        this.saveEspeciesFiscal();
      break;

      case "EDITAR":
        this.editarEspeciesFiscal();
      break;

      case "CERRAR":
        this.modal.close();
      break;
      
    }
  }


  saveEspeciesFiscal(){

    this.mensajeSppiner = "Verificando período contable";
    this.lcargando.ctlSpinner(true);
    // let data = {
    //   "anio": Number(moment(this.dat.fecha).format('YYYY')),
    //   "mes": Number(moment(this.dat.fecha).format('MM')),
    // }
      // this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(res => {
      
      /* Validamos si el periodo se encuentra aperturado */
      // if (res["data"][0].estado !== 'C') {
        this.lcargando.ctlSpinner(true)
        this.mensajeSppiner = 'Almacenando Talonario'
        this.service.saveEspeciesfiscales(this.dat).subscribe(
          (res)=>{
            console.log(res);
            this.lcargando.ctlSpinner(false)
            this.commonVarSrv.modalEspeciesFiscales.next()
            Swal.fire('Talonario almacenado correctamente', '', 'success').then(() => this.modal.close())
          },
          (err: any) => {
            console.log(err)
            this.lcargando.ctlSpinner(false)
            this.toastr.warning(err.error?.message)
          }
        )
      // } else {
      //   this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
      //   this.lcargando.ctlSpinner(false);
      // }
  
      // }, error => {
      //     this.lcargando.ctlSpinner(false);
      //     this.toastr.info(error.error.mesagge);
      // })
  }

  editarEspeciesFiscal(){

    this.service.editEspeciesfiscales(this.dat).subscribe(
      (res)=>{
        console.log(res);
        this.modal.close()
        this.commonVarSrv.modalEspeciesFiscales.next() 
      }
    )

  }


  mostrarCantidad(event){

    // console.log(event);
    
    this.dat.cantidad = parseInt(this.dat.hasta) - parseInt(this.dat.desde) + 1;

  }



  fillCatalog() {
    this.lcargando.ctlSpinner(true);
    this.mensajeSppiner = "Cargando Catalogs";

    let data = {
      params: "'REC_ESPECIE_FISCAL'",
    };

    this.service.getCatalogs(data).subscribe(
      (res) => {
        console.log(res);
        this.catalog = res["data"]["REC_ESPECIE_FISCAL"];
        

        // console.log(this.catalog);
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );




  }




  

}
