import { Component, OnInit, ViewChild, OnDestroy, Input } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { SeguridadService } from '../../seguridad.service'
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../../../services/commonServices'
import { CommonVarService } from '../../../../../../services/common-var.services';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';
import { CcSpinerProcesarComponent } from '../../../../../../config/custom/cc-spiner-procesar.component';

@Component({
standalone: false,
  selector: 'app-table-permisos',
  templateUrl: './table-permisos.component.html',
  styleUrls: ['./table-permisos.component.scss']
})
export class TablePermisosComponent implements OnDestroy, OnInit {
  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();

  dataT: any = [];
  @Input() data_consultar: any;
  validaDt: any = false;
  contador: any = 0;
  datAux: any;
  allSelected: boolean = false

  filter: any;
  paginate: any;

  constructor(private toastr: ToastrService, private seguridadServices: SeguridadService,
    private commonServices: CommonService,
    private coVasrv: CommonVarService) {
      this.seguridadServices.resetPermisosComponentes$.subscribe(() => {
        this.allSelected = false
      })
    this.commonServices.refreshData.asObservable().subscribe(
      (res: any) => {
        console.log(res)
        this.datAux = res;
        this.validaDt = false;
        this.dataT = [];
        this.contador += 1;
        this.getDataTable();
        // if (this.contador == 1) {
        //   this.getDataTable();
        // } else {
        //   this.dtElement.dtInstance.then((dtInstance: any) => {
        //     dtInstance.destroy();
        //     this.getDataTable();
        //   });
        // }
      }
    )

    this.coVasrv.changePermisions.asObservable().subscribe(res =>{
      this.updatePermisos();
    })
  }

  ngOnInit(): void {

    this.filter ={
      componentes: undefined,
      filterControl: ""
    };

    this.paginate= {
      length: 0,
      perPage: 20,
      page: 1,
      pageSizeOptions: [5, 10,20,50]
    }

    //this.getDataTable(this.data_consultar);
    this.contador = 0;
  }

  getDataTable() {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      search: true,
      paging: true,
      order: [[ 0, "asc" ]],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };

    let data = {
      ...this.datAux,
      params: {
        filter: this.filter
      }
    }

    console.log(data);
    this.mensajeSpinner = "Cargando...";
    this.lcargando.ctlSpinner(true);
    this.seguridadServices.getPermisosComponentes(data).subscribe(
      (res: any) => {
      // console.log(res);
        this.lcargando.ctlSpinner(false);
        this.validaDt = true;

        // this.paginate.length = res.data.total;
        // this.dataT = (res.data.current_page == 1) ? this.dataT = res.data.data : this.dataT = Object.values(res.data.data);
        this.dataT = res.data

        this.dataT.map((item: any) => Object.assign(item, { check: false }))

        setTimeout(() => {
          this.dtTrigger.next(null);
        }, 100);
      },
      (error: any) => {
        this.lcargando.ctlSpinner(false);
        console.log(error);
        this.validaDt = true;
        this.dataT = [];
        setTimeout(() => {
          this.dtTrigger.next(null);
        }, 100);
      }
    );
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.getDataTable();
  }



  updatePermisos(/* e */) {

    /* let rol = JSON.parse(localStorage.getItem('rol_seleccionado'));
    let data = {
      ver: e.ver,
      abrir: e.abrir,
      consultar: e.consultar,
      editar: e.editar,
      agregar: e.agregar,
      guardar: e.guardar,
      eliminar: e.eliminar,
      imprimir: e.imprimir,
      exportar: e.exportar,
      descargar: e.descargar,
      enviar: e.enviar,
      aprobar: e.aprobar,
      bloquear: e.bloquear,
      procesar: e.procesar,
      id_permiso: e.id_permiso,
      id_rol: rol,
      ip: this.commonServices.getIpAddress(),
      accion: "Actualización de permisos componentes "
    }
    this.confirmSave(data); */
    let rol = JSON.parse(localStorage.getItem('rol_seleccionado'));
    let data = {
      componentes:this.dataT,
      id_rol: rol,
      ip: this.commonServices.getIpAddress(),
      accion: "Actualización de permisos componentes "
    }
    console.log(this.dataT);
    this.confirmSave(data);
  }

  async confirmSave(data) {
    Swal.fire({
      title: "Atención!!",
      text: "Seguro desea actualizar el permiso?",
       icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#DC3545',
      confirmButtonColor: '#13A1EA',
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.value) {
        this.updatePermisions(data);
      }
    })
  }

  updatePermisions(data) {
    data.componentes = data.componentes.reverse();
    this.validaDt = false;
    this.dataT = [];
    // this.coVasrv.updPerm.next(true);
    this.lcargando.ctlSpinner(true)
    this.seguridadServices.updatePermisions(data).subscribe(res => {
      this.toastr.success('Datos actualizados correctamente');
      this.lcargando.ctlSpinner(false)
      // this.coVasrv.updPerm.next(false);
      // this.dtElement.dtInstance.then((dtInstance: any) => {
      //   dtInstance.destroy();
      //   this.getDataTable();
      // });
    }, error => {
      console.log(error)
      this.toastr.info(error.error?.mesagge)
      this.lcargando.ctlSpinner(false)
      // this.coVasrv.updPerm.next(false);
    })
  }

  limpiarFiltros(){
    this.filter ={
      componentes: undefined,
      filterControl: ""
    };

    this.paginate= {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10]
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  seleccionar(event) {
    // console.log(event.target)
    this.dataT.map((item: any) => {
      item[event.target.name] = event.target.checked
    })
  }

  handleCheckboxRow(event, row) {
    // console.log(event.target)
    Object.assign(row, {
      ver: event.target.checked,
      abrir: event.target.checked,
      consultar: event.target.checked,
      editar: event.target.checked,
      agregar: event.target.checked,
      guardar: event.target.checked,
      eliminar: event.target.checked,
      imprimir: event.target.checked,
      exportar: event.target.checked,
      descargar: event.target.checked,
      enviar: event.target.checked,
      aprobar: event.target.checked,
      bloquear: event.target.checked,
      procesar: event.target.checked,
    })
  }

  selectAll(event: any) {
    this.dataT.forEach((row: any) => {
      Object.assign(row, {
        ver: event.target.checked,
        abrir: event.target.checked,
        consultar: event.target.checked,
        editar: event.target.checked,
        agregar: event.target.checked,
        guardar: event.target.checked,
        eliminar: event.target.checked,
        imprimir: event.target.checked,
        exportar: event.target.checked,
        descargar: event.target.checked,
        enviar: event.target.checked,
        aprobar: event.target.checked,
        bloquear: event.target.checked,
        procesar: event.target.checked,
      })
    });
  }

}
