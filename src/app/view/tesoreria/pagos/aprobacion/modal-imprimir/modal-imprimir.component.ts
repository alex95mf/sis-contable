import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { AprobacionService } from '../aprobacion.service';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import jsPDF from 'jspdf';

@Component({
standalone: false,
  selector: 'app-modal-imprimir',
  templateUrl: './modal-imprimir.component.html',
  styleUrls: ['./modal-imprimir.component.scss']
})
export class ModalImprimirComponent implements OnInit {
  
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  validaciones = new ValidacionesFactory;

  dataUser: any;
  vmButtons: any;
  ordenesEdit: any = {};
  needRefresh: boolean = false;
  deshabilitar: boolean = false;
  empresLogo: any;

  gestOrden: any = {};
  ordenesDet: any = {};
  ordenesDetalles:any = {};
 
  conceptos: any = {};
  tipoDesembolso: any = 0;

  
  @Input() module_comp: any;
  @Input() isNew: any;
  @Input() data: any;
  @Input() permissions: any;
  @Input() fTitle: any;
  @Input() ordenes: any;
  

  estadoList = [
    {value: "A",label: "Aprobado"},
    {value: "N",label: "Negado"}
  ] 
  constructor(public activeModal: NgbActiveModal,
      private toastr: ToastrService,
      private commonSrv: CommonService,
      private aprobacionSrv: AprobacionService,
      private commonVarSrv: CommonVarService,
  ) { 
  }

  ngOnInit(): void {

    this.vmButtons = [
      {
          orig: "btnGestionModalGestion",
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
          orig: "btnGestionModalGestion",
          paramAccion: "",
          boton: { icon: "far fa-file-pdf", texto: " IMPRIMIR" },
          permiso: true,
          showtxt: true,
          showimg: true,
          showbadge: false,
          clase: "btn btn-info boton btn-sm",
          habilitar: false,
          printSection: "PrintSectionModal", imprimir: true
      },
      {
          orig: "btnGestionModalGestion",
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

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.empresLogo = this.dataUser.logoEmpresa;

    this.ordenesEdit = {
      fecha: "",
      fk_proveedor: 0,
      observacion: "",
      estado: 0,
      subtotal: 0,
      total: 0,
      saldo: 0,
      documento: "",
    }

    this.gestOrden = {
      observacion_gestion: "",
      estado: 0,
      usuarioGestion: "",
      fecha_gestion:""
    }

    

    if(!this.isNew){

    
    this.getCatalogoConceptos();
    this.ordenesEdit = JSON.parse(JSON.stringify(this.data));
    this.ordenesDet = JSON.parse(JSON.stringify(this.data['detalles']));
    //console.log(' aquiiii sub categoria '+this.ticketEdit.categoria);
    if(this.ordenesEdit.estado === 'A' || this.ordenesEdit.estado === 'N' || this.ordenesEdit.estado === 'C'){
      this.deshabilitar=true;
      this.gestOrden.estado=this.ordenesEdit.estado;
      this.gestOrden.observacion_gestion=this.ordenesEdit.observacion_gestion;
      this.gestOrden.fecha_gestion=this.ordenesEdit.fecha_gestion;
      this.gestOrden.usuarioGestion=this.ordenesEdit.usuario_gestion.nombre;

      this.gestOrden.fecha = this.ordenesEdit.fecha.split(" ")[0];
      this.gestOrden.vigencia_poliza = this.ordenesEdit.vigencia_poliza.split(" ")[0];
      this.gestOrden.fecha_gestion = this.ordenesEdit.fecha_gestion.split(" ")[0];
      
      this.vmButtons = [
       
        {
            orig: "btnGestionModalGestion",
            paramAccion: "",
            boton: { icon: "far fa-file-pdf", texto: " IMPRIMIR" },
            permiso: true,
            showtxt: true,
            showimg: true,
            showbadge: false,
            clase: "btn btn-info boton btn-sm",
            habilitar: false,
            printSection: "PrintSectionModal", imprimir: true
        },
        {
            orig: "btnGestionModalGestion",
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
    }else{

      this.vmButtons = [
       
        {
          orig: "btnGestionModalGestion",
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
            orig: "btnGestionModalGestion",
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
    }

    this.commonVarSrv.bandTrabTicket.next(null);
   
  }else{
    this.deshabilitar=false;
    this.gestOrden = {
      observacion_gestion: "",
      estado: 0,
    }
   
  }
  this.demoFromHTML();
  
 
  
  setTimeout(()=> {
    this.getCatalogoConceptos();
    //this.getCatalogoCategoria();
    //this.getCatalogoSubCategoria();
   
  }, 0);

  }
 

 
  getCatalogoConceptos() {
    let data = {
      params: "'OP_CONCEPTOS','PAG_TIPO_DESEMBOLSO'",
    };
    this.aprobacionSrv.getCatalogoConcepto(data).subscribe(
      (res) => {
        this.conceptos = res["data"]['OP_CONCEPTOS'];
        this.tipoDesembolso = res["data"]['PAG_TIPO_DESEMBOLSO']
        this.data['detalles'].forEach((p) => {
          this.conceptos.filter((c) => {
                if (c.valor === p.tipo_concepto) {
                  Object.assign(p, { valor: p.valor, descripcion:c.descripcion, comentario: p.comentario});
                }
            })
        })
        this.ordenesDetalles = JSON.parse(JSON.stringify(this.data['detalles']));
      },
      (error) => {
        this.toastr.info(error.error.message);
      }
    );
  }

 

  

  demoFromHTML() {
// console.log(data);
    
   /*var pdf = new jsPDF('portrait');
    pdf.text("Some text inside PDF", 10, 10);*/

   
     /*let pdf = new jsPDF({
       orientation: 'landscape',
       unit: 'in',
       format: [4, 2]
     })*/
     let pdf = new jsPDF();
     //var doc = new jsPDF();
     // pdf.text('This is a test',10, 10);
     // pdf.autoPrint({variant: 'javascript'});
     // pdf.save('autoprint.pdf');
 
     
      pdf.html(document.getElementById('1'),
       {   
        callback: function (pdf) {    
           //pdf.save(); 
          pdf.autoPrint();
          //pdf.output("dataurlnewwindow"); 
         // pdf.output('save', 'filename.pdf');
          $( '#docpdf' ).attr('src', pdf.output('datauristring')); 
          
          },
            x: 15,
            y: 15,
            width: 170, //target width in the PDF document
            windowWidth: 600 //window width in CSS pixels
        });
    // let elementHTML = document.querySelector("#contnet");

    // pdf.html(document.getElementById('#1'), {
    //     callback: function(pdf) {
    //         // Save the PDF
    //         pdf.save('sample-document.pdf');
    //     },
    //     x: 15,
    //     y: 15,
    //     width: 170, //target width in the PDF document
    //     windowWidth: 650 //window width in CSS pixels
    // });
      
     
     //pdf.text('Hello world!', 1, 1)
     // this.ordenesDt.forEach(c => {
       
     //   pdf.text(c.documento,20, 10);
     // })
     // let array = [1,2,3];
     // for (let i = 0; i < array.length; i++) {
     //   console.log(array[i]);
     //   pdf.text('Hello world! '+array[i],20, 10)
     // }
     // pdf.save('two-by-four.pdf')
     //$( '#docpdf' ).attr('src', pdf.output('datauristring'));
    
 }

 
 
  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
        case " REGRESAR":
            this.closeModal();
            break;
        case " GUARDAR":
            this.validaGestionOrden();
            break;
        case " IMPRIMIR":
            break;
        default:
            break;
    }
   
     
  }
 
  async validaGestionOrden() {
      let resp = await this.validaDataGlobal().then((respuesta) => {
        if(respuesta) {
            this.gestionarOrdenPago(); 
        }
      });
  }
  validaDataGlobal() {
    let flag = false;
    return new Promise((resolve, reject) => {
  
      if (
        this.gestOrden.estado == 0 ||
        this.gestOrden.estado == undefined 
      ){
        this.toastr.info("El campo Estado no puede ser vacío");
        flag = true;
      }else if(
        this.gestOrden.observacion_gestion == "" ||
        this.gestOrden.observacion_gestion == undefined 
      ) {
        this.toastr.info("El campo Observacion no puede ser vacio");
        flag = true;
      }
      !flag ? resolve(true) : resolve(false);
    })
  }

  gestionarOrdenPago() {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea guardar la gestión de la Orden de Pago seleccionada?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
      }).then((result) => {
          if (result.isConfirmed) {
              (this as any).mensajeSpinner = "Gestionando Orden de Pago...";
              this.lcargando.ctlSpinner(true);
  
              let data = {
                gestOrden: {
                  observacion_gestion: this.gestOrden.observacion_gestion,
                  estado: this.gestOrden.estado,
                }
              }
  
              this.aprobacionSrv.gestionOrdenPago(this.data.id_orden_pago,data).subscribe(
                  (res) => {
                     // console.log(res);
                      if (res["status"] == 1) {
                      this.needRefresh = true;
                      this.lcargando.ctlSpinner(false);
                      Swal.fire({
                          icon: "success",
                          title: "Orden de Pago gestionada con éxito",
                          text: res['message'],
                          showCloseButton: true,
                          confirmButtonText: "Aceptar",
                          confirmButtonColor: '#20A8D8',
                      }).then((result) => {
                        if (result.isConfirmed) {
                          this.needRefresh = true;
                          this.closeModal();
                        }
                      });
                      } else {
                      this.lcargando.ctlSpinner(false);
                      Swal.fire({
                          icon: "error",
                          title: "Error",
                          text: res['message'],
                          showCloseButton: true,
                          confirmButtonText: "Aceptar",
                          confirmButtonColor: '#20A8D8',
                      });
                      }
                  },
                      (error) => {
                          this.lcargando.ctlSpinner(false);
                          this.toastr.info(error.error.message);
                  }
              )
        }
    });
  }
  closeModal() {
    this.commonVarSrv.bandTrabTicket.next(this.needRefresh);
    this.activeModal.dismiss();
  }

}
