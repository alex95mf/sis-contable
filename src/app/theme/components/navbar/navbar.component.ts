import { Component, OnInit, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { DefaultServices } from 'src/app/containers/default-layout/default-layout.services';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { MenuService } from '../menu/menu.service';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services'; 
import { Socket } from 'src/app/services/socket.service'; 
import { CookieService } from "ngx-cookie-service";
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ MenuService ]
})
export class NavbarComponent implements OnInit {

  @Input('dataUser') dataUser:any;
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  public psConfig: PerfectScrollbarConfigInterface = {
    wheelPropagation:true
  };
  public menuItemsHori:Array<any>;
  public settings: Settings;
  arraytempo:any = [];
  presentarFavorito:boolean = false;

  constructor(private services: DefaultServices,public appSettings:AppSettings, public menuService:MenuService ,public commonSrv: CommonService,
    private commonVarSer: CommonVarService,private socket: Socket, private cookies: CookieService,private router: Router){
      this.settings = this.appSettings.settings; 
  }

  navItems: any = [];
  presentar: boolean = false;
  ngOnInit() {     

    setTimeout(() => {
      let data = {
        id_rol: this.dataUser.id_rol,
        id_usuario: this.dataUser.id_usuario
    };
    this.lcargando.ctlSpinner(true);
    this.services.getMenu(data).subscribe(resp => {
      console.log("aqui inicia")
        let menuArmado = [];
        resp['data'].forEach((element:any,index) => {
        this.lcargando.ctlSpinner(false);
        let menuPlus:any = {
          id: element.codigo,
          hasSubMenu: element.submenu == "S" ,
          href: null,
          icon: element.icono,
          parentId: element.codigo_padre == 0 ? "0": Number(element.codigo_padre),
          routerLink: element.ruta,
          target: null,
          title: element.nombre
        };
        this.arraytempo.push(menuPlus);
        console.log("aqui push")
      }); 
        
      console.log("athis.menuItemsHoriqui push",this.menuItemsHori)
        this.menuItemsHori = this.arraytempo//menuArmado;
        this.presentarFavorito = true;
    }, error => {
        console.log(error);
        this.lcargando.ctlSpinner(false);
        this.logout();
    });
    }, 10);
  }

  ngDoCheck(){
    if(this.settings.fixedSidenav){
      if(this.psConfig.wheelPropagation == true){
        this.psConfig.wheelPropagation = false;
      }      
    }
    else{
      if(this.psConfig.wheelPropagation == false){
        this.psConfig.wheelPropagation = true;
      }  
    }
  }

  public closeSubMenus(){
    let menu = document.getElementById("horizontal-menu");
    if(menu){
      for (let i = 0; i < menu.children[0].children.length; i++) {
        let child = menu.children[0].children[i];
        if(child){
          if(child.children[0].classList.contains('expanded')){
              child.children[0].classList.remove('expanded');
              child.children[1].classList.remove('show');
          }
        }
      }
    }
  }

  logout() {
    let data = {
      id_usuario: this.dataUser['id_usuario'],
      id_controlador:100,
      id_sucursal: this.dataUser['id_sucursal'],
      id_empresa: this.dataUser['id_empresa'],
      ip:this.commonSrv.getIpAddress() ?? '127.0.0.1'
    }
    this.services.logout(data).subscribe(res => {
      this.socket.onEmitDisconnected(this.dataUser['id_usuario']);
      localStorage.removeItem("Datauser");
      localStorage.removeItem('ip');
      localStorage.removeItem('rol_seleccionado');
      localStorage.removeItem('ruta');
      localStorage.removeItem('url');
      localStorage.removeItem('userOnline');
      localStorage.removeItem('methodCobro');
      localStorage.removeItem('cxc');

      this.cookies.delete("token");
      //location.reload();
      this.router.navigateByUrl('home');
    })
  }
  

}
