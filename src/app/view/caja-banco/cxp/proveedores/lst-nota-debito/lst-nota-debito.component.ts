import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { CcSpinerProcesarComponent } from '../../../../../config/custom/cc-spiner-procesar.component';
import { ValidacionesFactory } from '../../../../../config/custom/utils/ValidacionesFactory';
import { ProveedoresService } from '../proveedores.service';

@Component({
standalone: false,
  selector: 'app-lst-nota-debito',
  templateUrl: './lst-nota-debito.component.html',
  styleUrls: ['./lst-nota-debito.component.scss']
})
export class LstNotaDebitoComponent implements OnInit {

  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  vmButtons: any = [];
  validaciones: ValidacionesFactory = new ValidacionesFactory();

  constructor(
    private provSrv: ProveedoresService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<LstNotaDebitoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {

    this.vmButtons = [
      { orig: "btnLstND", paramAccion: "", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: false, imprimir: false}

    ];


    setTimeout(() => {
      this.obtenerNotas();
    }, 10);

  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "CERRAR":
        this.dialogRef.close(false);
        break;
    }   
  }

  dtOptions: any = {};
  dtTrigger = new Subject();
  listado:any = [];
  obtenerNotas() {
    let data = { fields: ["TIPO PAGO CHEQUE", "FORMA PAGO PROVEEDOR"] };

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 8,
      search: true,
      paging: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    }

    this.mensajeSppiner = "Cargando...";
    this.lcargando.ctlSpinner(true);
    this.provSrv.getNotasDebito(data).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.listado = res['data'];
      console.log("this.listado: ", this.listado)

      setTimeout(() => {
        this.dtTrigger.next(null);
      }, 50);

    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  seleccionarNota(valor:any){
    console.log("seleccionarNota: ", valor);
    this.dialogRef.close(valor);
  }

}
