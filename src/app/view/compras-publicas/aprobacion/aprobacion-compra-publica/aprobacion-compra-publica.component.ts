import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { AprobacionService } from '../aprobacion.service';
import { CierreMesService } from 'src/app/view/contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
@Component({
standalone: false,
  selector: 'app-aprobacion-compra-publica',
  templateUrl: './aprobacion-compra-publica.component.html',
  styleUrls: ['./aprobacion-compra-publica.component.scss']
})
export class AprobacionCompraPublicaComponent implements OnInit {

  aprobacion: any = {
    id: null,
    estado: 'A',
    icp: null,
    fk_icp: 0,
    tipo_proceso: null,
    observacion: null,
    tipoRegimen: null,
    procSugerido: null,
    oficio_icp: null,
  }

  proceso = [
    {valor: 'Contratacion'},
    {valor: 'Infimas'},
    {valor: 'Catalogo Electronico'},
  ]

  tiposRegimen: any = []
  procSugeridos: any = []
  procsSugeridos: any = []

  disabledBotonIcp: boolean = false

  @Input() item: any;

  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;


  vmButtons: any
  constructor(
    public activeModal: NgbActiveModal,
    private service: AprobacionService,
    private commonVrs: CommonVarService,
    private toastr: ToastrService,
    private cierremesService: CierreMesService
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsCompaContrata", paramAccion: "1", boton: { icon: "fas fa-save", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsCompaContrata", paramAccion: "1", boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false}
    ]

    setTimeout(() => {
      console.log(this.item);

      this.cargarCatalogos()
      if( this.item['icp'] !=null || this.item['tipo_proceso'] !=null || this.item['observacion'] !=null){
        this.disabledBotonIcp = true;
        this.procSugeridos = this.procsSugeridos.filter(p => p.grupo == this.item['tipo_regimen'])
        this.aprobacion.id = this.item['id_solicitud']
        this.aprobacion.icp = this.item['icp']
        this.aprobacion.tipo_proceso = this.item['tipo_proceso']
        this.aprobacion.observacion = this.item['observacion']
        this.aprobacion.tipoRegimen = this.item['tipo_regimen'];
        this.aprobacion.procSugerido = this.item['procsugerido'];
        this.aprobacion.oficio_icp = this.item['oficio_icp'];

      }else{
        this.aprobacion['id'] = this.item['id_solicitud']
      }
    }, 50);
  }

  metodoGlobal(event){
    switch(event.items.boton.texto){
      case "GUARDAR":
        this.validacion()
        break;
      case "REGRESAR":
        this.cerrar()
        break;
    }
  }

  cerrar(){
    this.aprobacion = {
      estado: 'A',
      icp: null,
      fk_icp: 0,
      tipo_proceso: null,
      observacion: null,
      tipoRegimen: null,
      procSugerido: null
    }
    this.activeModal.close()
  }

  validacion(){
    if(this.aprobacion.icp == null){
      this.toastr.info('El campo ICP a asignar no debe estar vacio')
    }else if(this.aprobacion.tipo_proceso == null){
      this.toastr.info('El campo Tipo proceso no debe estar vacio')
    }else if(this.aprobacion.tipoRegimen == null){
      this.toastr.info('El campo Tipo de Regimen no debe estar vacio')
    }else if(this.aprobacion.procSugerido == null){
      this.toastr.info('El campo Procedimiento Sugerido no debe estar vacio')
    }else if(this.aprobacion.oficio_icp == null || this.aprobacion.oficio_icp.trim() == ''){
      this.toastr.info('El campo Oficio ICP no debe estar vacio')
    }else if(this.aprobacion.observacion == null){
      this.toastr.info('El campo Observaciones no debe estar vacio')
    } else {

      (this as any).mensajeSpinner = "Verificando período contable";
      this.lcargando.ctlSpinner(true);

      let data = {
        "anio": Number(moment().format('YYYY')),
        "mes": Number(moment().format('MM'))
      }
        this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(res => {

        /* Validamos si el periodo se encuentra aperturado */
        if (res["data"][0].estado !== 'C') {

          this.guardarContratacion()

        } else {
          this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
          this.lcargando.ctlSpinner(false);
        }

        }, error => {
            this.lcargando.ctlSpinner(false);
            this.toastr.info(error.error.mesagge);
        })

    }
  }

  asignarIcp(){
    console.log(this.item.id_solicitud);
    (this as any).mensajeSpinner = "Asignando ICP ...";
    this.lcargando.ctlSpinner(true);
    let data = {
      id_solicitud: this.item.id_solicitud
    }
    this.service.consultarIcp(data).subscribe((res)=>{
      console.log(res['data']);
      if(res['status'] == 1){
        if(res['data'].length == 0){
          Swal.fire({
            icon: "info",
            title: "No se ha generado un ICP para esta solicitud",
            //text: 'Solicitud creada con éxito',
            showCloseButton: true,
            confirmButtonText: "Aceptar",
            confirmButtonColor: '#20A8D8'
          })
          this.vmButtons[0].showimg = false
          this.lcargando.ctlSpinner(false)
        }
        else{
          this.vmButtons[0].showimg = true
          this.aprobacion.icp = res['data'].documento;
          this.aprobacion.fk_icp = res['data'].id_documento;
          this.lcargando.ctlSpinner(false);
        }

      }
    },
    (error)=>{
      console.log(error);
      this.lcargando.ctlSpinner(false);
    })

  }

  guardarContratacion(){
    console.log('Guardado');
    (this as any).mensajeSpinner = "Guardando...";
    this.lcargando.ctlSpinner(true);

    console.log(this.aprobacion);
    this.service.saveAprobacion(this.aprobacion).subscribe((res)=>{
      console.log(res);

      this.lcargando.ctlSpinner(false);
      Swal.fire({
        icon: "success",
        title: "Se aprobó su solicitud",
        text: 'Solicitud aprobada con éxito',
        showCloseButton: true,
        confirmButtonText: "Aceptar",
        confirmButtonColor: '#20A8D8'
      }).then((result) => {
        if (result.isConfirmed) {
          this.activeModal.close()
          this.aprobacion = {
            estado: 'A',
            icp: null,
            tipo_proceso: null,
            observacion: null,
            tipoRegimen: null,
            procSugerido: null,
            oficio_icp: null,
          }
          this.commonVrs.guardarAprobacion.next(null)
        }
      })


    })
  }


  selectRegimen(event) {
    this.aprobacion.procSugerido = null
    this.procSugeridos = []
    this.procSugeridos = this.procsSugeridos.filter(p => p.grupo == event)


    // let data1 = {
    //   departamento: this.item['fk_departamento']
    // }

    // this.service.getBienes(data1).subscribe((res)=>{

    //   console.log(res['data'])
    //   res['data'].map((b)=>{
    //     this.procSugeridos = this.procsSugeridos.filter(p => p.grupo == this.procsSugeridos.find(p => p.id == b.proc_sugerido.id_catalogo).grupo)
    //   })

    //   this.lcargando.ctlSpinner(false);


    // })
  }


  cargarCatalogos(){

    (this as any).mensajeSpinner = 'Cargando Catalogos'
    this.lcargando.ctlSpinner(true);
    let data = {
      params: "'PLA_TIPO_REGIMEN', 'PLA_PROC_SUGE'"
    }

    let data1 = {
      departamento: this.item['fk_departamento']
    }
    this.service.getCatalogos(data).subscribe((res)=>{

      res['data']['PLA_TIPO_REGIMEN'].forEach(a => {
        let tipoRegimen = {
          id: a.id_catalogo,
          valor: a.valor
        }
        this.tiposRegimen.push(tipoRegimen)
      })

      res['data']['PLA_PROC_SUGE'].forEach(a => {
        let procSugerido = {
          id: a.id_catalogo,
          valor: a.valor,
          grupo: a.grupo
        }
        console.log('');
        this.procsSugeridos.push(procSugerido)
      })

      this.lcargando.ctlSpinner(false);

      // console.log(this.procsSugeridos);
      // this.service.getBienes(data1).subscribe((res1)=>{

      //   // console.log(res1['data'])
      //   console.log(res1)
      //   res1['data'].map((b)=>{
      //     this.procSugeridos = this.procsSugeridos.filter(p => p.grupo == this.procsSugeridos.find(p => p.id == b.proc_sugerido.id_catalogo).grupo)
      //   })

      //   this.lcargando.ctlSpinner(false);


      // })



    })


  }

}
