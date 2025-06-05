import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonVarService } from 'src/app/services/common-var.services';
import { EspeciesFiscalesService } from '../especies-fiscales.service';

@Component({
standalone: false,
  selector: 'app-anulacion-especies',
  templateUrl: './anulacion-especies.component.html',
  styleUrls: ['./anulacion-especies.component.scss']
})
export class AnulacionEspeciesComponent implements OnInit {

  @Input() data: any

  vmButtons: any;
  catalog: any;
  

  fTitle = "Anulacion Especie Fiscal"

  dat = {
    id_especie_fiscal: 0,
    tipo_especie: '',
    desde: '',
    hasta: '',
    nro_actual: 0,
    cantidad_anuladas: 0,
    cantdida_anuladas_or: 0,
    nro_talonario: 0
  }

  constructor(
    private modal: NgbActiveModal,
    private service: EspeciesFiscalesService,
    private toastr: ToastrService,
    private modalDet: NgbModal,
    private commonVarSrv: CommonVarService
  ) { }

  ngOnInit(): void {

    this.vmButtons = [
      {
        orig: "btnsConfiguracionContable",
        paramAccion: "",
        boton: { icon: "far fa-save", texto: " GUARDAR" },
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
        boton: { icon: "fas fa-chevron-left", texto: " CRERRAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      },
    ]

    this.dat.id_especie_fiscal = this.data.id_especie_fiscal;
    this.dat.tipo_especie = this.data.tipo_especie;
    this.dat.desde = this.data.desde;
    this.dat.hasta = this.data.hasta;
    this.dat.nro_actual = this.data.nro_actual;
    this.dat.cantdida_anuladas_or = this.data.cantidad_anuladas
    this.dat.nro_talonario = this.data.nro_talonario

  }


  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case " GUARDAR":
        this.validacion();
      break;

      case " CRERRAR":
        this.modal.close();
      break;

    }
  }

  validacion(){
    let anulaciones = this.dat.nro_actual + this.dat.cantidad_anuladas
    // console.log(anulaciones);
    if( anulaciones > parseInt(this.dat.hasta)){
      this.toastr.info('La cantidad anulada excede de las guardada')

    }else{
      this.anulacionEspeciesFiscales()
    }
  }

  anulacionEspeciesFiscales(){
    this.service.anulacionEspeciesfiscales(this.dat).subscribe(
      (res)=>{
        console.log(res);
        this.modal.close()
        this.commonVarSrv.modalAnulacionEspeciesFiscales.next(null)
      }
    )
  }

}
