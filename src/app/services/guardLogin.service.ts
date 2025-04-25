import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { Router } from "@angular/router";
import { AuthorizationService } from './auth-service';
@Injectable()
export class GuardLogin implements CanActivate {
    planLoguin:any;
    constructor(private auth: AuthorizationService, private router: Router) { }
    canActivate(): boolean {
        if (this.auth.loggedIn()) {
             return false; 
        } else {
            return true;
        }
    }
}
