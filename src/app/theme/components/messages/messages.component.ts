import { Component, OnInit, ViewEncapsulation, ViewChild, Input } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { DefaultServices } from 'src/app/containers/default-layout/default-layout.services';
import { CommonVarService } from 'src/app/services/common-var.services';
import { MessagesService } from './messages.service';

@Component({
standalone: false,
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ MessagesService ]
})
export class MessagesComponent implements OnInit {  
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  public selectedTab:number=1;
  public messages:Array<Object>;
  public files:Array<Object>;
  public meetings:Array<Object>;  
  public loadingMessages: boolean = false

  @Input('notifications') notifications;
  @Input('totalMessageUnread') totalMessageUnread;

  constructor(private commonVarSer: CommonVarService, private router: Router, private services: DefaultServices, private messagesService:MessagesService) { 
    this.messages = messagesService.getMessages();
    this.files = messagesService.getFiles();
    this.meetings = messagesService.getMeetings();    
  }

  ngOnInit() {
  }

  openMessagesMenu() {
    this.trigger.openMenu();
    this.selectedTab = 0;
  }

  onMouseLeave(){
    this.trigger.closeMenu();
  }

  stopClickPropagate(event: any){
    event.stopPropagation();
    event.preventDefault();
  }


  actions(notify) {
    if (notify.status === 0) {
      this.loadingMessages = true
      this.services.patchNotification(notify).subscribe(res => {
        this.loadNotifications();
      });
    } else {
      this.loadNotifications();
    }
    // this.routingForms(notify.fk_formulario);
  }

  optionNotification: any = {};
  totalMessageRecord: number = 0;
  totalMessageFilter: number = 0;
  length: number = 10;
  start: number = 0;
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
    this.loadingMessages = true
    this.services.getNotifications(this.optionNotification).subscribe(res => {
   
      this.notifications = res['data']['records'];
      this.totalMessageRecord = res['data']['recordsTotal'];
      this.totalMessageUnread = res['data']['recordsUnread'];
      this.totalMessageFilter = res['data']['recordsFiltered'];
      console.log(this.notifications)
      this.loadingMessages = false
    });
  }

  routingForms(form) {
    var route = "";
    switch (form) {
      case "119":
        route = "/compra/solicitudes"
        break;
      case "120":
        route = "/compra/ordenes";
        setTimeout(() => {
          this.commonVarSer.setPosition.next(true);
        }, 1000);
        break;
      case "121":
        route = "/compra/facturacion";
        setTimeout(() => {
          this.commonVarSer.setPositionBuy.next(true);
        }, 1000);
        break;
      case "163":
        route = "/venta/devoluciones";
        break;
      case "165":
        route = "/venta/cliente/notacredito";
        break;
      default:
        route = "/"
        break;
    }
    this.router.navigateByUrl(route);
  }
 

}
