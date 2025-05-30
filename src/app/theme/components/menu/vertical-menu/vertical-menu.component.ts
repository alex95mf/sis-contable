import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { DefaultServices } from 'src/app/containers/default-layout/default-layout.services';
import { AppSettings } from '../../../../app.settings';
import { Settings } from '../../../../app.settings.model';
import { MenuService } from '../menu.service';

@Component({
standalone: false,
  selector: 'app-vertical-menu',
  templateUrl: './vertical-menu.component.html',
  styleUrls: ['./vertical-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ MenuService ]
})
export class VerticalMenuComponent implements OnInit {
  @Input('menuItems') menuItems;
  @Input('menuParentId') menuParentId;
  parentMenu:Array<any>;
  public settings: Settings;
  constructor(public appSettings:AppSettings, public menuService:MenuService) { 
    this.settings = this.appSettings.settings;

    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
  }
  dataUser: any;
  ngOnInit() {    
    this.parentMenu = this.menuItems.filter(item => item.parentId == this.menuParentId);
  }

  onClick(menuId){
    this.menuService.toggleMenuItem(menuId);
    this.menuService.closeOtherSubMenus(this.menuItems, menuId);    
  }

}
