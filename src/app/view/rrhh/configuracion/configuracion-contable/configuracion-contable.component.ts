import { Component, OnInit, ViewChild } from '@angular/core';
import { RolGeneralEmplService } from '../../beneficios/rol-general/rol-general-empl.service';

import { ContratoRubrosService } from '../contrato-rubros/contrato-rubros.service';
import { CatalogoPresupuestoService } from '../../../contabilidad/catalogo-presupuesto/catalogo-presupuesto.service';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ModalModSetComponent } from './modal-mod-set/modal-mod-set.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as myVarGlobals from "../../../../global";


import { EmisionService } from '../../../tesoreria/pagos/emision/emision.service';
@Component({
standalone: false,
  selector: 'app-configuracion-contable',
  templateUrl: './configuracion-contable.component.html',
  styleUrls: ['./configuracion-contable.component.scss']
})
export class ConfiguracionContableComponent implements OnInit {
  tipoContrato: any;
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  tipoContratos: any = [];
  codigo:any
  descripcion:any;
  lst_tipo_contrato: any;
  dataToInic:any;
  rubroTipoContraro:any;
  lst_rubro: any;
  filteredData: any;
  vmButtons: any;
  fTitle: string = "Rubros";
  cuentas: any;
  constructor(private pCuentasService: CatalogoPresupuestoService, private apiSrv: EmisionService, private rolgeneralemplService: RolGeneralEmplService, private apiService: ContratoRubrosService, private modalSrv: NgbModal,) { }

  ngOnInit(): void {

    this.vmButtons = [
      {
        orig: "btnsConsultRol_general",
        paramAccion: "",
        boton: { icon: "fas fa-floppy-o", texto: "CONSULTAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-sm btn-success",
        habilitar: false,
      },
    ]

    setTimeout(() => {
      this.getTipoContratos();
      this.otraAccionDespuesDeCargaInicial();
   //   this.cargaInicial()
    }, 50);
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "CONSULTAR":

        this.otraAccionDespuesDeCargaInicial();// this.cargaInicial();

        break;

    }
  }



  getTipoContratos() {
    let data = {
      valor_cat: 'TCC',
    }
    this.rolgeneralemplService.getTipoContratos(data).subscribe((result: any) => {
      if (result.length > 0) {
        this.tipoContratos = result;
      } else {
        this.tipoContratos = [];

      }
    }, error => {

    });
  }


  async  otraAccionDespuesDeCargaInicial() {
    try {
      await this.cargaInicial();
      
      // Código que se ejecutará después de cargaInicial
      console.log("Terminó cargaInicial, ahora ejecutando otra acción...");
    } catch (error) {
      // Manejar errores si es necesario
      console.error("Error en cargaInicial:", error);
    }
  }
  
  // Llamada a la función
  








  async cargaInicial() {
    if (this.tipoContrato == undefined) { return; }
    this.lcargando.ctlSpinner(true)
    try {
      
      this.rubroTipoContraro = await this.apiService.getRubrosTipoContrato({params:{tipo:this.tipoContrato,codigo:this.codigo,descripcion:this.descripcion}});
      console.log("this.rubroTipoContraro",this.rubroTipoContraro);
      /* this.lst_tipo_contrato = await this.apiService.getTipoContrato('TCC');
      this.lst_rubro = await this.apiService.getRubros({ params: { filter: { estado: 2 } } });
      console.log(this.lst_tipo_contrato);
      console.log(this.lst_rubro);
      console.log("this.tipoContrato", this.tipoContrato);
      if (this.tipoContrato !== undefined) {
        this.filteredData = this.lst_rubro.filter(item => {
         
          return item.tipo_contrato.some(tc => {
            const meetsConditions = tc.cat_keyword === this.tipoContrato && tc.pivot.estado;
            if (meetsConditions) {
              item.nuevaPropiedad = tc.pivot.id;
              item.codigo_presupuesto = tc.pivot.codigo_presupuesto;
              item.cuenta_acreedora = tc.pivot.cuenta_acreedora;
              item.cuenta_deudora = tc.pivot.cuenta_deudora;
              let dat = [item.cuenta_deudora, item.cuenta_acreedora]

              this.getDetailbyCodigo(dat, (result) => {
                this.lcargando.ctlSpinner(true)
                console.log("resultado", result);

                const deudoraDetail = result.find(detail => detail.codigo === item.cuenta_deudora);
                // Buscar el nombre en el resultado por el código de cuenta_acreedora
                const acreedoraDetail = result.find(detail => detail.codigo === item.cuenta_acreedora);

                // Agregar el campo 'nombre' como 'nombre_cuenta_deudora' y 'nombre_cuenta_acreedora'
                if (deudoraDetail) {
                  item.nombre_cuenta_deudora = deudoraDetail.nombre;
                  item.numcInvDeb = deudoraDetail.nombre;


                }
                if (acreedoraDetail) {
                  item.nombre_cuenta_acreedora = acreedoraDetail.nombre;
                  item.numcInvHab = acreedoraDetail.nombre;
                }
                console.log("resultado", result);

this.lcargando.ctlSpinner(false);
                // Resto del código para procesar los resultados aquí
              });
              this.getPresupuesto(item.codigo_presupuesto, (result) => { this.lcargando.ctlSpinner(true)
                const presupuestoDetail = result.find(detail => detail.codigo === item.codigo_presupuesto);
                if (presupuestoDetail) {
                  item.nombre_presupuesto = presupuestoDetail.nombre;
                  item.numpcInvDeb = presupuestoDetail.descripcion_general;
                }
                this.lcargando.ctlSpinner(false);
              });






            }



           



            return meetsConditions;

          });
        });
      } else { this.lcargando.ctlSpinner(false)
        //this.filteredData = this.lst_rubro;
      }
      console.log("prueba0");
      console.log(this.filteredData);

   


 */

      this.lcargando.ctlSpinner(false)
      
    } catch (err) {
      this.lcargando.ctlSpinner(false)
      console.error("Error al obtener RubrosTipoContrato:", err);
    console.log("Respuesta de la API:", err.response);
    }
  }

  getPresupuesto(y, callback) {

    this.pCuentasService.catalogoPresupuestoId({ id: y }).subscribe(
      res2 => {
        console.log(res2['data']);
        if (callback) {
          callback(res2['data']);
        }
      },
      error => {
        console.error("Error al obtener detalles por código:", error);
        // Puedes manejar el error de alguna manera si es necesario
      }/* 
    (e: any) => {
      // console.log(e);
      let data = e['data'][0]
      this.lcargando.ctlSpinner(false);
      this.numCatalogoCodigo = data.codigo;
      this.nameCatalogoPresupuesto = data.nombre;
      this.estadoCatalogoPresupuesto = data.estado.trim(); 
      this.descripCatalogoPresupuesto = data.descripcion_general;
      this.tipoCatalogoPresupuesto = data.tipo;
      this.codigoRelacionado = data.codigo_relacionado
    },
    (error) => {
      console.log(error);
      this.lcargando.ctlSpinner(false)
     // this.toastr.info(error.error.message, 'Error cargando Codigo Presupuesto')
    } */
    );

  }
  getDetailbyCodigo(x, callback) {
    let data = {
      codigos: x
    };

    this.apiSrv.getAccountsByCodigo(data).subscribe(
      res2 => {
        console.log(res2['data']);
        if (callback) {
          callback(res2['data']);
        }
      },
      error => {
        console.error("Error al obtener detalles por código:", error);
        // Puedes manejar el error de alguna manera si es necesario
      }
    );
  }
  /*  getDetailbyCodigo(x){
     let data ={
       codigos:x
     } 
 
     this.apiSrv.getAccountsByCodigo(data).subscribe(res2 => {
       console.log(res2['data']) 
   })
    
   } */
  showConceptoForm(isNew: boolean, data?: any) {
    let cuentas = {
      codigo_presupuesto: data.codigo_presupuesto,
      cuenta_acreedora: data.cuenta_acreedora,
      cuenta_deudora: data.cuenta_deudora,
      numcInvDeb: data.numcInvDeb,
      numpcInvDeb: data.numpcInvDeb,
      numcInvHab: data.numcInvHab
    }//[]
    console.log(data);
    const modalInvoice = this.modalSrv.open(ModalModSetComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fConcepto;
    modalInvoice.componentInstance.fTitle = this.fTitle;
    modalInvoice.componentInstance.isNew = isNew;
    modalInvoice.componentInstance.data = data.nuevaPropiedad;
    modalInvoice.componentInstance.cuentas = cuentas;
    // modalInvoice.componentInstance.permissions = this.permissions;
    modalInvoice.result.then(
      (result) => {
        // La función que deseas ejecutar al cerrar el modal
        if (result == 'guardado'){
          this.otraAccionDespuesDeCargaInicial();// this.cargaInicial();
        console.log(`Modal cerrado con:`, result);
      }
      },
      (reason) => {
        // Manejar el cierre del modal si es necesario
        console.log(`Modal cerrado con: ${reason}`);
      }
    );

  }


  showEditForm(isNew: boolean, data?: any) {
    let cuentas = {
      codigo_presupuesto: data.codigo_presupuesto,
      cuenta_acreedora: data.cuenta_acreedora,
      cuenta_deudora: data.cuenta_deudora,
      numcInvDeb: data.nombre_cuenta_deudora,
      numpcInvDeb: data.nombre_presupuesto,
      numcInvHab: data.nombre_cuenta_acreedora
    }//[]
    console.log(data);
    const modalInvoice = this.modalSrv.open(ModalModSetComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fConcepto;
    modalInvoice.componentInstance.fTitle = this.fTitle;
    modalInvoice.componentInstance.isNew = isNew;
    modalInvoice.componentInstance.data = data.id;
    modalInvoice.componentInstance.cuentas = cuentas;
    // modalInvoice.componentInstance.permissions = this.permissions;
    modalInvoice.result.then(
      (result) => {
        // La función que deseas ejecutar al cerrar el modal
        if (result == 'guardado'){
          this.otraAccionDespuesDeCargaInicial();// this.cargaInicial();
        console.log(`Modal cerrado con:`, result);
      }
      },
      (reason) => {
        // Manejar el cierre del modal si es necesario
        console.log(`Modal cerrado con: ${reason}`);
      }
    );

  }
}
