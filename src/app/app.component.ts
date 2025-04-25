import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
// import {DefaultServices} from './containers/default-layout/default-layout.services';
// import { CookieService } from "ngx-cookie-service";

import { AppSettings } from './app.settings';
import { Settings } from './app.settings.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public settings: Settings;
  constructor(private router: Router, /*private defaultServices:DefaultServices,private cookies: CookieService,*/
    public appSettings:AppSettings) { 
    this.settings = this.appSettings.settings;
  } 

  ngOnInit() {
    // this.router.events.subscribe((evt) => {
    //   if (!(evt instanceof NavigationEnd)) {
    //     return;
    //   }
    //   window.scrollTo(0, 0);
    // });
  }
}