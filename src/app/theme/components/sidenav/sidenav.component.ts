import { Component, OnInit, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { DefaultServices } from 'src/app/containers/default-layout/default-layout.services';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { MenuService } from '../menu/menu.service';

@Component({
standalone: false,
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ MenuService ]
})
export class SidenavComponent implements OnInit {

  @Input('dataUser') dataUser:any;
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  public psConfig: PerfectScrollbarConfigInterface = {
    wheelPropagation:true
  };
  public menuItems:Array<any>;
  public settings: Settings;

  constructor(private services: DefaultServices,public appSettings:AppSettings, public menuService:MenuService){
      this.settings = this.appSettings.settings; 
  }

  navItems: any = [];
  presentar: boolean = false;
  ngOnInit() {     

    setTimeout(() => {
      let data = {
        id_rol: this.dataUser.id_rol,
        id_usuario: this.dataUser.id_usuario
      }
      this.lcargando.ctlSpinner(true);
      this.services.getMenu(data).subscribe(resp => {
        this.navItems = resp['data'];
        let menuArmado:any = [];
        this.navItems.forEach((element:any,index) => {
          // this.lcargando.ctlSpinner(false);
          let menuPlus:any = {
            hasSubMenu: element.submenu == "S",
            href: null,
            icon: element.icono,
            id: element.codigo,
            parentId: element.codigo_padre == 0 ? "0": Number(element.codigo_padre),
            routerLink: element.ruta,
            target: null,
            title: element.nombre
          };
          menuArmado.push(menuPlus);
        });      
        this.menuItems = menuArmado;   
        this.presentar = true;
        /*plantilla*/
  
        this.lcargando.ctlSpinner(false);
      }, error => {
        console.log(error)
        // this.lcargando.ctlSpinner(false);
      })
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
    let menu = document.getElementById("vertical-menu");
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

}
