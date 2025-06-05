import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  HostListener,
} from "@angular/core";
import { SubidaService } from "./subida.service";
import { ToastrService } from "ngx-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CcSpinerProcesarComponent } from "src/app/config/custom/cc-spiner-procesar.component";
import Botonera from "src/app/models/IBotonera";
import * as moment from "moment";
import Swal from "sweetalert2";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

import * as myVarGlobals from "src/app/global";
import { CommonService } from "src/app/services/commonServices";
import { resolveCname } from "dns";
import { HttpResponse } from "@angular/common/http";

@Component({
standalone: false,
  selector: "app-subida",
  templateUrl: "./subida.component.html",
  styleUrls: ["./subida.component.scss"],
})
export class SubidaComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;


  @ViewChild("inputFile") fileUpload: ElementRef;
  vmButtons: Botonera[] = [];
  dataUser: any;
  fileName: any;
  tipo_medio: any;
  numero_medio: any;
  tipoDoC: any;
  permissions: any;
  nombretipoDocumentoEncontrado: any;
  lst_tipoDoC: any;
  tienefisico: any;
  dataForms: any;
  rutaFinal: any;
  bloquear: any;
  previewUrl: SafeResourceUrl | null = null;
  isImage: boolean = false;
  arrayToUpload: any[] = [];
  conteodepaginas: any[] = [];
  conteodepaginasnum: any;
  tablaGuardadoConExito: any[] = [];
  dataBodega: any;
  bodegaSelect: any;
  bodega: any;
  ubicacion: any;
  dataubicacion: any;
  actualpreview: any;
  estadoDevList = [

    { value: "1", label: "Folder" },
    { value: "2", label: "Carton" },
  ]

  arrayToUploadtempo: any[] = [];
  file: File | null = null;
  prueba: any;
  constructor(
    private sanitizer: DomSanitizer,
    private commonService: CommonService,
    private subidaService: SubidaService,
    private apiService: SubidaService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private commonSrv: CommonService
  ) {
    this.vmButtons = [
      {
        orig: "btnsSubida",
        paramAccion: "",
        boton: { icon: "fas fa-save", texto: "GUARDAR" },
        clase: "btn btn-sm btn-success",
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: true,
      },
      {
        orig: "btnsSubida",
        paramAccion: "",
        boton: { icon: "fas fa-eraser", texto: "LIMPIAR" },
        clase: "btn btn-sm btn-warning",
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: false,
      },
    ];
    setTimeout(() => {
      this.getDatosIniciales();
      this.validaPermisos();
      this.getBodegas();
      this.getCatalogos();
      this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    }, 10);
  }

  ngOnInit(): void {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    console.log("thisdatausermn", this.dataUser);
    console.log("xa");
  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case "GUARDAR":
        this.saveDocumentos();
        break;
      case "MODIFICAR":
        break;
      case "BUSCAR":
        break;
      case "LIMPIAR":
        this.limpiar();
        break;

      default:
        break;
    }
  }

  resetInput() {
    this.fileUpload.nativeElement.value = null;
    this.fileUpload.nativeElement.click();
  }

  previewFile(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        this.isImage = true;
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            e.target.result
          );
        };
        reader.readAsDataURL(file);
      } else if (file.type === "application/pdf") {
        this.isImage = false;
        this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          URL.createObjectURL(file)
        );
      } else if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        this.isImage = false;
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const docxData = e.target.result;
          const blob = new Blob([docxData], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });
          const url =
            "https://docs.google.com/gview?url=" +
            encodeURIComponent(URL.createObjectURL(blob)) +
            "&embedded=true";
          this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        };
        reader.readAsDataURL(file);
      } else if (file.type === "application/dif") {
        // Manejar archivo .dif
        alert("No se puede previsualizar archivos .dif");
      } else {
        alert("Formato de archivo no compatible");
      }
    }
  }

  seleccionarpreview(event: any) {
    if (this.actualpreview == event) {
      return
    }
    const file = event.file;
    if (file) {
      if (file.type.startsWith("image/")) {
        this.isImage = true;
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            e.target.result
          );
        };
        reader.readAsDataURL(file);
      } else if (file.type === "application/pdf") {
        this.isImage = false;
        this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          URL.createObjectURL(file)
        );
      } else if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        this.isImage = false;
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const docxData = e.target.result;
          const blob = new Blob([docxData], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });
          const url =
            "https://docs.google.com/gview?url=" +
            encodeURIComponent(URL.createObjectURL(blob)) +
            "&embedded=true";
          this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        };
        reader.readAsDataURL(file);
      } else if (file.type === "application/dif") {
        // Manejar archivo .dif
        alert("No se puede previsualizar archivos .dif");
      } else {
        alert("Formato de archivo no compatible");
      }
    }
    this.actualpreview = event;
  }

  eliminarElemento(item: any): void {
    const index = this.arrayToUpload.indexOf(item);
    if (index !== -1) {
      this.arrayToUpload.splice(index, 1);
    }
    if (this.arrayToUpload.length === 0) {
      this.vmButtons[0].habilitar = true;
    }
  }

  getDatosIniciales() {
    let data = {};
    this.lcargando.ctlSpinner(true);
    this.subidaService.getTipoDocumentos(data).subscribe(
      (res) => {
        console.log(res);
        this.lcargando.ctlSpinner(false);
        this.lst_tipoDoC = res["data"];
      },
      (error) => {
        this.toastr.info(error.message);
        this.lcargando.ctlSpinner(false);
      }
    );
  }

  selectTipoDocumento(event) {
    this.lcargando.ctlSpinner(true);
    this.tipoDoC = event;
    this.rutaFinal = [];
    this.limpiar();

    const tipoDocumentoEncontrado = this.lst_tipoDoC.find(
      (doc) => doc.id_tipo_documento === this.tipoDoC
    );

    // Verificar si se encontró el tipo de documento
    if (tipoDocumentoEncontrado) {
      // Acceder al campo 'fisico' del objeto encontrado

      this.tienefisico = tipoDocumentoEncontrado.fisico;
    } else {
      // Manejar el caso en que no se encuentre el tipo de documento
      this.tienefisico = "NO"; // O cualquier otro valor predeterminado que desees asignar
    }
    this.nombretipoDocumentoEncontrado = this.lst_tipoDoC.find(
      (doc) => doc.id_tipo_documento === this.tipoDoC
    );
    let data = { tipoDoc: this.tipoDoC };
    this.subidaService.getOrdenCampos(data).subscribe(
      (res) => {
        this.lcargando.ctlSpinner(false);

        this.dataForms = res["data"]["tipoDocumento"];
        console.log(this.dataForms, "this.dataForms");
        this.rutaFinal = res["data"]["ruta"];
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.toastr.info(error.message);
        this.lcargando.ctlSpinner(false);
      }
    );

  }

  validaPermisos() {
    this.lcargando.ctlSpinner(true);
    let params = {
      codigo: myVarGlobals.fCPSolici,
      id_rol: this.dataUser.id_rol,
    };

    this.commonSrv.getPermisionsGlobas(params).subscribe(
      (res) => {
        this.permissions = res["data"][0];
        if (this.permissions.ver == "0") {
          this.lcargando.ctlSpinner(false);
          this.toastr.warning("No tiene permisos para ver este formulario.");
          this.vmButtons = [];
        }
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  } contarpaginas(event): Promise<number> {
    return new Promise((resolve, reject) => {
      const file = event;
      if (!file) {
        reject(new Error('No se ha seleccionado ningún archivo.'));
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const buffer = e.target.result as ArrayBuffer;
        const arrayBuffer = new Uint8Array(buffer);
        // Función para contar páginas del PDF
        function countPDFPages(arrayBuffer) {
          // Encuentra el número de páginas buscando /Type /Page en el contenido del PDF
          const content = new TextDecoder().decode(arrayBuffer);
          const pageCount = (content.match(/\/Type[\s]*\/Page[^s]/g) || []).length;
          return pageCount;
        }
        // Llama a la función para contar las páginas
        const pageCount = countPDFPages(arrayBuffer);
        resolve(pageCount);
      };

      reader.onerror = (event) => {
        reject(new Error('Error al leer el archivo.'));
      };

      reader.readAsArrayBuffer(file);
    });
  }


  handleInputFile(event) {

    this.vmButtons[0].habilitar = false;
    this.lcargando.ctlSpinner(true);
    console.log(event.target.files[0]);
    const inputElement = event.target;
    // Verificamos si hay archivos seleccionados

    if (inputElement.files.length > 0) {
      if (inputElement.files.length > 1) {
        // Iteramos sobre cada archivo seleccionado
        for (let i = 0; i < inputElement.files.length; i++) {
          const file = inputElement.files[i];

          //const file = inputElement.files[0];
          if (file) {
            // Validamos el tamaño del archivo
            const maxSizeInBytes = 4 * 1024 * 1024; // 8 megabytes en bytes
            if (file.size > maxSizeInBytes) {
              // El archivo excede el tamaño máximo permitido
              /// alert();
              this.toastr.warning(
                "El archivo " +
                file.name +
                " excede el tamaño máximo permitido de 4 megabytes."
              );
              this.lcargando.ctlSpinner(false);
              continue; // Salimos de la función
            }
          }
          this.contarpaginas(file)
            .then((pageCount) => {
              console.log("paginastotalesdelpdf", pageCount);
              let reader = new FileReader();
              reader.onload = (e) => {
                const text = e.target.result as string;

                // Contamos el número de páginas del PDF
                const count = (text.match(/\/Type[\s]*\/Page[^s]/g) || []).length;
                console.log(e.target);
                let base64Data = e.target.result;
                let data = {
                  file: file,
                  nombre: file.name,
                  ruta: "ruta por especificar/" + file.name,
                  base64: base64Data,
                  size: this.formatFileSize(file.size),
                  count: pageCount,
                };

                this.dataForms.forEach((campo) => {
                  data[campo.campo_indice] = ""; // campo_indice contiene los nombres de los campos dinámicos
                });

                this.arrayToUpload.push(data);

                if (i === inputElement.files.length - 1) {
                  // Si es el último archivo, detener el spinner y actualizar la vista
                  this.lcargando.ctlSpinner(false);
                }
              };
              reader.readAsDataURL(file);
            })
            .catch((error) => {
              this.lcargando.ctlSpinner(false);
              console.error(error);
            });

        }
      } else {
        if (inputElement.files.length > 0) {
          this.file = inputElement.files[0];
          const file = inputElement.files[0];
          console.log(this.file);
          if (file) {
            this.previewFile(event);
            // Validamos el tamaño del archivo
            const maxSizeInBytes = 4 * 1024 * 1024; // 8 megabytes en bytes
            if (file.size > maxSizeInBytes) {
              // El archivo excede el tamaño máximo permitido
              this.toastr.warning(
                "El archivo " +
                this.file.name +
                " excede el tamaño máximo permitido de 4 megabytes."
              );
              this.lcargando.ctlSpinner(false);
              return; // Salimos de la función
            }
          }

          this.contarpaginas(file)
            .then((pageCount) => {
              console.log("paginastotalesdelpdf", pageCount);

              const reader = new FileReader();
              reader.onload = (e) => {
                const base64Data = e.target.result as string;
                const data = {
                  file: file,
                  nombre: file.name,
                  ruta: "ruta por especificar/" + file.name,
                  base64: base64Data,
                  size: this.formatFileSize(file.size),
                  count: pageCount,
                };
                this.dataForms.forEach((campo) => {
                  data[campo.campo_indice] = ""; //campo_indice contiene los nombres de los campos dinámicos
                });
                this.arrayToUpload.push(data);
                console.log();
                this.fileName = file.name;
              };
              reader.readAsDataURL(file);
              this.lcargando.ctlSpinner(false);
            })
            .catch((error) => {
              this.lcargando.ctlSpinner(false);
              console.error(error);
            });

        }
        this.lcargando.ctlSpinner(false);
      }
    }
  }

  formatFileSize(bytes: number): string {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes == 0) return "0 Byte";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i];
  }

  bloquearSignos(event: KeyboardEvent) {
    // Verifica si la tecla presionada es + o -
    if (event.key === '+' || event.key === '-') {
        // Previene el comportamiento predeterminado para bloquear la entrada de + y -
        event.preventDefault();
    }
  }

  saveDocumentos() {
    this.lcargando.ctlSpinner(true);

    if (this.tipoDoC == undefined) {
      this.toastr.info("Debe seleccionar tipo de documento");
      this.lcargando.ctlSpinner(false);
      return;
    }

    let resultadoValidacion = this.validarCamposVacios();
    if (resultadoValidacion) {
        let indice = resultadoValidacion.indice;
        let campoVacio = resultadoValidacion.campo;
        this.toastr.info("El campo '" + campoVacio + "' está vacío en la línea " + (indice + 1) + ".");
        this.lcargando.ctlSpinner(false);
        return;
    }/*


    let campoVacio = this.validarCamposVacios();
    if (campoVacio) {
      this.toastr.info("El campo '" + campoVacio + "' está vacío.");
      this.lcargando.ctlSpinner(false);
      return;
    } */
    console.log(this.bodega);
    console.log(this.ubicacion);

    if (this.tienefisico == "SI") {
      if (this.tipo_medio == undefined || this.tipo_medio == "") {
        this.toastr.info("Debe seleccionar tipo de medio");
        this.lcargando.ctlSpinner(false);
        return;
      }

      if (this.numero_medio == undefined || this.numero_medio == "") {
        this.toastr.info("Debe insertar un numero");
        this.lcargando.ctlSpinner(false);
        return;
      }

      this.bodega = null;
      this.ubicacion = null;
    } else {
      this.tipo_medio = null;
      this.numero_medio = null;
      this.bodega = null;
      this.ubicacion = null;
    }

    let rutaFinalArray = this.rutaFinal.map((item) => item.campo_indice);
    let arrayFechasConfiguracion = this.rutaFinal// this.rutaFinal.filter(item => item.tipo_dato === "date");//.map((item) => item.campo_indice); tipo_dato "date"
    this.arrayToUpload.forEach((item) => {
      let ruta = "";//rutaFinalArray
      arrayFechasConfiguracion.forEach((campo, index) => {
        if (index !== 0) {
          ruta += "/";
        }
        if (campo.tipo_dato == "date") {

          if (campo.anio_dir) {

            let anio = new Date(item[campo.campo_indice]).getFullYear();
            ruta += "anio_" + anio;
            if (campo.mes_dir) ruta += "/"
          }
          if (campo.mes_dir) {

            let mes = new Date(item[campo.campo_indice]).getMonth() + 1;
            let mesString = mes < 10 ? '0' + mes : mes; // Agregar 0 si el mes es menor que 10
            ruta += "mes_" + mesString;
            if (campo.dia_dir) ruta += "/"
          }
          if (campo.dia_dir) {

            let dia = new Date(item[campo.campo_indice]).getDate();
            let diaString = dia < 10 ? '0' + dia : dia; // Agregar 0 si el día es menor que 10
            ruta += "dia_" + diaString; //
          }


        } else {

          ruta += campo.campo_indice + "_" + item[campo.campo_indice];
        }
      });
      item["ruta"] = "/" + ruta;
    });
    if (this.validarRepetidos(this.arrayToUpload)) {
      this.toastr.warning(
        "Se encontraron elementos repetidos en el formulario."
      );
      this.lcargando.ctlSpinner(false);
      return;
    }

    this.arrayToUploadtempo = this.arrayToUpload;
    this.arrayToUploadtempo.forEach((item) => {
      delete item["base64"]; // Elimina el campo base64
      item["base64"] = "No se envía base64";
    });

    this.subidaArchivos();
  }

  subidaArchivos() {
    let data = {
      module: 20,
      component: 1,
      identifier: 1,
      id_controlador: 1,
      accion: `Nuevo prueba de subida `,
      ip: this.commonService.getIpAddress(),
      custom1: "INF-PROVEEDOR",
      id_usuario: Number(this.dataUser?.id_usuario),
      bodega: null,
      ubicacion: null,
      tipo_medio: null,
      numero_medio: null,
    };
    // Verificar y guardar los valores de bodega y ubicacion si no son undefined o vacíos
    if (
      this.tipo_medio !== undefined &&
      this.tipo_medio !== "" &&
      this.tipo_medio !== "undefined"
    ) {
      data.tipo_medio = this.tipo_medio;
    }

    if (
      this.numero_medio !== undefined &&
      this.numero_medio !== "" &&
      this.numero_medio !== "undefined"
    ) {
      data.numero_medio = this.numero_medio;
    }



    if (
      this.bodega !== undefined &&
      this.bodega !== "" &&
      this.bodega !== "undefined"
    ) {
      data.bodega = this.bodega;
    }

    if (
      this.ubicacion !== undefined &&
      this.ubicacion !== "" &&
      this.ubicacion !== "undefined"
    ) {
      data.ubicacion = this.ubicacion;
    }

    this.arrayToUploadtempo.forEach((element) => {
      data = {
        ...data,
        ...element,
        datosparallenar: element,
        tipoDoc: this.tipoDoC,
        dataForms: this.dataForms,
        nombreDoc: this.nombretipoDocumentoEncontrado,
      };
      this.UploadService(element.file, data);
    });
  }

  validarRepetidos(array) {
    var repetidosEncontrados = false;
    for (var i = 0; i < array.length; i++) {
      array[i].repetido = false;
    }

    // Recorremos el array para comparar cada objeto con los demás
    for (var i = 0; i < array.length; i++) {
      var objetoActual = array[i];

      //    // Marcamos el objeto actual como no repetido inicialmente
      //  objetoActual.repetido = false;

      for (var j = i + 1; j < array.length; j++) {
        var objetoComparado = array[j];
        // objetoComparado.repetido = false;
        // Si encontramos un objeto igual, marcamos ambos como repetidos
        if (this.sonObjetosIguales(objetoActual, objetoComparado)) {
          objetoActual.repetido = true;
          objetoComparado.repetido = true;
          repetidosEncontrados = true;
        }
      }
    }

    return repetidosEncontrados;
  }

  sonObjetosIguales(objeto1, objeto2) {
    // Comprobar si ambos objetos tienen el mismo número de propiedades
    if (Object.keys(objeto1).length !== Object.keys(objeto2).length) {
      return false;
    }
    // Iterar sobre las propiedades de un objeto y comparar con el otro objeto
    for (var propiedad in objeto1) {
      if (objeto1.hasOwnProperty(propiedad)) {
        // Excluir la comparación del campo "file"
        if (propiedad === "file") {
          continue;
        }
        // Verificar si la propiedad está presente en ambos objetos
        if (!objeto2.hasOwnProperty(propiedad)) {
          return false;
        }
        // Verificar si los valores de las propiedades son iguales
        if (objeto1[propiedad] !== objeto2[propiedad]) {
          return false;
        }
      }
    }

    return true;
  }

  UploadService(file, payload?: any): void {
    console.log("pay", payload);
    this.subidaService.uploadAnexo(file, payload).subscribe(
      (res: any) => {
        if (res instanceof HttpResponse) {
          console.log("res", res.body);

          if (res.body.data?.mensaje == 'existe') {
            this.toastr.info(res.body.data?.mensaje_detalle);
          } else {
            if (res.body.code == 200) {
              this.tablaGuardadoConExito.push(payload.datosparallenar);
              this.arrayToUpload = this.arrayToUpload.filter(item => !this.sonObjetosIguales(item, payload.datosparallenar));

              this.toastr.info(res.body.message);
            } else {
              this.toastr.info(res.body.message);
            }
          }
          this.lcargando.ctlSpinner(false);
          if (this.arrayToUpload.length == 0) {
            this.bloquear = true;
            this.vmButtons[0].habilitar = true;
          }
        }
      },
      (err) => {
        console.log("errerrerrerr", err);
        if (err.error.message == "mkdir(): File exists") {
          this.toastr.warning("existe un problema al crear ruta vuelva a intentar");
        } else {
          this.toastr.warning(err);
        }
        this.lcargando.ctlSpinner(false);
      }
    );
  }
  validarCamposVacios() {
    console.log("validadndo")
    let datosObligatorios = this.dataForms.filter((array) => array.es_obligatorio == "SI");
    let datosObligatoriosOnlyCampo = datosObligatorios.map((item) => item.campo_indice);
    let rutaFinalArray = this.rutaFinal.map((item) => item.campo_indice);

    for (let i = 0; i < this.arrayToUpload.length; i++) {
        let item = this.arrayToUpload[i];
        let campoVacio = rutaFinalArray.find((campo) => !item[campo]);
        if (campoVacio) {
            return { campo: campoVacio, indice: i }; // Retorna el nombre del campo vacío y su índice si se encuentra uno
        }
        let campoVacio2 = datosObligatoriosOnlyCampo.find((campo) => !item[campo]);
        if (campoVacio2) {
            return { campo: campoVacio2, indice: i }; // Retorna el nombre del campo vacío y su índice si se encuentra uno
        }
    }
    return null;
}
  /* validarCamposVacios() {
    console.log("validadndo")
    let datosObligatorios = this.dataForms.filter((array) => array.es_obligatorio == "SI");
    let datosObligatoriosOnlyCampo = datosObligatorios.map((item) => item.campo_indice);
    let rutaFinalArray = this.rutaFinal.map((item) => item.campo_indice);

    for (let item of this.arrayToUpload) {
      let campoVacio = rutaFinalArray.find((campo) => !item[campo]);
      if (campoVacio) {
        return campoVacio; // Retorna el nombre del campo vacío si se encuentra uno
      }
      let campoVacio2 = datosObligatoriosOnlyCampo.find((campo) => !item[campo]);
      if (campoVacio2) {
        return campoVacio2; // Retorna el nombre del campo vacío si se encuentra uno
      }

    }



    return null; // Retorna null si no se encuentra ningún campo vacío
  } */

  limpiar() {
    this.previewUrl = "";
    this.bloquear = false;
    this.limpiarFrame();
    this.arrayToUpload = []; this.tablaGuardadoConExito = [];
    this.fileName = "";
    this.file = null;
    this.vmButtons[0].habilitar = true;
  }

  limpiarFrame() {
    const iframe = document.getElementById("preview") as HTMLIFrameElement;
    iframe.setAttribute("src", "");
  }

  getBodegas() {
    let filter = {
      nombre_bodega: null,
      filterControl: "",
    };

    let paginate = {
      length: 0,
      perPage: 1000,
      page: 1,
      pageSizeOptions: [5, 10],
    };

    let data = {
      params: {
        filter: filter,
        paginate: paginate,
      },
    };
    this.subidaService.getInformationDig(data).subscribe(
      (res) => {
        /*  this.lcargando.ctlSpinner(false); */
        console.log("bodegas", res);
        this.dataBodega = res["data"]["data"];
        console.log(this.dataBodega);
        /* this.getStockXCeller(); */
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        //this.processing = true;
      }
    );
  }

  getUbicaciones(x, y) {
    this.lcargando.ctlSpinner(true);
    console.log(x);
    console.log(y);
    let filter = {
      nombre_bodega: null,
      fk_bodega_cab: y,
    };

    let paginate = {
      length: 0,
      perPage: 1000,
      page: 1,
      pageSizeOptions: [5, 10],
    };
    let data = {
      params: {
        filter: filter,
        paginate: paginate,
      },
    };
    this.subidaService
      .getEstrutureDig(data) //getEstruture
      .subscribe(
        (res) => {
          this.lcargando.ctlSpinner(false);
          this.dataubicacion = res["data"]["data"];

          this.lcargando.ctlSpinner(false);
        },
        (error) => {
          console.log(error);
          this.lcargando.ctlSpinner(false);
        }
      );
  }

  async getCatalogos() {
    let response: any = await this.apiService.getCatalogo({ params: "'TIPO_MEDIO'" })
    this.estadoDevList = response.TIPO_MEDIO
  }

}
