import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { AppSettings } from '../../../../app.settings';
import { Settings } from '../../../../app.settings.model';
import { MenuService } from '../menu.service';

@Component({
standalone: false,
  selector: 'app-horizontal-menu',
  templateUrl: './horizontal-menu.component.html',
  styleUrls: ['./horizontal-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ MenuService ]
})
export class HorizontalMenuComponent implements OnInit {
  @Input('menuParentId') menuParentId;
  @Input('menuItemsHori') menuItemsHori;
   menuItems:Array<any>;
  public settings: Settings;

  constructor(public appSettings:AppSettings, public menuService:MenuService) { 
    this.settings = this.appSettings.settings;
  }
  ngOnInit() {

    //this.menuItems = this.menuService.getHorizontalMenuItems(); 
    this.menuItems = this.menuItemsHori.filter(item => item.parentId == this.menuParentId);
  }
  onClick(menuId){
    this.menuService.toggleMenuItem(menuId);
    this.menuService.closeOtherSubMenus(this.menuItemsHori, menuId);    
    
  }
}