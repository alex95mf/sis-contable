import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonVarService } from '../../../../../services/common-var.services'
import { GeneracionService } from '../generacion.service';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';

@Component({
standalone: false,
  selector: 'app-modal-detalles',
  templateUrl: './modal-detalles.component.html',
  styleUrls: ['./modal-detalles.component.scss']
})
export class ModalDetallesComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  @Input() module: any;
  @Input() component: any;
  @Input() concepto: any;
  @Input() detalles: any;
  //detalles: any = [];
  tarifas: any;
  dataDT: any = [];
  validaDt: any = false;
  vmButtons: any;

  constructor(
    private apiService: GeneracionService,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonVarService: CommonVarService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.commonVarService.updPerm.next(true);
    }, 50);

    this.vmButtons = [
      { orig: "btnroductFac", paramAccion: "", boton: { icon: "fas fa-plus", texto: "AGREGAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnroductFac", paramAccion: "", boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];
    //this.products = JSON.parse(localStorage.getItem('dataProductsInvoice'));
    setTimeout(() => this.getDataTableGlobals(), 0)
    // this.getDataTableGlobals();
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "REGRESAR":
        this.closeModal();
        break;
      case "AGREGAR":
        this.addListDetalle();
        break;
    }
  }

  getDataTableGlobals() {
    this.dataDT = [];
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      search: true,
      paging: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };

    if (this.detalles == undefined || this.detalles.length == 0) {
    this.lcargando.ctlSpinner(true)
    this.apiService.getTarifaById(this.concepto["id_tarifa"]).subscribe(
        (res) => {
          //console.log(res["data"]["detalles"]);
          this.tarifas = res["data"]["detalles"];
          this.apiService.getConceptoDetalles({id_concepto: this.concepto.id}).subscribe(
            (res) => {
              this.lcargando.ctlSpinner(false)
              //console.log(res["data"]);
              this.dataDT = res["data"];
              this.dataDT.forEach(element => {
                let tar = this.tarifas.filter(e => e.fk_concepto_detalle == element.id_concepto_detalle)[0]
                element["valor"] = tar == undefined ? null : tar["valor"];
                element["action"] = element["action"] == undefined ? false : element["action"];
                element['estado_tarifa'] = tar == undefined ? 'I' : tar["estado"];
              });
              this.validaDt = true;
              setTimeout(() => {
                this.dtTrigger.next(null);
              }, 50);
            },
            (error) => {
              this.lcargando.ctlSpinner(false)
              this.validaDt = true
              this.dataDT = [];
              setTimeout(() => {
                this.dtTrigger.next(null);
              }, 50);
            }
          )
        },
        (error) => {
          this.lcargando.ctlSpinner(false)
          this.validaDt = true
          this.dataDT = [];
          setTimeout(() => {
            this.dtTrigger.next(null);
          }, 50);
        }
      );
    } else {
      Object.assign(this.dataDT, JSON.parse(JSON.stringify(this.detalles)));
      this.validaDt = true;
      setTimeout(() => {
        this.dtTrigger.next(null);
      }, 50);
    }


    /*this.invoiService.searchProduct(data)
      .subscribe(res => {
        this.validaDt = true;
        if (this.products[0].codigoProducto == null) {
          Object.keys(res['data']).forEach(key => {
            res['data'][key].price = res['data'][key].PVP;
          })
          this.dataDT = res['data'];
        } else {
          this.dataDT = this.products;
        }
        this.commonVarService.updPerm.next(false);
        setTimeout(() => {
          this.dtTrigger.next(null);
        }, 50);
      }, error => {
        this.validaDt = true
        this.dataDT = [];
        this.commonVarService.updPerm.next(false);
        setTimeout(() => {
          this.dtTrigger.next(null);
        }, 50);
      });*/
  }

  closeModal() {
    this.activeModal.dismiss();
  }

  addListDetalle() {
    this.commonVarService.addLiquidacion.next(this.dataDT);
    this.closeModal();
  }

  /*addListProduct() {
    for (let i = 0; i < this.dataDT.length; i++) {
      this.dataDT[i]['quantity'] = (this.dataDT[i]['quantity'] == undefined) ? 0 : this.dataDT[i]['quantity'];
      /* this.dataDT[i]['price'] = (this.dataDT[i]['price'] != undefined) ? this.dataDT[i]['price'] : 0.00;
      this.dataDT[i]['price'] = (this.dataDT[i]['PVP'] != undefined) ? this.dataDT[i]['PVP'] : 0.00;
      this.dataDT[i]['totalItems'] = (this.dataDT[i]['totalItems'] == undefined) ? 0.00 : this.dataDT[i]['totalItems'];
      if (this.dataDT[i]['action'] == undefined) {
        this.dataDT[i]['action'] = false;
      }
    }
    this.commonVarService.setListProductInvoice.next(this.dataDT);
    this.closeModal();
  }*/

}
