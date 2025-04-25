import { Component, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ContratoRubrosService } from './contrato-rubros.service';
import Rubro from './IRubro';
import TipoContrato from './ITipoContrato';
import Botonera from 'src/app/models/IBotonera';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contrato-rubros',
  templateUrl: './contrato-rubros.component.html',
  styleUrls: ['./contrato-rubros.component.scss']
})


export class ContratoRubrosComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  fTitle: string = 'Configuracion de Rubros por Tipo de Contrato';
  msgSpinner: string;
  vmButtons: Array<Botonera> = [];

  lst_rubro: Array<Rubro> = [];
  lst_tipo_contrato: Array<TipoContrato> = [];

  constructor(
    private apiService: ContratoRubrosService,
    private toastr: ToastrService,
  ) {
    this.vmButtons = [
      {
        orig: "btnsConfRubros",
        paramAccion: "",
        boton: { icon: "fas fa-floppy-o", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-sm btn-success",
        habilitar: false,
      },
    ]
  }

  ngOnInit(): void {
    setTimeout(() => this.cargaInicial(), 50);
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "GUARDAR":
        this.setData()
        break;
    
      default:
        break;
    }
  }

  async cargaInicial() {
    this.lcargando.ctlSpinner(true)
    try {
      this.msgSpinner = 'Cargando Tipos de Contrato'
      this.lst_tipo_contrato = await this.apiService.getTipoContrato('TCC');
      // this.lst_tipo_contrato.map((item: TipoContrato) => Object.assign(item, { check: false }))
  
      this.msgSpinner = 'Cargando Rubros'
      this.lst_rubro = await this.apiService.getRubros({ params: { filter: { estado: 2 } } });

      this.lst_rubro.map((item: Rubro) => {
        const obj = this.lst_tipo_contrato.reduce((obj, curr) => {
          obj[curr.cat_keyword] = item.tipo_contrato.find((tipo: TipoContrato) => tipo.cat_keyword == curr.cat_keyword)?.pivot?.estado || false
          return obj
        }, {})
        Object.assign(item, {lst_tipo_contrato: obj})
      })

      console.log(this.lst_rubro)

      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
    }
  }

  handleColumnCheck(event: any, tipo: TipoContrato) {
    this.lst_rubro.map((rubro: Rubro) => {
      rubro.lst_tipo_contrato[tipo.cat_keyword] = event.target.checked
    })
  }

  handleRowCheck(event, rubro: Rubro) {
    this.lst_tipo_contrato.map((item: TipoContrato) => {
      rubro.lst_tipo_contrato[item.cat_keyword] = event.target.checked
    })
  }

  async setData() {
    let result: SweetAlertResult = await Swal.fire({
      title: 'Seguro/a desea almacenar esta configuración?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
    })

    if (result.isConfirmed) {
      this.lcargando.ctlSpinner(true)
      try {
        this.msgSpinner = 'Almacenando Configuración (Puede demorar unos segundos)';
        await this.apiService.setTipoContratoRubro({rubros: this.lst_rubro, lst_tipo_contrato: this.lst_tipo_contrato})

        this.lcargando.ctlSpinner(false)
        Swal.fire('Configuración almacenada correctamente.', '', 'success');
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error durante Almacenamiento')
      }
    }
  }

}
