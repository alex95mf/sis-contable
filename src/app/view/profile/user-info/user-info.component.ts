import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { UserInfoService } from './user-info.service';
import * as myVarGlobals from 'src/app/global';
import { CommonService } from 'src/app/services/commonServices';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild('firmaUpload') firmaUpload: ElementRef;
  msgSpinner: string;
  permissions: any;

  userData: any = {
    avatar: "assets/img/avatars/prueba1.png",
  }
  lst_roles: any[] = [];

  constructor(
    private toastr: ToastrService,
    private apiService: UserInfoService,
    private commonServices: CommonService,
  ) {
    this.userData = JSON.parse(localStorage.getItem('Datauser'));
  }

  ngOnInit(): void {
    setTimeout(async () => {
      this.lcargando.ctlSpinner(true)
      await this.validaPermisos();

      this.lcargando.ctlSpinner(false)
    }, 0);
  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case "MODIFICAR":
        //
        break;
      case "CANCELAR":
        //
        break;

      default:
        break;
    }
  }

  async validaPermisos() {
    this.msgSpinner = 'Cargando Permisos de Usuario'

    this.lcargando.ctlSpinner(true)
    try {
      let response = await this.commonServices.getPermisionsGlobas({
        codigo: myVarGlobals.fUserProfile,
        id_rol: this.userData.id_rol,
      }).toPromise<any>()
      console.log(response);

      this.permissions = response.data[0]
      if (this.permissions.abrir == '0') {
        this.lcargando.ctlSpinner(false);
        this.toastr.warning("No tiene permisos para usar este recurso.");
        return;
      }

      await this.cargaInicial();
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error cargando Permisos de Usuario')
    }
  }

  async cargaInicial() {
    await this.getRoles();
    await this.getUsuario();
    await this.getAnexo();
  }

  async getCatalogos() {
    try {
      this.msgSpinner = 'Cargando Catalogos'
      let catalogos = await this.apiService.getCatalogos({ params: "''" })
      console.log(catalogos)
      //
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error cargando Catalogos')
    }
  }

  async getRoles() {
    try {
      this.msgSpinner = 'Cargando Roles'
      let roles = await this.apiService.getRoles()
      console.log(roles)
      //
      this.lst_roles = roles.data
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error cargando Roles')
    }
  }

  async getUsuario() {
    try {
      this.msgSpinner = 'Cargando Datos adicionales de Usuario'
      let response = await this.apiService.getUsuario({ id_user: this.userData.id_usuario })
      console.log(response)
      Object.assign(this.userData, {
        avatar: response.data[0].avatar,
        correo: response.data[0].email,
        rol: this.lst_roles.find((rol: any) => rol.id_rol == this.userData.id_rol)
      })
      //
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error cargando Datos de Usuario')
    }
  }

  async getAnexo() {
    try {
      this.msgSpinner = 'Cargando Firma Digital'
      let response = await this.apiService.getAnexos({
        module: this.permissions.id_modulo,
        component: myVarGlobals.fSeguridades,
        identifier: this.userData.id_usuario,
      })
      console.log(response)

      if (response.data.length) {
        Object.assign(this.userData, {
          firma_digital: {
            original_name: response.data[0].original_name,
            id_anexos: response.data[0].id_anexos,
            location: response.data[0].location,
            storage: response.data[0].storage,
            name: response.data[0].name,
          }
        })
      }

    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error cargando Firma Digital')
    }
  }

  async cargaFirma(event: any) {
    if (event.target.files.length > 0) {
      const file: File = event.target.files[0]

      const { value: firmaPassword } = await Swal.fire({
        titleText: 'Ingrese contraseña de Firma Digital',
        text: 'Si no desea ingresarla ahora, se le pedira cada vez que se necesite.',
        input: 'password',
        inputLabel: 'Contraseña',
        inputAttributes: {
          autocapitalize: 'off',
          autocorrect: 'off'
        }
      })

      let dataAnexo = {
        // Informacion para almacenamiento de anexo y bitacora
        module: this.permissions.id_modulo,
        component: myVarGlobals.fSeguridades,
        identifier: this.userData.id_usuario,
        custom1: (firmaPassword) ? firmaPassword : null,
        id_controlador: myVarGlobals.fSeguridades,
        accion: `Nuevo anexo Firma Digital para Usuario ${this.userData.id_usuario}`,
        ip: this.commonServices.getIpAddress(),
      }
      // console.log(dataAnexo)

      this.lcargando.ctlSpinner(true)
      try {
        this.msgSpinner = 'Almacenando Firma Digital'
        let response = await this.apiService.fileService(file, dataAnexo);
        console.log(response)

        if (response.body.data) {
          const { id_anexos, original_name, storage, name, location } = response.body.data
          Object.assign(this.userData, {
            firma_digital: { id_anexos, original_name, location, storage, name }
          })
        }
        //
        this.lcargando.ctlSpinner(false)
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error?.message, 'Error almacenando Firma Digital')
      }
    }
  }

  resetInput() {
    // Limpia el valor seleccionado para que el cambio se dispare siempre
    this.firmaUpload.nativeElement.value = null;

    // Dispara el evento de clic en el nuevo elemento de entrada de archivo
    this.firmaUpload.nativeElement.click();
  }

  async eliminarFirma({ id_anexos }) {
    let result = await Swal.fire({
      title: 'Eliminar Firma Digital',
      text: 'Seguro/a desea eliminar su Firma Digital?',
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar',
    })

    if (result.isConfirmed) {
      let data = {
        // Data del archivo
        id_anexo: id_anexos,
        component: myVarGlobals.fSeguridades,
        module: this.permissions.id_modulo,
        identifier: this.userData.id_usuario,
        // Datos para registro en Bitacora
        id_controlador: myVarGlobals.fSeguridades,
        accion: `Borrado de Anexo ${id_anexos}`,
        ip: this.commonServices.getIpAddress()
      }

      this.msgSpinner = 'Eliminando Firma Digital'
      this.lcargando.ctlSpinner(true)
      this.apiService.deleteAnexo(data).subscribe(
        () => {
          this.lcargando.ctlSpinner(false)
          Object.assign(this.userData, { firma_digital: null })
          Swal.fire('Firma Digital eliminada correctamente', '', 'success')
        },
        (err: any) => {
          console.log(err)
          this.lcargando.ctlSpinner(false)
          this.toastr.error(err.error?.message, 'Error eliminando Firma Digital')
        }
      )
    }
  }

  descargarFirma({ storage, name, original_name }) {
    this.apiService.downloadAnexo({ storage, name }).subscribe(
      (resultado) => {
        const url = URL.createObjectURL(resultado)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', original_name)
        link.click()
      },
      err => {
        console.log(err)
        this.toastr.error(err.error.message, 'Error descargando Anexo')
      }
    )
  }

  async setAvatar(event: any) {
    if (event.target.files.length > 0) {
      const file: File = event.target.files[0];
      const reader = new FileReader();
      reader.onload = async (event: any) => {
        const base64String: string = event.target.result;
        console.log(base64String);
        // Send to Backend
        let result = await Swal.fire({
          titleText: 'Modificacion de Imagen de Perfil',
          text: 'Esta seguro/a de cambiar su imagen de perfil?',
          icon: 'question',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Cambiar',
        })

        if (result.isConfirmed) {
          this.lcargando.ctlSpinner(true)
          try {
            this.msgSpinner = 'Estableciendo Imagen de Perfil'
            let response = await this.apiService.setAvatar({ avatar: base64String })
            console.log(response)
            Object.assign(this.userData, {
              avatar: response.avatar
            })
            //
            this.lcargando.ctlSpinner(false)
          } catch (err) {
            console.log(err)
            this.lcargando.ctlSpinner(false)
            this.toastr.error(err.error?.message, 'Error estableciendo Imagen de Perfil')
          }

        }
      }
      reader.readAsDataURL(file);
    }
  }

  async deleteAvatar() {
    let result = await Swal.fire({
      titleText: 'Eliminacion de Imagen de Perfil',
      text: 'Esta seguro/a de eliminar su Imagen de Perfil?',
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar',
    })

    if (result.isConfirmed) {
      const newAvatar = 'assets/img/avatars/prueba1.png';
      this.lcargando.ctlSpinner(true)
      try {
        this.msgSpinner = 'Eliminando Imagen de Perfil'
        let response = await this.apiService.setAvatar({ avatar: newAvatar })
        console.log(response)
        Object.assign(this.userData, {
          avatar: response.avatar
        })

        this.lcargando.ctlSpinner(false)
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error?.message, 'Error estableciendo Imagen de Perfil')
      }
    }
  }
}
