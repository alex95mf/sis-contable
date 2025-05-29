import { Component, OnInit, Input } from '@angular/core';
import { ReportsService } from '../reports.service'
import { CommonService } from '../../../../../services/commonServices';
import { CommonVarService } from '../../../../../services/common-var.services';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
standalone: false,
  selector: 'app-show-devolution',
  templateUrl: './show-devolution.component.html',
  styleUrls: ['./show-devolution.component.scss']
})
export class ShowDevolutionComponent implements OnInit {

  dataBuy: any = { motivo_dev: 0, tipo_pago: "Tipo", forma_pago: "Forma", estado_dev: "En proceso", asesor: { nombre: "Nombre acesor" }, client: { cupo_credito: "0.00", saldo_credito: "0.00", razon_social: "Nombre cliente" }, name_doc: "Tipo documento" };
  dataTotales = { subTotalPagado: 0.00, ivaPagado: 0.00, totalPagado: 0.00, ivaBase: 0.00, iva0: 0.00 };
  dataProducto = [{ product: { nombre: "Nombre producto" }, code_product: "xxxxxxxxxxx", costo_unitario: 0.00, cant_pendiente: 0.00, cantidad: 0.00, cant_devuelta: 0.00, costo_total: 0.00, pagaIva: 0, cantidadAux: 0.00 }];
  customer: any = { asesor: { nombre: null }, customerSelect: null, cupo_credito: "0.00", saldo_credito: "0.00" };
  actions: any = { btnGuardar: true, btnMod: false };
  permissions: any;
  processing: boolean = false;
  dataUser: any;
  dataDifered: any = null;
  flagBtnDired: any = false;
  prefict: any;
  latestStatus: any;
  dateConverter: any;
  toDatePicker: Date = new Date();
  arrayCustomer: any;
  ivaConverter: any;
  arrayProductos: any;
  num_aut: any = "N/A";
  num_fac: any = "N/A";
  arrayTipoDoc: any;
  arrayMotivo: any;
  causaSelect: any = 0;
  num_doc_search: any = 0;
  observacion: any = "";
  validateNum: any = false;
  total_anterior: any;
  vmButtons: any;
  id_cliente_search: any = 0;
  totalView: any = { total_devolucion: 0, totalPagadoAux: 0 }
  @Input() info: any;

  constructor(
    private repSrv: ReportsService,
    private commonServices: CommonService,
    private commonVarServices: CommonVarService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal

  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.commonVarServices.updPerm.next(true);
    }, 50);

    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.vmButtons = [
      { orig: "btnsDevolDet", paramAccion: "", boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];
    this.showInfo();
  }

  closeModal() {
    this.activeModal.dismiss();
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "REGRESAR":
        this.closeModal();
        break;
    }
  }


  showInfo() {
    this.actions.btnGuardar = false;
    this.actions.btnMod = true;


    this.totalView.total_devolucion = parseFloat('0');
    this.dataBuy = this.info;
    this.total_anterior = this.dataBuy.total_anterior;
    this.dataTotales.subTotalPagado = this.dataBuy.subtotal;
    this.dataTotales.ivaPagado = this.dataBuy.iva;
    this.dataTotales.totalPagado = this.dataBuy.total;
    this.totalView.total_devolucion = parseFloat(this.info.total_nota_credito);
    this.totalView.totalPagadoAux = this.dataBuy.total_anterior;
    this.observacion = this.info.descripcion_dev;
    this.dataProducto = this.info['detalle'];
    this.dataProducto.forEach(element => {
      element['costo_total'] = parseFloat(element['costo_total'].toString());
      element['costo_unitario'] = parseFloat(element['costo_unitario'].toString());
      element['cant_pendiente'] = parseFloat(element['cant_pendiente'].toString());
      element['cantidad'] = parseFloat(element['cantidad_vendida'].toString());
      element['cantidadAux'] = parseFloat(element['cantidad_vendida'].toString());
      element['cant_devuelta'] = parseFloat(element['cant_devuelta'].toString());
    });
    this.causaSelect = this.dataBuy.motivo_dev;
    this.toDatePicker = this.dataBuy.fecha_dev;
    this.dataBuy.fecha = this.dataBuy.fecha_venta;
    this.num_doc_search = this.dataBuy.num_doc;
    this.dataBuy.estado_dev = (this.dataBuy.estado_dev == undefined) ? "En proceso" : this.dataBuy.estado_dev;
    this.validateNum = true;
    setTimeout(() => {
      this.commonVarServices.updPerm.next(false);  
    }, 500);
  }

  getNameDoc(id) {
    this.dataBuy.name_doc = this.arrayTipoDoc.filter(e => e.id = id)[0]['nombre'];
  }

}
