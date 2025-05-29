import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EgresosBodegaService } from '../egresos-bodega.service';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
standalone: false,
  selector: 'app-modal-busca-vehiculo',
  templateUrl: './modal-busca-vehiculo.component.html',
  styleUrls: ['./modal-busca-vehiculo.component.scss']
})
export class ModalBuscaVehiculoComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  msgSpinner: string;
  vmButtons: Botonera[];

  paginate: any;

  displayedColumns: string[] = ['codigo', 'nombre', 'detalles', 'procedencia', 'costo', 'acciones'];

  ds_vehiculos: MatTableDataSource<any>;
vehiculos:any=[];
  filter: any = {
    nombre: null,
    fecha_compra: null,
    marca: null,
    procedencia: null,
  }

  constructor(
    private activeModal: NgbActiveModal,
    private apiService: EgresosBodegaService,
  ) {
    this.vmButtons = [
      {
        orig: 'btnsModalVehiculos',
        paramAccion: '',
        boton: { icon: 'fas fa-search', texto: 'CONSULTAR' },
        clase: 'btn btn-sm btn-primary',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: 'btnsModalVehiculos',
        paramAccion: '',
        boton: { icon: 'fas fa-window-close', texto: 'REGRESAR' },
        clase: 'btn btn-sm btn-danger',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: false,
      },
    ]
  }

  ngOnInit(): void {
    setTimeout(() => this.getVehiculos(), 0)

    this.paginate = {
      length: 0,
      perPage: 5,
      page: 1,
      pageSizeOptions: [5, 10]
    }


  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case "CONSULTAR":
        this.paginator.pageIndex = 0
        this.getVehiculos()
        break;
      case "REGRESAR":
        this.activeModal.close()
        break;
    
      default:
        break;
    }
  }

  changePaginate({pageIndex}) {
    Object.assign(this.paginate, {page: pageIndex + 1});
    this.getVehiculos();
  }


  async getVehiculos() {

    this.msgSpinner = "Cargando Vehiculos...";
    this.lcargando.ctlSpinner(true);

     
    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate,
      },
      codigo: "OP"
    }

 //   {params: { filter: this.filter }}

    let res = await this.apiService.getVehiculos(data);

    this.lcargando.ctlSpinner(false);

    this.vehiculos = res['data'];

    this.paginate.length = res['total'];

  //  console.log(this.vehiculos)
   // this.ds_vehiculos = new MatTableDataSource(this.vehiculos)
   // this.ds_vehiculos.paginator = this.paginator
  }

  selectVehiculo(element: any) {
    this.apiService.vehiculoSelected$.emit(element)
    this.activeModal.close()
  }

}
