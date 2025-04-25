import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { RolGeneralEmplService } from '../rol-general-empl.service';  
import { MatPaginator } from '@angular/material/paginator';
import Botonera from 'src/app/models/IBotonera';
// import { DepartamentoService } from '../departamento.service';

@Component({
  selector: 'app-modal-programa',
  templateUrl: './modal-programa.component.html',
  styleUrls: ['./modal-programa.component.scss']
})
export class ModalProgramaComponent implements OnInit {

  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator 

  vmButtons: Botonera[] = [];

  paginate: any;
  filter: any;

  programas: any = []

  constructor(
    private conceptosSrv: RolGeneralEmplService,
    private commonSrv: CommonService,
    private toastr: ToastrService,
    private commonVarSrv: CommonVarService,
    private modal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: 'btnConceptoForm', paramAccion: '', boton: {icon: 'far fa-search', texto: 'Consultar'}, clase: 'btn btn-sm btn-action', permiso: true, habilitar: false, showbadge: false, showimg: true, showtxt: true },
      { orig: 'btnConceptoForm', paramAccion: '', boton: {icon: 'far fa-eraser', texto: 'Limpiar'}, clase: 'btn btn-sm btn-warning', permiso: true, habilitar: false, showbadge: false, showimg: true, showtxt: true },
      {
        orig: "btnConceptoForm",
        paramAccion: "",
        boton: { icon: "fas fa-chevron-left", texto: "Regresar" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ];

    this.filter = {
      codigo: undefined,
      nombre: undefined,
      estado: ['A'],
      filterControl: "",
    };

    // TODO: Habilitar codigo en Backend

    this.paginate = {
      length: 0,
      perPage: 5,
      page: 1,
      pageSizeOptions: [5, 10, 20, 50]
    };
    setTimeout(()=> {
      this.getPrograma();
    }, 0);

  }


  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "Regresar":
        this.modal.close();
        break;
      case "Consultar":
        this.consultar()
        break;
      case "Limpiar":
        this.limpiarFiltros()
        break;
      
    }
  }

  consultar() {
    Object.assign(this.paginate, {page: 1, pageIndex: 0})
    this.paginator.firstPage()
    this.getPrograma()
  }

  changePaginate({pageIndex, pageSize}) {
    Object.assign(this.paginate, {page: pageIndex + 1, perPage: pageSize});
    this.getPrograma();
  }

  getPrograma(){
    this.mensajeSppiner = "Cargando Programas...";
    this.lcargando.ctlSpinner(true);
    let data ={
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }

    this.conceptosSrv.getPrograma(data).subscribe(
      (res) => {
        // console.log(res);
        this.paginate.length = res['data']['total'];
        if (res['data']['current_page'] == 1) {
          this.programas = res['data']['data'];
        } else {
          this.programas = Object.values(res['data']['data']);
        }
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )
  }


  modalChose(data){
    this.commonVarSrv.modalProgramArea.next(data);
    this.modal.close();
  }

  limpiarFiltros(){
    this.filter = {
      codigo: undefined,
      nombre: undefined,
      estado: ['A'],
      filterControl: "",
    };
  }

  

}
