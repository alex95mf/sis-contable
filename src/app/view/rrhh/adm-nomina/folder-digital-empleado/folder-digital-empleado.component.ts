import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../../../../services/commonServices';
import { RhfolderDigitalEmpleadoService } from './rhfolder-digital-empleado.service';
import * as myVarGlobals from '../../../../global';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CcModalTableEmpleadoComponent } from 'src/app/config/custom/modal-component/cc-modal-table-empleado/cc-modal-table-empleado.component';
import { EmployeesResponseI } from 'src/app/models/responseEmployee.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DocFicha, DocFichaAditionalResponseI } from 'src/app/models/responseDocFichaAditional.interfase';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { event } from 'jquery';
import moment from 'moment';
import { GeneralResponseI } from 'src/app/models/responseGeneral.interface';

@Component({
standalone: false,
  selector: 'app-folder-digital-empleado',
  templateUrl: './folder-digital-empleado.component.html',
  styleUrls: ['./folder-digital-empleado.component.scss'],
  providers: [DialogService],
})
export class FolderDigitalEmpleadoComponent implements OnInit {

  @ViewChild("nameEmpuFullNombre") inputNameEmpFullNombre; // accessing the reference element

  tipo_archivo_id_cc: BigInteger | String | number;
  ref: DynamicDialogRef;

  fileToUpload: any;
  fileBase64: any;
  nameFile: any;
  //tabla
  loading: boolean;
  totalRecords: number;
  rows: number;
  pageIndex: number = 1;
  pageSize: number= 5;
  pageSizeOptions: number[] = [5, 10, 15, 20];

  @ViewChild(DataTableDirective)

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  @Input() objGetDocumentByEmployee: DocFicha[];
  actions: any = { btnGuardar: true, btnMod: false };

  messageError: MessageService[] = [];

  dataUser: any;
  permiso_ver:any = "0";
  empresLogo: any;
  permisions: any;
  ingresosydescientos: any = [];

  vmButtons:any = [];
  registerForm: FormGroup;
  submitted = false;
  processing: any = false;



  folderDigitalForm: DocFicha = {
    full_nombre_empleado: '',
    nombre_archivo: '',
    id_doc_ficha: 0,
    id_empleado: 0,
    tipo_archivo_id: 0,
    extension: '',
    peso_archivo : 0,
    archivo_base_64: '',
    fecha_creacion: undefined,
    fecha_modificacion: undefined,
    estado_id: 0,
    estado: undefined,
    tipo_archivo: undefined,
  };


  constructor(
    private commonService: CommonService,
    private rhfolderdigitalService: RhfolderDigitalEmpleadoService,
    private toastr: ToastrService,
    public dialogService: DialogService,
    private formBuilder: FormBuilder,
    ) {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.totalRecords = 0;
    this.rows = 5;

  }



  ngOnInit(): void {


    this.vmButtons = [
      {
        orig: "btnsFolderDigital",
        paramAccion: "",
        boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsFolderDigital",
        paramAccion: "",
        boton: { icon: "fa fa-plus-square-o", texto: "MODIFICAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn btn-primary boton btn-sm",
        habilitar: true,
        imprimir: false,
      },
      {
        orig: "btnsFolderDigital",
        paramAccion: "",
        boton: { icon: "fa fa-trash-o", texto: "ELIMINAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn btn-warning boton btn-sm",
        habilitar: true,
        imprimir: false,
      },
      {
        orig: "btnsFolderDigital",
        paramAccion: "",
        boton: { icon: "fa fa-times", texto: "CANCELAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      },
    ];

    this.registerForm = this.formBuilder.group({
      full_nombre_empleado: [{ value: ''/* ,disabled: true */}, [Validators.required, Validators.minLength(1)]],
      fg_nombre_archivo_input: [{ value: ''/* ,disabled: true */}, [Validators.required]],
      fg_tipo_archivo: ['', [Validators.required]],
    });

      this.empresLogo = this.dataUser.logoEmpresa;
      let id_rol = this.dataUser.id_rol;

      let data = {
        id: 2,
        codigo: myVarGlobals.fJornadas,
        id_rol: id_rol
      }

      this.commonService.getPermisionsGlobas(data).subscribe(res => {

        this.permisions = res['data'];

        this.permiso_ver = this.permisions[0].ver;

        if (this.permiso_ver == "0") {

          this.toastr.info("Usuario no tiene Permiso para ver el formulario de Jornada");
          this.vmButtons = [];
          this.lcargando.ctlSpinner(false);

        } else {
          /*
          if (this.permisions[0].imprimir == "0") {
            this.btnPrint = false;
            this.vmButtons[2].habilitar = true;
          } else {
            this.btnPrint = true
            this.vmButtons[2].habilitar = false;
          }
          */

          /* this.getParametersFilter(); */
        }
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      })
  }



   // convenience getter for easy access to form fields
   get f() { return this.registerForm.controls; }
/*   getParametersFilter() {
    this.asientoautomaticoService.getParametersFilter({ id_empresa: this.dataUser.id_empresa }).subscribe(res => {
      this.dataLength = res['data'];
      if(this.dataLength[0]){
        for (let index = 0; index < this.dataLength[0].niveles; index++) {
          this.lstNiveles.push(index+1);
        }
      }

      this.getGrupoAccount();
    }, error =>{
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  } */

  metodoGlobal(evento: any) {
		switch (evento.items.boton.texto) {
		    case "GUARDAR":
          this.validaSaveFolderDigital();
          break;
        break;
        case "MODIFICAR":
          this.validaUpdateFolderDigital();
        break;
        case "ELIMINAR":
          this.validaDeleteFolderDigital();
        break;
        case "CANCELAR":
          this.cancel("not");
        break;
		}
	}

  toLocal(date) {
    var local = new Date(date);
    local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return local.toJSON();
  }


  async validaSaveFolderDigital() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) { return; }
    this.confirmSave("Seguro desea guardar el documento?", "SAVE_FOLDER_DIGITAL");
  }


  async validaUpdateFolderDigital() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) { return; }
    this.confirmSave("Seguro desea actualizar el documento?", "UPDATED_FOLDER_DIGITAL");
  }

  async validaDeleteFolderDigital() {
    this.confirmSave(
      "Seguro desea eliminar el documento?",
      "DELETE_FOLDER_DIGITAL"
    );

    // if (this.permisions.guardar == "0") {
    //   this.toastr.info("Usuario no tiene permiso para guardar");
    // } else {
    //   let resp = await this.validateDataGlobal().then(respuesta => {
    //     if (respuesta) {
    //       this.confirmSave("Seguro desea actualizar la cuenta?", "UPDATED_ACCOUNT");
    //     }
    //   })
    // }
  }

  async confirmSave(message, action) {
    Swal.fire({
      title: "Atención!!",
      text: message,
      //icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#DC3545",
      confirmButtonColor: "#13A1EA",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      this.processing = false;
      if (result.value) {
        if (action == "SAVE_FOLDER_DIGITAL") {
          this.saveFolderDigital();
        } else if (action == "UPDATED_FOLDER_DIGITAL") {
          this.updatedFolderDigital();
        } else if (action == "DELETE_FOLDER_DIGITAL") {
          this.deleteFolderDigital();
        }
      }
    });
  }


  async updatedFolderDigital() {

    this.submitted = true;

    var date = new Date();


    let data = {
      // info: this.areaForm,
      ip: this.commonService.getIpAddress(),
      accion: "Creación de folder digital rrhh",
      id_controlador: myVarGlobals.fCuentaBancos,
      id_doc_ficha : this.folderDigitalForm.id_doc_ficha,
      id_empleado: this.folderDigitalForm.id_empleado,
      tipo_archivo_id: this.folderDigitalForm.tipo_archivo_id,
      nombre_archivo: this.folderDigitalForm.nombre_archivo,
      extension: this.folderDigitalForm.extension,
      peso_archivo: this.folderDigitalForm.peso_archivo,
      archivo_base_64: this.folderDigitalForm.archivo_base_64,
      fecha_creacion: this.folderDigitalForm.fecha_creacion,//new Date().toISOString().slice(0, 10),
      fecha_modificacion: this.toLocal(date),

    };
    (this as any).mensajeSpinner = "Actualizando...";
    this.lcargando.ctlSpinner(true);
    this.rhfolderdigitalService.updatedFolderDigital(data).subscribe(
      (res) => {

        this.toastr.success("Actualizado");
        this.messageError = [];
        this.getDocumentoByEmpleadoUno(this.folderDigitalForm.id_empleado);
        this.lcargando.ctlSpinner(false);
        this.cancel("not");
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.processing = true;
        this.messageError = error.error.detail;
        this.messageError.forEach(element => {
          this.toastr.error(element.toString());
        });
        // this.messageError = [];
        console.log(error.error.detail);
        // this.toastr.info(error.error.message);
      }
    );
  }


  deleteFolderDigital() {
    console.log("delete");
    let data = {
      // info: this.areaForm,
      ip: this.commonService.getIpAddress(),
      accion: "Borrar folder digital rrhh",
      id_controlador: myVarGlobals.fBovedas,
      id_doc_ficha: this.folderDigitalForm.id_doc_ficha,
    };
    // this.validaDt = false;
    (this as any).mensajeSpinner = "Borrando...";
    this.lcargando.ctlSpinner(true);
    this.rhfolderdigitalService.deleteFolderDigital(data).subscribe(
      (res) => {
        console.log(res);
        // this.rerender();
        this.cancel("not");
        this.messageError = [];
        this.getDocumentoByEmpleadoUno(this.folderDigitalForm.id_empleado);
        this.lcargando.ctlSpinner(false);
        this.toastr.success("Borrado" /* res['message'] */);

      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.processing = true;
        this.messageError = error.error.detail;
        this.messageError.forEach(element => {
          this.toastr.error(element.toString());
        });
        this.messageError = [];

      }
    );
  }

  async saveFolderDigital() {

    this.submitted = true;

    var date = new Date();


    let data = {
      // info: this.areaForm,
      ip: this.commonService.getIpAddress(),
      accion: "Creación de folder digital rrhh",
      id_controlador: myVarGlobals.fCuentaBancos,

      id_empleado: this.folderDigitalForm.id_empleado,
      tipo_archivo_id: this.folderDigitalForm.tipo_archivo_id,
      nombre_archivo: this.folderDigitalForm.nombre_archivo,
      extension: this.folderDigitalForm.extension,
      peso_archivo: this.folderDigitalForm.peso_archivo,
      archivo_base_64: this.folderDigitalForm.archivo_base_64,
      fecha_creacion: this.toLocal(date),//new Date().toISOString().slice(0, 10),
      fecha_modificacion: null,

    };

    (this as any).mensajeSpinner = "Guardando...";
    this.lcargando.ctlSpinner(true);
    this.rhfolderdigitalService.saveFolderDigital(data).subscribe(
      (res) => {

        this.toastr.success("Guardado");
        this.messageError = [];
        this.getDocumentoByEmpleadoUno(this.folderDigitalForm.id_empleado);
        this.lcargando.ctlSpinner(false);
        this.cancel("not");
      },
      (error) => {

        this.lcargando.ctlSpinner(false);
        this.processing = true;
        this.messageError = error.error.detail;
        console.log(error.error.detail);
        // this.toastr.info(error.error.message);
      }
    );
  }


  /*NUEVOS BOTONES */

/*   metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "NUEVO":
        this.newAccount();
        break;
        case "CONSULTAR":
          this.consultarData(); //lo tomé de consulta-estado-cliente.component
          break;
        break;
      case "MODIFICAR":
        this.confirmUpdate();
        break;
        case "ELIMINAR":
        this.eliminar();   //grupo.component de ahi tome el boton
        break;
    }
  } */




  onClicConsultaEmpleadosFolderDigital(content) {
    this.ref = this.dialogService.open(CcModalTableEmpleadoComponent, {
      data: {
        relation: "not",
      },
      header: "Empleados",
      width: "70%",
      contentStyle: { "max-height": "500px", overflow: "auto" },
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((empleadoData: EmployeesResponseI) => {
      this.getDocumentoByEmpleadoUno(empleadoData.id_empleado );

      // this.getDocumentoByEmpleado(event );

      this.inputNameEmpFullNombre.nativeElement.value = empleadoData.emp_full_nombre;
      // console.log("hola");
      this.folderDigitalForm.full_nombre_empleado = empleadoData.emp_full_nombre;
      this.folderDigitalForm.id_empleado = empleadoData.id_empleado;
      // this.registerForm = this.formBuilder.group({
      //   full_nombre_empleado: empleadoData.emp_full_nombre,
      // });

      // console.log(empleadoData);
    });
  }

  // documentoByEmpleado(event: LazyLoadEvent){
  //   // console.log(event.first);
  //   return event;
  // }

  /**
   *
   * @param ptr_id_empleado
   */
  getDocumentoByEmpleadoUno(/* parameterUrl */ ptr_id_empleado)
  {

  //  console.log(parameterUrl);
    // console.log(this.nextPage(event: LazyLoadEvent));
    this.loading = true;
    let parameterUrl: any = {
      id_empleado: ptr_id_empleado,
      page:  this.pageIndex ,
      size: this.rows,//event.rows,
      sort: 'id_doc_ficha',
      type_sort: 'asc'
    };
    console.log(parameterUrl);
    this.rhfolderdigitalService.getDocumentByEmployee(parameterUrl).subscribe({
      next: (rpt: DocFichaAditionalResponseI) => {
        this.totalRecords = rpt.total;
        this.objGetDocumentByEmployee = rpt.data;
        console.log(rpt.data);
        this.loading = false;
      },
      error: (e) => {
        console.log(e);
        this.loading = false;
      },
    });
  }

  nextPage(event: LazyLoadEvent) {
    let id_emp = this.folderDigitalForm.id_empleado;
    if(id_emp != 0)
    {
      this.pageIndex = (event.first/this.rows)+1;
      this.getDocumentoByEmpleadoUno(this.folderDigitalForm.id_empleado);
    }
    return ;

    // this.pageSize = (event.first/this.rows)+1;
    // this.loading = true;
    // const p_page = (event.first/this.rows)+1;
    // let parameterUrl: any = {
    //   id_empleado: 1,
    //   page:  p_page,
    //   size:  (event.first/this.rows)+1,
    //   sort: (event.sortField == undefined) ? 'id_doc_ficha' : event.sortField,
    //   type_sort: (event.sortOrder == -1) ? 'desc' : 'asc',
    // };
    // this.getDocumentoByEmpleado(parameterUrl);

   /*  this.rhfolderdigitalService.getDocumentByEmployee(parameterUrl).subscribe({
      next: (rpt: DocFichaAditionalResponseI) => {
        this.totalRecords = rpt.total;
        this.objGetDocumentByEmployee = rpt.data;
        console.log(rpt.data);
        this.loading = false;
      },
      error: (e) => {
        console.log(e);
        this.loading = false;
      },
    }); */
    // return event;
  }

  onRowSelectFolderDigitalEmp(dataFolderDigital :DocFicha ){
    this.folderDigitalForm = dataFolderDigital.data;
    let nameEmp = dataFolderDigital.data.empleado.emp_full_nombre;
    this.inputNameEmpFullNombre.nativeElement.value = nameEmp;
    this.folderDigitalForm.full_nombre_empleado = nameEmp;
    this.viewSelectionTipoArchivoCC(dataFolderDigital.data.tipo_archivo_id);

    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = false;

    // console.log(this.folderDigitalForm );
  }

  viewSelectionTipoArchivoCC(responseId: any) {
    this.tipo_archivo_id_cc = responseId;
    this.folderDigitalForm.tipo_archivo_id =  responseId;
    this.registerForm.get("fg_tipo_archivo").setValue(this.tipo_archivo_id_cc);
  }

/*   consultarData() {
		if (this.permisions.consultar == "0") {
			this.toastr.info("Usuario no permiso para Consultar el Estado de Cuenta de Cliente");
		} else {
			this.vmButtonsInf = [
				{ orig: "btnEstadoClienteInf", paramAccion: "", boton: { icon: "fas fa-share-square", texto: "REGRESAR CONSULTA" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false, imprimir: false},
				{ orig: "btnEstadoClienteInf", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false, printSection: "print-section", imprimir: true },
				];
			this.ConsultarTableDoc();
			 }
	 } */


/*   eliminar() {
    if (this.permisions[0].eliminar == "0") {
      this.toastr.info("Usuario no tiene permiso para eliminar");
    } else {
      Swal.fire({
        title: "Atención",
        text: "Seguro desea eliminar la siguiente información?",
        //icon: "warning",
        showCancelButton: true,
        cancelButtonColor: '#DC3545',
        confirmButtonColor: '#13A1EA',
        confirmButtonText: "Aceptar"
      }).then((result) => {
        if (result.value) {
          let data = {
            ip: this.commonServices.getIpAddress(),
            accion: `Información eliminada de grupo con identificación ${this.id_grupo}  a nombre ${this.noms}`,
            id_controlador: myVarGlobals.fGrupo,
            id_grupo: this.id_grupo,
          };
          (this as any).mensajeSpinner = "Eliminando...";
          this.lcargando.ctlSpinner(true);
          this.grupoServices.deleteGrupo(data).subscribe(res => {
            this.lcargando.ctlSpinner(false);
            this.cancelar();
            this.getDataTableGrupo();
            this.id_grupo = undefined;
            this.toastr.success(res['message']);
          },error=>{
            this.lcargando.ctlSpinner(false);
          })
        }
      });
    }
  } */




  handleFileInputFichaEmpleado(file: FileList) {
    this.fileToUpload = file.item(0);
    //console.log(this.fileToUpload);
    //Show image preview
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.fileBase64 = event.target.result;
      this.nameFile = this.fileToUpload.name;

      this.folderDigitalForm.archivo_base_64 = event.target.result;
      this.folderDigitalForm.nombre_archivo = this.fileToUpload.name;
      this.registerForm.get('fg_nombre_archivo_input').setValue( this.fileToUpload.name);
      this.folderDigitalForm.extension =  this.fileToUpload.name.split('.').pop();
      this.folderDigitalForm.peso_archivo =  this.fileToUpload.size;

    };

    reader.readAsDataURL(this.fileToUpload);
  }

  /**
   * fecha de modificacion
   * @param $fModif
   * @returns
   */
  defaultFechaModificacion($fModif)
  {
    if($fModif) return $fModif;

    return '-';
  }

  descargarDocumentoDigital($data)
  {
    // console.log($data.archivo_base_64);
    // const linkSource = `data:${contentType};base64,${base64Data}`;
    const linkSource = $data.archivo_base_64;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = $data.nombre_archivo;
    downloadLink.click();
  }

  tamanioArchivoConvert($data)
  {
    let fileSize = $data.toString();

    if(fileSize.length < 7) return `${Math.round(+fileSize/1024).toFixed(2)} kb`
        return `${(Math.round(+fileSize/1024)/1000).toFixed(2)} MB`
  }

  cancel($notDeleteParameter) {

    this.submitted = false;
    if($notDeleteParameter == 'yes'){
      this.folderDigitalForm.id_empleado = 0;
      this.folderDigitalForm.full_nombre_empleado = '';
    }

    this.registerForm.get('fg_nombre_archivo_input').setValue('');

    /* this.folderDigitalForm.nombre_archivo = '';
    this.folderDigitalForm.id_doc_ficha = 0;
    this.folderDigitalForm.tipo_archivo_id = 0;
    this.folderDigitalForm.extension = '';
    this.folderDigitalForm.peso_archivo = 0;
    this.folderDigitalForm.archivo_base_64 = '';
    this.folderDigitalForm.fecha_creacion = null;
    this.folderDigitalForm.fecha_modificacion = null; */

    // this.viewSelectionTipoArchivoCC("0");
    this.tipo_archivo_id_cc = '0';
    // this.registerForm.reset();
    this.actions = { btnGuardar: true, btnMod: false };
    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = true;
    this.vmButtons[2].habilitar = true;
  }
}
