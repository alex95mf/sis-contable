import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import * as moment from 'moment';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { EmisionService } from '../emision.service';


@Component({
standalone: false,
  selector: 'app-modal-liquidaciones',
  templateUrl: './modal-liquidaciones.component.html',
  styleUrls: ['./modal-liquidaciones.component.scss']
})
export class ModalLiquidacionesComponent implements OnInit {
  mensajeSpinner: string = "Cargnado...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  dataUser: any;
  @Input() module_comp: any;
  @Input() permissions: any;
  @Input() verifyRestore: any;
  @Input() totalCobro: number;
  @Input() fk_contribuyente: any;
  @Input() cuenta:any;
  @Input() formaPago:any;


  // @Input() id_concepto: any;
  // @Input() codigo: string;
  // @Input() fk_contribuyente: any;
  @Input() deudas: any = [];
  @Input() titulosDisabled: boolean;
  // @Input() listaConceptos: any;
  vmButtons: any;
  resdata: any = [];
  liquidacionesDt: any = [];
  paginate: any;
  filter: any;
  primer_dia: any;
  ultimo_dia: any;
  hoy: any;
  dia_siguiente: any;

  constructor(
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private commonVrs: CommonVarService,
    private apiSrv: EmisionService,
  ) {
  }

  ngOnInit(): void {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.vmButtons = [
      {
        orig: "btnModalLiq",
        paramAction: "",
        boton: { icon: "fas fa-chevron-left", texto: " REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ]
    this.hoy = new Date();
    this.dia_siguiente = new Date(this.hoy);
    this.dia_siguiente.setDate(this.dia_siguiente.getDate() + 1);
    this.primer_dia = new Date(this.hoy.getFullYear(), this.hoy.getMonth(), 1);
    this.ultimo_dia = new Date(this.hoy.getFullYear(), this.hoy.getMonth() + 1, 0);
    this.filter = {
      razon_social: undefined,
      num_documento: undefined,
      fecha_desde: moment(this.primer_dia).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.ultimo_dia).format('YYYY-MM-DD'),
      codigo: 0,
      filterControl: ""
    }
    this.paginate = {
      length: 0,
      perPage: 5,
      page: 1,
      pageSizeOptions: [5, 10]
    }
    setTimeout(() => {
      this.cargarLiquidaciones();
    }, 0);

    console.log(this.cuenta)
    console.log(this.formaPago)
    // if(this.formaPago=='NOTA DE DEBITO'){
    //   this.cuenta.cuenta_contable= this.cuenta[0].cuenta
    //   this.cuenta.name_cuenta=''
    //   this.buscarCuentaContable(this.cuenta.cuenta_contable)
    // }

  }


  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.closeModal();
        break;
    }
  }
  buscarCuentaContable(codigo){

    let cod ={
      codigos:[codigo]
    }

    this.apiSrv.getAccountsByCodigo(cod).subscribe(res2 => {
        console.log(res2['data'][0].nombre)
        this.cuenta.name_cuenta=res2['data'][0].nombre
    })
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarLiquidaciones();
  }

  cargarLiquidaciones() {
    this.mensajeSpinner = "Cargando lista de Ordenes de pago...";
    this.lcargando.ctlSpinner(true);
    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate,
      }
    }
    console.log("hola");
    console.log(data);
    this.apiSrv.getLiqByContribuyente(data).subscribe(
      (res) => {
        console.log(this.deudas)

        this.paginate.length = res['data']['total'];
        this.liquidacionesDt = res['data']['data'];

          this.liquidacionesDt.forEach((data) => {
            if (data['aplica'] == undefined) {
              data['aplica'] = false
            }else{
              data['aplica'] = data['aplica']
            }
           this.liquidacionesDt.forEach(e => {
            if(this.deudas.length > 0){
              this.deudas.forEach( c => {
                if (e.id_orden_pago == c.id_orden_pago){
                  Object.assign(e, {
                    aplica:true
                  })
                }
              })
            }else{
                Object.assign(e, {
                  aplica:false

                })
            }
            // if(e.compras[0].hasretencion == 1){
            //   Object.assign(e, {
            //     disabled: true,
            //     retencion: 'Sin Retencion'
            //   })

            // }else if(e.compras[0].hasretencion == 2){
            //   Object.assign(e, {
            //     disabled: false,
            //     retencion: 'Retención Generada'
            //   })
            // }

           })
          }
          )

        // else {
        //   this.liquidacionesDt = Object.values(res['data']['data']);
        //   this.liquidacionesDt.map((data) => {
        //     if (data['aplica'] == undefined) {
        //       data['aplica'] = false
        //     }
        //   }
        //   )
        // }
      //   this.liquidacionesDt.forEach(e => {
      //   if(this.deudas.length > 0){
      //     this.deudas.forEach( c => {
      //       if (e.id_orden_pago == c.id_orden_pago){
      //         if(e.compras[0].hasretencion == 1){
      //           Object.assign(e, {
      //             aplica:true,
      //             disabled: true,
      //             retencion: 'Sin Retencion'
      //           })

      //         }else if(e.compras[0].hasretencion == 2){
      //           Object.assign(e, {
      //             aplica:true,
      //             disabled: false,
      //             retencion: 'Retención Generada'
      //           })
      //         }
      //       }
      //     })
      //   }else{
      //     if(e.compras[0].hasretencion == 1){
      //       Object.assign(e, {
      //         aplica:false,
      //         disabled: true,
      //         retencion: 'Sin Retencion'
      //       })

      //     }else if(e.compras[0].hasretencion == 2){
      //       Object.assign(e, {
      //         aplica:false,
      //         disabled: false,
      //         retencion: 'Retención Generada'
      //       })
      //     }
      //   }
      //  })

        this.lcargando.ctlSpinner(false);
        console.log(this.liquidacionesDt);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  aplica(dt) {
    console.log(this.cuenta)
    let aplica = dt.aplica;
    if (aplica) {

      Object.assign(dt, {
        documento: dt.documento,
        valor: dt.monto_proceso,
        saldo: dt.saldo,
        fk_proveedor: dt.fk_proveedor,
        proveedor: dt.proveedor === null ? null :  dt.proveedor.razon_social,
        configCont: dt.empleado === null ? null :  dt.empleado.descripcion,
        fk_configcont: dt.empleado === null ? null :  dt.empleado.id_configuracion_contable,
        tipo: dt.tipo,
        cobro: dt.saldo,
        observacion: "",
        aplica: true,
        total: dt.total,
        id_orden_pago: dt.id_orden_pago,
        tipo_desembolso:"",
        cuenta:this.cuenta.name_banks,
        num_cuenta:this.cuenta.num_cuenta,
        cuenta_contable:this.cuenta.cuenta_contable,
        name_cuenta:this.cuenta.name_cuenta
        // disabled:dt.disabled,
        // retencion:dt.retencion


      })
      console.log(dt);
      this.deudas.push(dt);
      this.totalCobro += +dt.cobro;
      this.cargarLiquidaciones()

      this.commonVrs.selectPago.next({dato: dt, val: ''});
    }
    else{
      Object.assign(dt, {
        documento: dt.documento,
        valor: dt.monto_proceso,
        saldo: dt.saldo,
        fk_proveedor: dt.fk_proveedor,
        proveedor: dt.proveedor === null ? 'No hay datos' :  dt.proveedor.razon_social,
        configCont: dt.empleado === null ? 'No hay datos' :  dt.empleado.descripcion,
        tipo: dt.tipo,
        cobro: dt.saldo,
        nuevo_saldo: 0,
        observacion: "",
        aplica: false,
        total: dt.total,
        id_orden_pago: dt.id_orden_pago,
        tipo_desembolso:"",
        cuenta:this.cuenta.name_banks,
        // disabled:dt.disabled,
        // retencion:dt.retencion
      })
      this.deudas.forEach(c => {
        if(dt.id_orden_pago==c.id_orden_pago){
          // console.log(c);
          let id = this.deudas.indexOf(c);
          this.deudas.splice(id,1);
          // this.totalCobro = 0;
          this.commonVrs.selectPago.next({dato: dt, val: 'val'});
          this.cargarLiquidaciones()

        }
      })
    }
    console.log(dt)

  }

  limpiarFiltros() {
    this.filter = {
      razon_social: undefined,
      num_documento: undefined,
      fecha_desde: moment(this.primer_dia).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.ultimo_dia).format('YYYY-MM-DD'),
      codigo: 0,
      filterControl: ""
    }
    // this.cargarLiquidaciones();
  }

  selectOption(data) {
    if (this.verifyRestore) {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "¿Seguro que desea visualizar esta Orden de Pago? Los campos llenados y calculos realizados serán reiniciados.",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        cancelButtonColor: '#F86C6B',
        confirmButtonColor: '#4DBD74',
      }).then((result) => {
        if (result.isConfirmed) {
          this.closeModal(data);
          console.log("hola");
          console.log(data);
        }
      });
    } else {
      this.closeModal(data);
    }
  }

  closeModal(data?: any) {
    if (data) {
      this.commonVrs.selectPago.next(data);
    }
    this.activeModal.dismiss();
  }

}
