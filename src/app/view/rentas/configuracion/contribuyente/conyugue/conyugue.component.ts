import { Component, Input, OnInit, SimpleChanges, ViewChild, Output, EventEmitter } from '@angular/core';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import * as myVarGlobals from "../../../../../global";
import { ToastrService } from "ngx-toastr";
import { ContribuyenteService } from '../contribuyente.service';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';

@Component({
  selector: 'app-conyugue',
  templateUrl: './conyugue.component.html',
  styleUrls: ['./conyugue.component.scss']
})
export class ConyugueComponent implements OnInit {
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  validaciones = new ValidacionesFactory;

  //objeto
  contribuyente: any = {
    id_cliente: 0,
    tipo_documento: null,
    num_documento: null,
    razon_social: null,
    representante_legal: null,
    direccion: null,
    telefono: null,
    provincia: null,
    ciudad: null,
    obligado_contabilidad: null,
    pais: null,
    contribuyente: null,
    primer_nombre: null,
    segundo_nombre: null,
    primer_apellido: null,
    segundo_apellido: null,
    fecha_nacimiento: null,
    genero: null,
    estado_civil: null,
    correo_facturacion: null,
    co_cedula: 0,
    co_fecha_nacimiento: 0,
    co_primer_apellido: 0,
    co_primer_nombre: 0,
    co_segundo_apellido: null,
    co_segundo_nombre: null,
    co_tiene_conyuge: null,
    di_tiene_discpacidad: null,
    di_tipo_discapacidad: null,
    di_porcentaje_discapacidad: null,
    di_resolucion: null,
    di_fecha_resolucion: null,
    di_persona_autoriza: null,
    ap_tiene_apoderado: null,
    ap_cedula: null,
    ap_primer_nombre: null,
    ap_segundo_nombre: null,
    ap_primer_apellido: null,
    ap_segundo_apellido: null,
    ap_catalogo: null,
    ap_tipo_discapacidad: null,
    ap_porcentaje_discapacidad: null,
    ap_resolucion: null,
    ap_fecha_resolucion: null,
    ap_persona_autoriza: null,
    ph_tiene_prestamo: null,
    ph_valor_credito: null,
    ph_institucion_credito: null,
    ph_fecha_inicio: null,
    ph_fecha_fin: null,
    ph_resolucion: null,
    ph_fecha_resolucion: null,
    ph_persona_autoriza: null,
    ta_pertenece_cooperativa: null,
    ta_ruc: null,
    ta_nombre_cooperativa: null,
    ta_resolucion: null,
    ta_fecha_resolucion: null,
    ta_persona_autoriza: null,

  };

  @Input() contribuyenteSpecial: any;

  contribuyenteCon: any = {
    co_cedula: '',
    co_fecha_nacimiento: null,
    co_primer_apellido: '',
    co_primer_nombre: '',
    co_segundo_apellido: '',
    co_segundo_nombre: '',
    co_tiene_conyuge: false,
  }
  //Variables 

  detalle_edit: any;

  fileList: FileList;

  @Input() permissions: any;


  actualizar: boolean = false;

  @Input() dataUser: any;

  @Input() validadorNt: any

  @Output() checkConyugueEvent = new EventEmitter<any>();

  paginate: any;
  filter: any;

  constructor(
    private commonServices: CommonService,
    private contribuyenteSrv: ContribuyenteService,
    private commonVrs: CommonVarService,
    private toastr: ToastrService,
  ) {
    this.commonVrs.saveContribu.asObservable().subscribe(
      (res) => {

        // console.log('Conyugue',this.contribuyenteCon);
        // console.log(res);
        this.contribuyenteCon = { ...this.contribuyenteCon, ...res.data }
        this.contribuyenteCon["detalle"] = [];
        // this.contribuyenteCon["co_tiene_conyuge"] = this.conyugue;
        this.contribuyenteCon['Update'] = 'conyugue'


        if (this.contribuyenteCon.co_tiene_conyuge && this.contribuyenteCon.co_cedula) {
          console.log('Conyugue');
          this.updateContribuyente(this.contribuyenteCon);
        }


        // this.permissions = res.permissions;
        // this.uploadFile();
        console.log('Objeto Conyugue', this.contribuyenteCon);
        // console.log(res.permissions);
        // this.actualizar = true;
      }
    )

    this.commonVrs.clearContribu.asObservable().subscribe(
      (res) => {
        this.ClearForm();
      }
    )


    this.commonVrs.searchDiscapContribu.asObservable().subscribe(
      (res) => {
        // console.log('Informacion', res);
        this.contribuyenteCon = res.data

      }
    )




  }



  changeInto(event){
    
    if(event.key == 'Enter'){
      console.log('Enter');
      // console.log(this.contribuyenteCon.co_tiene_conyuge);
      // console.log(this.validadorNt);
      // console.log(this.contribuyenteCon.co_tiene_conyuge);
      // console.log(!this.validadorNt && !this.contribuyenteCon.co_tiene_conyuge);
      this.cargarContribuyentes()
      
    }
  }




  cargarContribuyentes() {
    // this.mensajeSppiner = "Cargando lista de Contribuyentes...";
    this.lcargando.ctlSpinner(true);
    this.filter['num_documento'] = this.contribuyenteCon.co_cedula

    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate,
      }
    }
    

    this.contribuyenteSrv.getContribuyentesByFilter(data).subscribe(
      (res) => {
        // console.log(data);
        console.log(res);
        if(res["data"].length == 0){
          this.lcargando.ctlSpinner(false);
          this.toastr.info("El contribuyente no se encuentra registrado");
          this.contribuyenteCon = {
            co_cedula: '',
            co_fecha_nacimiento: null,
            co_primer_apellido: '',
            co_primer_nombre: '',
            co_segundo_apellido: '',
            co_segundo_nombre: '',
            co_tiene_conyuge: false,
          };
          
        }else {
          this.lcargando.ctlSpinner(false);
          this.contribuyenteCon['co_primer_nombre'] = res['data']['data'][0]["primer_nombre"];
          this.contribuyenteCon['co_segundo_nombre'] = res['data']['data'][0]["segundo_nombre"];
          this.contribuyenteCon['co_primer_apellido'] = res['data']['data'][0]["primer_apellido"];
          this.contribuyenteCon['co_segundo_apellido'] = res['data']['data'][0]["segundo_apellido"];
          this.contribuyenteCon['co_fecha_nacimiento'] = res['data']['data'][0]["fecha_nacimiento"];
          this.contribuyenteCon['co_tiene_conyuge'] = true
        }
        
        
      },
      (error) => {
        console.log(error)
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  ngOnInit(): void {
    this.filter = {
      razon_social: undefined,
      num_documento: undefined,
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 7,
      page: 1,
      pageSizeOptions: [5, 7, 10]
    }


  }


  // ngOnChanges(changes:SimpleChanges){
  //   console.log(changes);
  //   console.log(this.contribuyenteCon);
  // }





  updateContribuyente(contribuyenteCon: any) {
    contribuyenteCon["ip"] = this.commonServices.getIpAddress();
    contribuyenteCon["accion"] = `Actualización de contribuyente`;
    contribuyenteCon["id_controlador"] = myVarGlobals.fContribuyente;

    if (this.detalle_edit != undefined) {
      contribuyenteCon["detalle"] = this.detalle_edit.arraycontact;
      contribuyenteCon["deleteContribuyente"] = this.detalle_edit.deleteContac;
      contribuyenteCon["edit"] = true;
    } else {
      contribuyenteCon["edit"] = false;
    }

    // console.log('Contribuyente',this.contribuyente);
    this.contribuyenteSrv.updateContribuyente(contribuyenteCon).subscribe(
      (res) => {
        console.log('Uodate Conyugue', res);
        this.toastr.success(res["message"]);
        this.ClearForm();

      },
      (error) => {
        console.log('Error update');
        console.log(error.error.message);
        this.toastr.info(error.error.message);
      }
    );
  }

  


  onlyNumber(event):boolean{
    console.log(event);
    let key = event.which ? event.which : event.keyCode;
    if (key > 31 && (key < 48 || key > 57)) {
      return false;
    }
    return true;
  }



  ClearForm() {
    console.log('Limpia');
    this.contribuyenteCon = {
      co_cedula: '',
      co_fecha_nacimiento: null,
      co_primer_apellido: '',
      co_primer_nombre: '',
      co_segundo_apellido: '',
      co_segundo_nombre: '',
      co_tiene_conyuge: false,
    };
    // this.validadorNt = false
    console.log('Te ejecutas?');
    this.detalle_edit = undefined;
    // this.conyugue = false;
  }

  selectedCheck() {
   
    this.checkConyugueEvent.emit({check : this.contribuyenteCon.co_tiene_conyuge, datos: this.contribuyenteCon});
  }

}
