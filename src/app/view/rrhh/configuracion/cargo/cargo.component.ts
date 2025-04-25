import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonService } from 'src/app/services/commonServices';
import { CargoService } from './cargo.service';
import { ModalDepartamenteComponent } from './modal-departamente/modal-departamente.component';

@Component({
  selector: 'app-cargo',
  templateUrl: './cargo.component.html',
  styleUrls: ['./cargo.component.scss']
})
export class CargoComponent implements OnInit {
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, {static:false})
  lcargando: CcSpinerProcesarComponent;

  cargo = {
    id_cargo: 0,
    nombre: null,
    descripcion: null,
    departamentoID: null,
    departamento: null,
    sueldo: null,
    estado: null
  }

  vmButtons: any = [];

  conceptosDt: any = [];

  paginate: any;
  filter: any;

  estado = [
    {valor: 2, descripcion: 'Activo'},
    {valor: 3, descripcion: 'Inactivo'}

  ]

  constructor(
    private service: CargoService,
    private toastr: ToastrService,
    private modal: NgbModal,
    private commonSrv: CommonService,
  ) {
    this.commonSrv.modalCargosDepar.subscribe(
      (res)=>{
        console.log(res);
        this.cargo.departamentoID = res.id_departamento
        this.cargo.departamento = res.dep_nombre
      }
    )
  }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsConceptos",
        paramAccion: "",
        boton: { icon: "fas fa-save", texto: " GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsConceptos",
        paramAccion: "",
        boton: { icon: "fas fa-edit", texto: " MODIFICACION" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: true,
      },
      // {
      //   orig: "btnsConceptos",
      //   paramAccion: "",
      //   boton: { icon: "fas fa-trash-alt", texto: " ELIMINAR" },
      //   permiso: true,
      //   showtxt: true,
      //   showimg: true,
      //   showbadge: false,
      //   clase: "btn btn-warning boton btn-sm",
      //   habilitar: false,
      // },
      {
        orig: "btnsConceptos",
        paramAccion: "",
        boton: { icon: "far fa-times", texto: " CANCELAR" },
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
      estado: undefined,
      filterControl: "",
    };

    // TODO: Habilitar codigo en Backend

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageIndex: 0,
      pageSizeOptions: [5, 10, 20, 50]
    };


    setTimeout(() => {
      this.cargarCargos();
    }, 50);

  }

  consultar() {
    Object.assign(this.paginate, { page: 1, pageIndex: 0 })
    this.cargarCargos()
  }



  cargarCargos() {
    this.mensajeSppiner = "Cargando Cargos...";
    this.lcargando.ctlSpinner(true);

    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }

    this.service.getCargo(data).subscribe(
      (res) => {
        console.log(res);
        this.paginate.length = res['data']['total'];
        if (res['data']['current_page'] == 1) {
          this.conceptosDt = res['data']['data'];
        } else {
          this.conceptosDt = Object.values(res['data']['data']);
        }
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )

  }

  metodoGlobal(event){
    switch(event.items.boton.texto){
      case " GUARDAR":
        this.validacion("SAVE");
        break;
      case " MODIFICACION":
        this.validacion("UPDATE");
        break;
      case " ELIMINAR":
        
        break;
      case " CANCELAR":
        this.cancelar();
        break;
    }
  }

  validacion(dato){
    this.lcargando.ctlSpinner(true)
    if(this.cargo.nombre == null){
          this.lcargando.ctlSpinner(false)
      return this.toastr.info('Ingrese el nombre');
    }else if(this.cargo.descripcion == null){
          this.lcargando.ctlSpinner(false)
      return this.toastr.info('Ingrese la descripcion');
    }else if(this.cargo.departamentoID == null){
          this.lcargando.ctlSpinner(false)
      return this.toastr.info('Escoga el departamento');
    }
    // else if(this.cargo.sueldo == null){
    //       this.lcargando.ctlSpinner(false)
    //   return this.toastr.info('Ingrese el sueldo');
    // }
    else if(this.cargo.estado == null){
          this.lcargando.ctlSpinner(false)
      return this.toastr.info('Escoja el estado');
    }else {
      if(dato == "SAVE"){
        this.saveCargo()
      }else if(dato == "UPDATE"){
        this.update()
      }
    }
  }

  saveCargo(){


    this.service.setCargo(this.cargo).subscribe(
      (res)=>{
        this.lcargando.ctlSpinner(false)
        this.toastr.success('Se Guardo con éxito')
        this.cancelar()
        this.cargarCargos();
        
      },
      (error)=>{
        this.lcargando.ctlSpinner(false)
        this.toastr.info(error.message);
      }
    )
  }

  update(){

    this.service.updateCargo(this.cargo).subscribe(
      (res)=>{
        this.lcargando.ctlSpinner(false)
        this.toastr.success('Se Actualizo con éxito');
        this.cancelar()
        this.cargarCargos();
      },
      (error)=>{
        this.lcargando.ctlSpinner(false)
        this.toastr.info(error.message);
      }
    )
  }


  modalCargo(){
    let modal = this.modal.open(ModalDepartamenteComponent,{
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })

  }

  selectCargos(cargo){
    this.vmButtons[1].habilitar = false;
    this.vmButtons[0].habilitar = true;
    this.cargo.id_cargo = cargo.id_cargo
    this.cargo.nombre = cargo.car_nombre
    this.cargo.descripcion = cargo.car_descripcion
    this.cargo.departamentoID = cargo.depatamento.id_departamento
    this.cargo.departamento = cargo.depatamento.dep_nombre
    this.cargo.sueldo = cargo.sueldo
    this.cargo.estado = cargo.catalogo.id_catalogo
  }

  cancelar(){
    this.vmButtons[1].habilitar = true;
    this.vmButtons[0].habilitar = false;
    this.cargo = {
      id_cargo: 0,
      nombre: null,
      descripcion: null,
      departamentoID: null,
      departamento: null,
      sueldo: null,
      estado: null
    }
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarCargos();
  }

  limpiarFiltros(){
    this.filter = {
      nombre: undefined,
      estado: undefined,
      filterControl: "",
    };
  }

}
