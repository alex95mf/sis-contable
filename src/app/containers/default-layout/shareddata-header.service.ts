import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class ShareddataHeaderService {

  constructor() { }

  
  // Observable string sources
  private componentMethodCallCreate = new Subject<any>();
  private componentMethodCallClose = new Subject<any>();
  private componentCallMenu = new Subject<any>();
  private componentVisibleTab = new Subject<any>();


  // Observable string streams
  componentMethodCalledCreate$ = this.componentMethodCallCreate.asObservable();
  componentMethodCalledClose$ = this.componentMethodCallClose.asObservable();
  componentCallMenu$=this.componentCallMenu.asObservable();
  componentVisibleTab$=this.componentVisibleTab.asObservable();


  // Service commands to call methods of father component from a dynamic child component stream1
  callCreateComponent(nameSelect: any) {
    this.componentMethodCallCreate.next(nameSelect);
    
  }

  
  // Service message to call methods of father component from a dynamic child component stream2
  callCloseComponent(nameSelect: any) {
    this.componentMethodCallClose.next(nameSelect);
    
  }

  // Llamada de Menu
  callMenu(elementos:any){
    this.componentCallMenu.next(elementos);

  }

  //Establecer Tab Activo
  callVisibleTab(elementos:any){
      this.componentVisibleTab.next(elementos);
  }

  
  clearDataofCreate(){    
    this.componentMethodCallCreate.next();
  }
  clearDataofClose(){
    this.componentMethodCallClose.next();
  }
  clearDataofMenu(){
    this.componentCallMenu.next();
  }
  clearDataofVisible(){
    this.componentVisibleTab.next();
  }


}
