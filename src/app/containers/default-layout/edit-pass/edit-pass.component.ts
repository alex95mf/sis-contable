import {  Component, OnInit, ElementRef, ViewChild,Input  } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from "../../../services/commonServices";
import { CommonVarService } from '../../..//services/common-var.services';
import { DefaultServices } from '../default-layout.services';
import { ToastrService } from "ngx-toastr";
import * as myVarGlobals from "../../../global";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { Socket } from '../../../services/socket.service';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';
import { MatDialogRef } from '@angular/material/dialog';
import { CcSpinerProcesarComponent } from '../../../config/custom/cc-spiner-procesar.component';
@Component({
standalone: false,
	selector: 'app-edit-pass',
	templateUrl: './edit-pass.component.html',
	styleUrls: ['./edit-pass.component.scss']
})
export class EditPassComponent implements OnInit {
	mensajeSpinner: string = "Cargando...";
    @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
	@ViewChild('codeInput') codeInput: ElementRef;
	passwordActuals: any;
	passwordNuevos: any;
	passwordConfirs: any;
	id_usuarios: any;
	dataUser: any;
	permisions: any;
	nameUser: any;
	file: any;
	user: any;
	id_user: any;
	arrayPass: any = [];
	vmButtons: any = [];
	@Input() dt: any;
	constructor(public activeModal: NgbActiveModal,
		private reportesSrv: DefaultServices,
		private commonService: CommonService,
		private toastr: ToastrService,
		private router: Router,
		private socket: Socket,
		private cookies: CookieService,
		private dialogRef: MatDialogRef <EditPassComponent>) {
		this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
		this.nameUser = this.dataUser.nombre;
		this.file = this.dataUser.avatar;
		this.user = this.dataUser.usuario;

	}

	ngOnInit(): void {
		this.vmButtons = [
			{ orig: "btnPass", paramAccion: "", boton: { icon: "far fa-save", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: true, imprimir: false},
			{ orig: "btnPass", paramAccion: "", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false}
		];
		setTimeout(() => {
			this.passwordActuals  = this.dt;
			document.getElementById("passNueva").style.border = "1px solid #32c1eb ";
			this.codeInput.nativeElement.focus();
			this.getPermisions();

		}, 10);
	}

	metodoGlobal(evento: any) {
		switch (evento.items.boton.texto) {
		case "GUARDAR":
		this.validatePass();
		break;
		case "CERRAR":
		this.dialogRef.close(false);
		this.closeModal();
		break;
		}
	}

	passNew() {
		if (this.passwordNuevos != undefined) {
			document.getElementById("passNueva").style.border = "none";
		}
	}

	getPermisions() {
		this.lcargando.ctlSpinner(true);
		this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
		let id_rol = this.dataUser.id_rol;
		let data = {
			codigo: myVarGlobals.fCambioPass,
			id_rol: id_rol
		}
		this.commonService.getPermisionsGlobas(data).subscribe(res => {
			this.lcargando.ctlSpinner(false);
			this.permisions = res['data'][0];
			if (res['data'][0].ver == "0") {
				this.lcargando.ctlSpinner(false);
				this.toastr.info("Usuario no tiene Permiso para Ver Formulario");
				this.router.navigateByUrl('dashboard');
			}
		}, error => {
			this.lcargando.ctlSpinner(false);
			this.toastr.info(error.error.message);
		})
	}

	async validatePass() {
		this.lcargando.ctlSpinner(true);
		if (this.permisions.modificar == "0") {
			this.lcargando.ctlSpinner(false);
			this.toastr.info("Usuario no tiene permiso para Actualizar");
		} else {
			this.lcargando.ctlSpinner(false);
			let resp = await this.validateDataGlobal().then((respuesta) => {
				if (respuesta) {
					this.lcargando.ctlSpinner(false);
					this.confirmSave("Seguro desea Actualizar Registro?", "MOD_PASS");
				}
			});
		}
	}

	// EDIT
	async confirmSave(message, action) {
		Swal.fire({
			title: "Atención!!",
			text: message,
			icon: "warning",
			showCancelButton: true,
			cancelButtonColor: "#DC3545",
			confirmButtonColor: "#13A1EA",
			confirmButtonText: "Aceptar",
		}).then((result) => {
			if (result.value) {
				if (action == "MOD_PASS") {
					this.updatePass();
				}
			}
		});
	}

	validateDataGlobal() {
		let flag = false;
		return new Promise((resolve, reject) => {
			if (this.passwordNuevos == undefined) {
				this.toastr.info("Ingrese Nueva Contraseña");
				let autFocus = document.getElementById("passNueva").focus();
			} else if (this.passwordNuevos != undefined && this.passwordConfirs == undefined) {
				this.toastr.info("Repita La contraseña Nueva");
				let autFocus = document.getElementById("passConfirPass").focus();
			} else if (this.passwordActuals == this.passwordNuevos) {
				this.toastr.info("Ingrese contraseña diferente a la Anterior");
				let autFocus = document.getElementById("passNueva").focus();
			} else if (this.passwordNuevos != this.passwordConfirs) {
				this.toastr.info("Repita la misma contraseña Nueva");
				this.passwordConfirs = ""
				let autFocus = document.getElementById("passConfirPass").focus();
			} else {
				resolve(true);
			}
		});
	}

	updatePass() {
		this.lcargando.ctlSpinner(true);
		let data = {
			id_usuario: this.dataUser.id_usuario,
			clave: this.passwordNuevos,
			ip: this.commonService.getIpAddress(),
			accion: `Actualización de contraseña del usuario ` + this.dataUser.usuario,
			id_controlador: myVarGlobals.fCambioPass,
		};
		this.reportesSrv.editPassword(data).subscribe(res => {
			this.lcargando.ctlSpinner(false);
			this.toastr.success(res["message"]);
			setTimeout(() => {
				this.dialogRef.close(false);
				this.logout();
			}, 1000);
		}, (error) => {
			this.lcargando.ctlSpinner(false);
			this.toastr.info(error.error.message);
		});
	}

	closeModal() {
		this.passwordNuevos = undefined;
		this.passwordConfirs = undefined;
		this.router.navigateByUrl('dashboard');

	}

	showPass() {
		var tipo = document.getElementById("passActual").getAttribute("type")
		if (tipo == "password") {
			document.getElementById("passActual").setAttribute("type", "text");
		} else {
			document.getElementById("passActual").setAttribute("type", "password");
		}
	}

	showPassNueva() {
		var tipo = document.getElementById("passNueva").getAttribute("type")
		if (tipo == "password") {
			document.getElementById("passNueva").setAttribute("type", "text");
		} else {
			document.getElementById("passNueva").setAttribute("type", "password");
		}
	}

	showPassConfirm() {
		var tipo = document.getElementById("passConfirPass").getAttribute("type")
		if (tipo == "password") {
			document.getElementById("passConfirPass").setAttribute("type", "text");
		} else {
			document.getElementById("passConfirPass").setAttribute("type", "password");
		}
	}

	logout() {
		this.lcargando.ctlSpinner(true);
		let data = {
			id_usuario: this.dataUser['id_usuario'],
			id_controlador:100,
			id_sucursal: this.dataUser['id_sucursal'],
			id_empresa: this.dataUser['id_empresa'],
			ip:this.commonService.getIpAddress()
		  }
		this.reportesSrv.logout(data).subscribe(res => {
			this.lcargando.ctlSpinner(false);
			this.socket.onEmitDisconnected(this.dataUser['id_usuario']);
			localStorage.removeItem("Datauser");
			localStorage.removeItem('ip');
			localStorage.removeItem('rol_seleccionado');
			this.cookies.delete("token");
			this.toastr.info("Cerrando Sesión");
			this.router.navigateByUrl('home');

		})
	}

	setPass(data){
		this.lcargando.ctlSpinner(true);
		if(data != undefined){
			this.lcargando.ctlSpinner(false);
			this.passwordNuevos = data;
			this.vmButtons[0].habilitar = false;
		}else{
			this.lcargando.ctlSpinner(false);
			this.passwordNuevos = "";
			this.vmButtons[0].habilitar = true;
		}
	}

}
