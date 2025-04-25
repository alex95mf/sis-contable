import { Component, OnInit, ViewChild, HostListener, ViewChildren, QueryList, ViewEncapsulation } from '@angular/core';
import { element } from 'protractor';
import { navItems } from '../../_nav';
import { DefaultServices } from './default-layout.services';
import { Router, NavigationEnd } from '@angular/router';
import { CookieService } from "ngx-cookie-service";
import { ToastrService } from 'ngx-toastr';
import 'sweetalert2/src/sweetalert2.scss';
const Swal = require('sweetalert2');
import { Socket } from '../../services/socket.service';
import { CommonService } from '../../services/commonServices'
import { CommonVarService } from '../../services/common-var.services'
import * as myVarGlobals from "../../global";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditPassComponent } from "./edit-pass/edit-pass.component";
import { ConfirmationDialogService } from '../../config/custom/confirmation-dialog/confirmation-dialog.service';

  
import { PerfectScrollbarDirective, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { rotate } from '../../theme/utils/app-animation';
import { MenuService } from '../../theme/components/menu/menu.service';
import { Menu } from 'src/app/theme/components/menu/menu.model';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  animations: [ rotate ],
  providers: [ MenuService ],
  encapsulation: ViewEncapsulation.None
})

export class DefaultLayoutComponent implements OnInit {

  public sidebarMinimized = false;
  public navItems: any = [];
  privilegio: any;
  valida: any = 0;
  arrayPrincipal: any = [];
  arrayPrincipalTwo: any = [];
  arraySecondary: any = [];
  arrayThree: any = [];
  arrayFor: any = [];
  arrayFive: any = [];
  filterData: any = [];
  filterDataTwo: any = [];
  filterDataLevelThree: any = [];
  filterDataLevelThreeTwo: any = [];
  verifyArray: any = 0;
  verifyArrayTwo: any = 0;
  objMenu: any = {};
  objMenu2: any = {};
  objMenu3: any = {};
  menuXRol: any = [];
  menuTwo: any = [];
  dataUser: any;
  nameUser: any;
  ipAddress: any;
  file: any;
  numerator: any = 0;
  destroyInterval: any;
  arrayAux: any = [];
  arrayFinal: any = [];
  user: any;

  /* notifications */
  totalMessageFilter: number = 0;
  totalMessageUnread: number = 0;
  totalMessageRecord: number = 0;
  notifications: Array<any> = [];

  length: number = 10;
  start: number = 0;
  optionNotification: any = {};

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  action: any = {
    dComponet: false, //inputs
    btnNuevo: false,
    btnGuardar: false,
    btncancelar: false,
    btneditar: false,
  };
  passwordActual: any;
  constructor(private services: DefaultServices, private router: Router, private cookies: CookieService,
    private toastr: ToastrService, private socket: Socket, private commonSrv: CommonService,
    private commonVarSer: CommonVarService, private modalService: NgbModal,private confirmationDialogService: ConfirmationDialogService,
    public appSettings:AppSettings,
    private menuService: MenuService
    ) {
      this.settings = this.appSettings.settings;
      this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
      this.nameUser = this.dataUser.nombre;
      this.file = this.dataUser.avatar;
      this.user = this.dataUser.usuario;

      /* TODO: this.destroyInterval = setInterval(() => this.setActivityInterval(), 60000); */
      // this.destroyInterval = setInterval(() => this.setActivityInterval(), 300000); 

      this.commonSrv.onHandleNotification.asObservable().subscribe(res => {
        this.loadNotifications();
      })

      router.events.subscribe((url:any) => {
        if(url.url != undefined){
          localStorage.setItem('ruta',url.url);
          (url.url == "/panel/accesos/usuariosl") ? localStorage.setItem('url',"1") : localStorage.setItem('url',"0") ;
        }
      });
  }

  public userImage = "assets/img/users/user.jpg";

  presentarFavorito:boolean = false;
  ngOnInit() {
    /*plantilla*/
    this.optionsPsConfig.wheelPropagation = false;
    if(window.innerWidth <= 960){
      this.settings.menu = 'Vertical';
      this.settings.sidenavIsOpened = false;
      this.settings.sidenavIsPinned = false;
    }
    this.menuOption = 'Vertical'; 
    this.menuTypeOption = this.settings.menuType; 
    this.defaultMenu = this.settings.menu;
    /* plantilla */

    setTimeout(() => {
      this.chooseMenu();  
    }, 50);
    

    this.showPassUser();
    this.services.getIpAddress().subscribe(res => {
      this.ipAddress = res;
      localStorage.setItem('ip', this.ipAddress.ip);
      this.loadNotifications();
    });


    /* setTimeout(() => {
      let data = {
        id_rol: this.dataUser.id_rol,
        id_usuario: this.dataUser.id_usuario
      }
      this.lcargando.ctlSpinner(true);
      this.services.getMenu(data).subscribe(resp => {
        let menuArmado:any = [];
        resp['data'].forEach((element:any,index) => {
          this.lcargando.ctlSpinner(false);
          let menuPlus:any = {
            hasSubMenu: element.subMenu == "S"? true: false,
            href: null,
            icon: element.icono,
            id: element.codigo,
            parentId: element.codigo_padre == 0? "0": Number(element.codigo_padre),
            routerLink: element.ruta,
            target: null,
            title: element.nombre
          };
          menuArmado.push(menuPlus);
        });      
        this.menuItemsHori = menuArmado;
        this.presentarFavorito = true;
      }, error => {
        console.log(error)
        this.lcargando.ctlSpinner(false);
        this.logout();
      })
    }, 10); */


  }

  setActivityInterval() {
    this.numerator++;
    document.onmousemove = () => {
      this.numerator = 0;
    }
    document.onkeypress = () => {
      this.numerator = 0;
    }
    if (this.numerator >= 5) {
      clearInterval(this.destroyInterval);
      this.logout();
      this.toastr.info("su sesión ha caducado");
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
  

  /* notifications methods */
  loadNotifications() {
    this.optionNotification = {
      "draw": 1,
      "order": 0,
      "start": this.start,
      "length": this.length,
      "typeOrder": "desc",
      "search": {
        "value": ""
      }
    }
    this.services.getNotifications(this.optionNotification).subscribe(res => {
      this.notifications = res['data']['records'];
      this.totalMessageRecord = res['data']['recordsTotal'];
      this.totalMessageUnread = res['data']['recordsUnread'];
      this.totalMessageFilter = res['data']['recordsFiltered'];
    });
  }

  actions(notify) {
    if (notify.status === 0) {
      this.services.patchNotification(notify).subscribe(res => {
        this.loadNotifications();
      });
    } else {
      this.loadNotifications();
    }
    this.routingForms(notify.fk_formulario);
  }

  onScroll() {
    if (this.totalMessageFilter < this.totalMessageRecord) {
      this.length += this.length;
      this.loadNotifications();
    }
  }

  routingForms(form) {
    console.log(form);
    var route = "";
    switch (form) {
      case "119":
        route = "/inventario/compras/retencion"
        break;
      case "120":
        route = "/inventario/compras/ordenes";
        setTimeout(() => {
          this.commonVarSer.setPosition.next(true);
        }, 1000);
        break;
      case "121":
        route = "/inventario/compras/registro";
        setTimeout(() => {
          this.commonVarSer.setPositionBuy.next(true);
        }, 1000);
        break;
      case "163":
        route = "/comercializacion/producto/devoluciones";
        break;
      case "165":
        route = "/cartera/cobranza/ncredito";
        break;
      case "126":
        route = "/comercializacion/facturacion/aprobaciones";
        break;
      case "124":
          route = "/comercializacion/facturacion/aprobaciones";
          break;
      default:
        route = "/"
        break;
    }
    this.router.navigateByUrl(route);
  }

  //Update Pass

  showPassUser() {
    let data = {
      id_user: this.dataUser.id_usuario
    }
    this.services.updateUser(data).subscribe(res => {
      this.passwordActual = res['data'][0].contrasena;
    }, error => {
      this.toastr.info(error.error.mesagge);
    })
  }

  informaPaas() {
    const dialogRef = this.confirmationDialogService.openDialogMat(EditPassComponent, {
      width: '500px',
      height: '500px',
    });
    dialogRef.componentInstance.dt = this.passwordActual;
  }



  /*PLANTILLA */
  @ViewChild('sidenav') sidenav:any;  
  @ViewChild('backToTop') backToTop:any;  
  @ViewChildren(PerfectScrollbarDirective) pss: QueryList<PerfectScrollbarDirective>;
  public optionsPsConfig: PerfectScrollbarConfigInterface = {};
  public settings:Settings;
  public showSidenav:boolean = false;
  public showInfoContent:boolean = false;
  public toggleSearchBar:boolean = false;
  private defaultMenu:string; //declared for return default menu when window resized 
  public menus = ['Vertical', 'Horizontal'];
  public menuOption:string;
  public menuTypes = ['Por Defecto', 'Compácto', 'Mini'];
  public menuTypeOption:string;
  
  public toggleSidenav(){
    this.sidenav.toggle();
  }

  menuItemsHori:any=[];
  presentarHorizontal:boolean = false;
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  public chooseMenu(){
    //this.presentarHorizontal = false;
    this.settings.menu = this.menuOption; 
    this.defaultMenu = this.menuOption;
    if(this.menuOption == 'Horizontal'){
      this.settings.fixedSidenav = false;
      this.MenuHorizontal()
      this.presentarHorizontal = true;
    }
  }

  public chooseMenuType(){
    this.settings.menuType = this.menuTypeOption;
  }

  public changeTheme(theme){
    this.settings.theme = theme;       
  }
  
  public closeInfoContent(showInfoContent){
    this.showInfoContent = !showInfoContent;
  }

  @HostListener('window:resize')
  public onWindowResize():void {
    if(window.innerWidth <= 960){
      this.settings.sidenavIsOpened = false;
      this.settings.sidenavIsPinned = false;
      this.settings.menu = 'Vertical'
    }
    else{
      (this.defaultMenu == 'Horizontal') ? this.settings.menu = 'Horizontal' : this.settings.menu = 'Vertical'
      this.settings.sidenavIsOpened = true;
      this.settings.sidenavIsPinned = true;
    }
  }

  public onPsScrollY(event){   
    (event.target.scrollTop > 300) ? this.backToTop.nativeElement.style.display = 'flex' : this.backToTop.nativeElement.style.display = 'none';
  }

  public scrollToTop() {
    this.pss.forEach(ps => {
      if(ps.elementRef.nativeElement.id == 'main'){
        ps.scrollToTop(0,250);
      }
    });
  }
  
  public closeSubMenus(){
    if(this.settings.menu == "Vertical"){
      this.menuService.closeAllSubMenus();
    }      
  }

  MenuHorizontal() {
    let data = {
        id_rol: this.dataUser.id_rol,
        id_usuario: this.dataUser.id_usuario
    };
    this.lcargando.ctlSpinner(true);
    this.services.getMenu(data).subscribe(resp => {
        let menuArmado = [];
        resp['data'].forEach((element:any,index) => {
        this.lcargando.ctlSpinner(false);
        let menuPlus:any = {
          id: element.codigo,
          hasSubMenu: element.subMenu == true,
          href: null,
          icon: element.icono,
          parentId: element.codigo_padre == 0? "0": Number(element.codigo_padre),
          routerLink: element.ruta,
          target: null,
          title: element.nombre
        };
        menuArmado.push(menuPlus);
      }); 
        this.menuItemsHori = menuArmado;
        this.presentarFavorito = true;
    }, error => {
        console.log(error);
        this.lcargando.ctlSpinner(false);
        this.logout();
    });
};

  // MenuHorizontal() {
  //   let data = {
  //     id_rol: this.dataUser.id_rol,
  //     id_usuario: this.dataUser.id_usuario
  //   }
  //   this.lcargando.ctlSpinner(true);
  //   this.services.getMenu(data).subscribe(resp => {
  //      let menuArmado:any = [];
  //     resp['data'].forEach((element:any,index) => {
  //       this.lcargando.ctlSpinner(false);
  //       let menuPlus:any = {
  //         hasSubMenu: element.subMenu == "S"? true: false,
  //         href: null,
  //         icon: element.icono,
  //         id: element.codigo,
  //         parentId: element.codigo_padre == 0? "0": Number(element.codigo_padre),
  //         routerLink: element.ruta,
  //         target: null,
  //         title: element.nombre
  //       };
  //       menuArmado.push(menuPlus);
  //     });   
    
  //     this.menuItemsHori = menuArmado;
  //     this.presentarFavorito = true;
  //   }, error => {
  //     console.log(error)
  //     this.lcargando.ctlSpinner(false);
  //     this.logout();
  //   })
  // }

}