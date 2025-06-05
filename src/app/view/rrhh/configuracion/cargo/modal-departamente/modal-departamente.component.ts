import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonService } from 'src/app/services/commonServices';
import { CargoService } from '../cargo.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
standalone: false,
  selector: 'app-modal-departamente',
  templateUrl: './modal-departamente.component.html',
  styleUrls: ['./modal-departamente.component.scss']
})
export class ModalDepartamenteComponent implements OnInit {

  
  @ViewChild(CcSpinerProcesarComponent, {static:false})
  lcargando: CcSpinerProcesarComponent;

  departamento: any = []

  vmButtons: any = [];

  paginate: any;
  filter: any;

  constructor(
    private servicio: CargoService,
    private modal: NgbActiveModal,
    private commonSrv: CommonService,
  ) {
    
  }

  ngOnInit(): void {

    this.vmButtons = [
      
      {
        orig: "btnsConceptos",
        paramAccion: "",
        boton: { icon: "fas fa-chevron-left", texto: " REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }

    ];


    this.filter = {
      nombre: undefined,
      // codigo: undefined,
      estado: undefined,
      filterControl: "",
    };

    this.paginate = {
      length: 0,
      perPage: 5,
      page: 1,
      pageSizeOptions: [5, 10, 20, 50]
    };

    setTimeout(() => {
      this.cargarDepartamento();
    }, 50);

  }

  metodoGlobal(event){
    switch(event.items.boton.texto){
      case " REGRESAR":
        this.modal.close()
        break;
    }
  }

  cargarDepartamento(){
    this.lcargando.ctlSpinner(true);
    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }

    this.servicio.getDepartamento(data).subscribe(
      (res: any)=>{
        console.log(res);

        this.paginate.length = res['data']['total'];
        if (res['data']['current_page'] == 1) {
          this.departamento = res['data']['data'];
        } else {
          this.departamento = Object.values(res['data']['data']);
        }
        this.lcargando.ctlSpinner(false);

      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
      }
    )


  }

  limpiarFiltros(){
    this.filter = {
      nombre: undefined,
      // codigo: undefined,
      estado: undefined,
      filterControl: "",
    };
  }

  selectOption(depart){
    this.commonSrv.modalCargosDepar.next(depart);
    this.modal.close();
  }

  changePaginate({pageIndex}) {
    // console.log(event)
    Object.assign(this.paginate, { page: pageIndex + 1 })
    this.cargarDepartamento()
  }

}
