import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ModalNuevoAbogadoComponent } from  '../modal-nuevoAbogado/modal-nuevoAbogado.component';
import { JuiciosService } from '../juicios.service';
import { BehaviorSubject } from "rxjs";
@Component({
  selector: 'app-modal-abogados',
  templateUrl: './modal-abogados.component.html',
  styleUrls: ['./modal-abogados.component.scss']
})
export class ModalAbogadosComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @Input() juicio: any;
  fTitle: string = "Asignación de Abogados";
  msgSpinner: string;
  vmButtons: any[] = []

  abogados: any[] = []
  abogadoSelected = 0

  

  constructor(
    private activeModal: NgbActiveModal,
    private apiService: JuiciosService,
    private toastr: ToastrService,
    private commonVarService: CommonVarService,
    private commonVrs: CommonVarService,
    private modalService: NgbModal,
  ) { 

    this.commonVrs.updateAbogados.asObservable().subscribe(
      (res)=>{
        if (res) {
          // this.getAbogados();
          // console.log('daniel');
          this.abogados = [...this.abogados, res['data']]
          console.log(this.abogados);
        }
      }
    );


    /*this.commonVarSrv.seguiTicket.asObservable().subscribe(
      (res) => {
       // console.log(res);
        if (res) {
          this.cargarTicketsGlobal();
        }
      }
    )*/

    this.commonVarService.selectContribuyenteCustom.asObservable().subscribe(
      (res: any) => {
          this.juicio.fk_contribuyente = res
          //this.juicio= res;
          console.log(res);
          //this.id_cliente=res.id_cliente;
      }
    )

  }




  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsJuicioAbogado",
        paramAction: "",
        boton: { icon: "fas fa-user", texto: "ASIGNAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsJuicioAbogado",
        paramAction: "",
        boton: { icon: "fas fa-window-close", texto: "CERRAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ]
    setTimeout(() => {
      this.getJuicio()
    }, 50)
  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case "ASIGNAR":
        this.asignarAbogado()
        break;
      case "CERRAR":
        this.closeModal()
        break;
    }
  }

  getJuicio() {
    this.msgSpinner = "Cargando Juicio"
    this.lcargando.ctlSpinner(true)
    this.apiService.getJuicio(this.juicio).subscribe(
      (res: any) => {
        // console.log(res.data)
        this.juicio = res.data
        this.getAbogados()
        // this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Juicio')
      }
    )
  }

  getAbogados() {
    this.msgSpinner = "Cargando Abogados"
    // this.lcargando.ctlSpinner(true)
    this.apiService.getAbogados().subscribe(
      (res: any) => {
        // console.log(res.data)
        this.abogados = res.data
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Juicio')
      }
    )
  }

  asignarAbogado() {
    this.msgSpinner = 'Asignando Abogado'
    this.lcargando.ctlSpinner(true)
    this.apiService.asignaAbogado({juicio: this.juicio, abogado: this.abogadoSelected }).subscribe(
      (res: any) => {
        console.log(res.data)
        this.commonVarService.juicioAsignaAbogado.next(res.data)
        this.lcargando.ctlSpinner(false)
        this.closeModal()
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error asignando Abogado')
      }
    )
  }

  closeModal() {
    this.activeModal.close()
  }

  ingresoAbogado () {
    //this.closeModal();
    const modal = this.modalService.open(ModalNuevoAbogadoComponent, { size: 'xl', backdrop: 'static', windowClass: 'viewer-content-general' })
  }

}
