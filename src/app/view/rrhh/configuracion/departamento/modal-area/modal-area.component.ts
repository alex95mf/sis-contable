import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { DepartamentoService } from '../departamento.service';
import { MatPaginator } from '@angular/material/paginator';
import Botonera from 'src/app/models/IBotonera';

@Component({
standalone: false,
  selector: 'app-modal-area',
  templateUrl: './modal-area.component.html',
  styleUrls: ['./modal-area.component.scss']
})
export class ModalAreaComponent implements OnInit {

  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator

  vmButtons: Botonera[] = [];

  paginate: any;
  filter: any;

  areas: any = []

  constructor(
    private conceptosSrv: DepartamentoService,
    private commonSrv: CommonService,
    private toastr: ToastrService,
    private commonVarSrv: CommonVarService,
    private modal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: 'btnConceptoForm', paramAccion: '', boton: {icon: 'far fa-search', texto: 'CONSULTAR'}, clase: 'btn btn-sm btn-primary', permiso: true, habilitar: false, showbadge: false, showimg: true, showtxt: true },
      { orig: 'btnConceptoForm', paramAccion: '', boton: {icon: 'far fa-eraser', texto: 'LIMPIAR'}, clase: 'btn btn-sm btn-warning', permiso: true, habilitar: false, showbadge: false, showimg: true, showtxt: true },
      {
        orig: "btnConceptoForm",
        paramAccion: "",
        boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ];

    this.filter = {
      are_descripcion: null,
      are_nombre: null,
     estado: ['A'],
      filterControl: "",
    };

    // TODO: Habilitar codigo en Backend

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10, 20, 50]
    };
    setTimeout(()=> {
      this.cargarAreas();
    }, 0);

  }


  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "REGRESAR":
        this.modal.close();
        break;
      case "CONSULTAR":
        this.consultar()
        break;
      case "LIMPIAR":
        this.limpiarFiltros()
        break;
      
    }
  }

  consultar() {
    Object.assign(this.paginate, {page: 1, pageIndex: 0})
    this.paginator.firstPage()
    this.cargarAreas()
  }

  changePaginate({pageIndex, pageSize}) {
    Object.assign(this.paginate, {page: pageIndex + 1, perPage: pageSize})
    this.cargarAreas()
  }


  cargarAreas() {
    this.mensajeSppiner = "Cargando listado de Áreas...";
    this.lcargando.ctlSpinner(true);

    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }

    this.conceptosSrv.getAreas(data).subscribe(
      (res: any) => {
        console.log(res);
        this.paginate.length = res['data']['total'];
        this.areas = res.data.data
       /*  if (res['data']['current_page'] == 1) {
          this.areas = res['data']['data'];
        } else {
          this.areas = Object.values(res['data']['data']);
        } */
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )

  }


  modalChose(data){
    this.commonVarSrv.modalAreaDepartamento.next(data);
    this.modal.close();
  }

  limpiarFiltros() {
    Object.assign(this.filter, {
      are_descripcion: null,
      are_nombre: null,
    })
  }

}
