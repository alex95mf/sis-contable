import { Component, OnInit, Input, NgZone } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonService } from "../../../../../services/commonServices";
import { KardexService } from "../kardex.service";
import { CommonVarService } from '../../../../../services/common-var.services';
import { Router } from "@angular/router";
import * as moment from "moment";
import * as myVarGlobals from "../../../../../global";
import "sweetalert2/src/sweetalert2.scss";
const Swal = require("sweetalert2");

@Component({
standalone: false,
  selector: 'app-ingreso-ajuste-component',
  templateUrl: './ingreso-ajuste.component.html',
  styleUrls: ['./ingreso-ajuste.component.scss'],
})
export class IngresoAjusteComponent implements OnInit {
  @Input() dt: any;
  @Input() products: any;

  permissions: any;
  processing: any = false;
  processingtwo: any = false;
  toDatePicker: Date = new Date();
  data:any;
  dataUser: any;
  id_producto: any;
  id_empresa: any;
  arrayMotivo: any;
  arrayGrupo:any;
  stock:any;
  text: any;
  id_grupo:any;
  arrayTipo: Array<any> = [
    { id: 1, name: "Ingresos" },
    { id: 2, name: "Egresos" },
  ];

  actions: any = {
    dComponet: false, //inputs
    btnNuevo: false,
    btnGuardar: false,
    btncancelar: false,
    btneditar: false,
    btneliminar: false,
  };

    /*inputs*/
    ajuste: any = { cantidad: 0, costoActual: 0, total: 0 };
  	vmButtons: any = [];

  constructor(public activeModal: NgbActiveModal,
    private router: Router,
    private zone: NgZone,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private kardexSrv: KardexService,
    private commonVarSrvice: CommonVarService) { }

  ngOnInit(): void {   
    		this.vmButtons = [
      { orig: "btnsAjusteK", paramAccion: "", boton: { icon: "fa fa-plus-square-o", texto: "NUEVO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsAjusteK", paramAccion: "", boton: { icon: "fas fa-file", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsAjusteK", paramAccion: "", boton: { icon: "fa fa-eraser", texto: "LIMPIAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-dark boton btn-sm", habilitar: false, imprimir: false},
    ];
     this.data = this.products;
     this.validatePermission();
          }

    /* validation  */
  
    validatePermission() {
      this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
      let params = {
        codigo: myVarGlobals.fAjuste,
        id_rol: this.dataUser.id_rol,
      };
      this.commonServices.getPermisionsGlobas(params).subscribe(
        (res) => {
          this.permissions = res["data"][0];
          if (this.permissions.ver == "0") {
            this.toastr.info(
              "Usuario no tiene Permiso para ver el formulario de Ajuste - Kardex"
            );  
            this.vmButtons = [];
          this.closeModal();
          } else {
            setTimeout(() => {
              this.fillCatalog();
              this.grupoProduct();
            }, 1000);
          }
        },
      );
    }
 /* actions modals */
  closeModal() {
    this.activeModal.dismiss();
  }

	metodoGlobal(evento: any) {
		switch (evento.items.boton.texto) {
			case "NUEVO":
				this.nuevoAjuste();
				break;
			case "MODIFICAR":
				this.validaUpdateAjuste();
				break;
			case "LIMPIAR":
				this.cleanAjuste();
				break;
		}
	}


  calculateCredit() {
    let balance = [this.ajuste.cantidad, this.ajuste.costoActual].reduce(
      (a, b) => {
        return a * b;
      }
    );
    this.ajuste.total = parseFloat(balance).toFixed(2);
  }

  fillCatalog() {
    let data = {
      params: "'MOTIVO'",
    };
    this.kardexSrv.getCatalogs(data).subscribe(res => {
      this.arrayMotivo = res["data"]["MOTIVO"];
    }, (error) => {
      this.toastr.info(error.error.message);
    });
  }

  grupoProduct(){
    this.kardexSrv.getGrupo().subscribe(res => {
      this.arrayGrupo = res["data"];
     
    },);
  }

  getFilterProducto(e){
    this.ajuste.producto = e;
    let productInf = this.products.find((e) => e.id_producto == this.ajuste.producto);
    let nombreGrupo = this.arrayGrupo.find((e) => e.id_grupo == productInf.fk_grupo);
    this.ajuste.grupo = nombreGrupo.nombre;
    this.ajuste.costoActual = productInf.costo  ;
    this.ajuste.producto = productInf.nombre;
    this.id_producto = productInf.id_producto;
    this.id_empresa = productInf.fk_empresa;
    this.stock = productInf.stock; 
     this.ajuste.detalle = "Ajuste Kardex del Producto" + " " + this.ajuste.producto;
  }


  getFilterTipo(e) {
    this.ajuste.tipo = e;
  }

  
  getFilterMotivo(e) {
    this.ajuste.motivo = e;
    this.ajuste.detalle = "Ajuste Kardex del Producto" + " " + this.ajuste.producto + " " + "con motivo : " + this.ajuste.motivo;
    

  }


  nuevoAjuste() {
    this.actions.btnGuardar = true;
    this.actions.btneditar = true;
    this.actions.btncancelar = true;
    this.actions.dComponet = true;
  }


  cleanAjuste() { 
    this.ajuste.detalle = "Ajuste Kardex del Producto";
    this.ajuste.tipo= "";
    this.ajuste.motivo= "";
    this.ajuste.cantidad = 0;
    this.ajuste.grupo= "";
    this.ajuste.producto = "";
    this.ajuste.total = 0;
    this.ajuste.costoActual = 0;
    this.actions.dComponet = false;
    this.actions.btnGuardar = false;
    this.actions.btnNuevo = false;
    this.actions.btneditar = false;
    this.actions.btneliminar = false;


  }

  validaUpdateAjuste() {
    if (this.permissions.agregar == "0" || this.permissions.editar == "0"  ) {
      this.toastr.info("Usuario no tiene permiso realizar el ajuste");
    } else {
      if (
        this.ajuste.producto == undefined 
      ) {
        this.toastr.info("Ingrese Producto!!");
        let autFocus = document.getElementById("IdProdcuto").focus();
      } else if (
        this.ajuste.tipo == undefined 
      ) {
        this.toastr.info("Ingrese Tipo de Ajuste !!");
        let autFocus = document.getElementById("IdTipo").focus();
      } else if (
        this.ajuste.motivo == undefined 
      ) {
        this.toastr.info("Ingrese Motivo de Ajuste !!");
        let autFocus = document.getElementById("IdMotivo").focus();
      } else if (
        this.ajuste.cantidad == 0
      ) {
        this.toastr.info("Valor debe ser diferente de cero!!");
        let autFocus = document.getElementById("IdCantidad").focus();
      } else if (
        this.ajuste.costoActual  == 0 
      ) {
        this.toastr.info("Valor debe ser diferente de cero !!");
        let autFocus = document.getElementById("IdCosto").focus();
      } else if (
        this.ajuste.total  == 0 
      ) {
        this.toastr.info("Valor debe ser diferente de cero !!");
        let autFocus = document.getElementById("IdTotal").focus();
      } else if (
        this.ajuste.detalle == undefined 
      ) {
        this.toastr.info("Ingrese detalle de Ajuste - Kardex !!");
        let autFocus = document.getElementById("IdDetalle").focus();
      } else {
        this.confirmSave(
          "Seguro desea realizar el Ajuste?",
          "Mod_Ajuste"
        );
      }
    }
  }

  
  modAjuste() {
    let data = {
      fk_empresa: this.id_empresa,
      fk_product: this.id_producto,
      fk_typ_doc:  this.ajuste.tipo == "Ingresos"  ? 14  : 15,
      tipo: this.ajuste.tipo,
      movimiento: this.ajuste.tipo == "Ingresos"  ? "Compras"  : "Ventas",
      detalle: this.ajuste.detalle, 
      cantidad: parseFloat(this.ajuste.cantidad),
      costoUnitario: parseFloat(this.ajuste.total).toFixed(2),
      costoTotal: parseFloat(this.ajuste.total).toFixed(2),
      stock_actual:this.stock,
      costo_actual: parseFloat(this.ajuste.costoActual).toFixed(2),
      fecha:moment(this.toDatePicker).format("YYYY-MM-DD"),
      motivo: this.ajuste.motivo,
      ip: this.commonServices.getIpAddress(),
      accion: `Actualización del ajuste del producto ${this.ajuste.producto}`,
      id_controlador: myVarGlobals.fAjuste,
    };
    this.kardexSrv.modAjuste(data).subscribe(
      (res) => {
        this.toastr.success(res["message"]);
        setTimeout(() => {
          location.reload();
        }, 300);
      },
      (error) => {
        this.toastr.info(error.error.message);
      }
    );
  }


  async confirmSave(message, action) {
    Swal.fire({
      title: "Atención!!",
      text: message,
      type: "warning",
      showCancelButton: true,
      cancelButtonColor: "#DC3545",
      confirmButtonColor: "#13A1EA",
      confirmButtonText: "Aceptar",
    }).then((result) => {
      if (result.value) {
        if (action == "Mod_Ajuste") {
          this.modAjuste();
        }
      }
    });
  }

} 
