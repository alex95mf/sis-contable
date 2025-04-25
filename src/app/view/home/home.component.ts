import { Component, OnInit, ElementRef,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HomeServices } from './home.service'
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from '../../config/custom/cc-spiner-procesar.component';
import {CommonService} from '../../services/commonServices'
import { ApiServices } from '../../services/api.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  usuarios: any;
  password: any;
  correos: any;
  vmButtons: any = [];
  ipSend:any ;

  constructor(private router: Router, private elementRef: ElementRef, private homeservices: HomeServices,
    private toastr: ToastrService, private comSrv: ApiServices) 
     {
      this.homeservices.getIpAddress().subscribe(res => {
        this.ipSend = res;
        this.ipSend = this.ipSend.ip;
      })
     }

  ngOnInit() {
    this.vmButtons = [
      { orig: "btnsenvioData", paramAccion: "", boton: { icon: "fas fa-share-square", texto: "ENVIAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsenvioData", paramAccion: "", boton: { icon: "fas fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false, imprimir: false},
    ];
    let dataUser = JSON.parse(localStorage.getItem('Datauser'));
  }

  login() {
    this.lcargando.ctlSpinner(true);
    let data = {
      user: this.usuarios,
      pass: this.password,
      ip: this.ipSend,
      id_controlador:100
    }
    this.homeservices.getLogin(data).subscribe(res => {
      localStorage.setItem('Datauser', JSON.stringify(res['data']));
      this.homeservices.setToken(res['data']['token']);
      this.router.navigateByUrl('');
      this.lcargando.ctlSpinner(false);
    }, error => {
      this.toastr.info(error.error.message);
      this.lcargando.ctlSpinner(false);
    })
  }

  
	metodoGlobal(evento: any) {
		switch (evento.items.boton.texto) {
			case "ENVIAR":
        this.recoveredPassword();
			break;
      case "CERRAR":
      this.closeModal();
      break;
  }
	}

  closeModal() {
    ($("#exampleModal") as any).modal("hide");
    this.correos = undefined;
    }
    
  recoveredPassword() {
    if (this.correos == undefined || this.correos == "") {
      this.toastr.info("Debe Ingresar correo registrado!!");
    } else {
      let data = {
        email: this.correos
      }
      this.homeservices.getCorreo(data).subscribe(res => {
        this.correos = "";
        this.toastr.success("Revise su bandeja de entrada en " + this.correos + ", su contraseña fue enviada exitosamente");
      }, error => {
        this.correos = "";
        this.toastr.info(error.error.message);
      })
    }
  }

  enterData(event) {
    let key = (event.which) ? event.which : event.keyCode;
    if (key == 13) {
      this.login();
    }
  }
}
