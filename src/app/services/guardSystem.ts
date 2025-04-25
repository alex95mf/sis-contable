import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { Router } from "@angular/router";
import { AuthorizationService } from './auth-service';
@Injectable()
export class GuardSystem implements CanActivate {
    constructor(private auth: AuthorizationService, private router: Router) { }
    canActivate(): boolean {
        if (this.auth.loggedIn()) {
            return true;
        } else {
            localStorage.removeItem('Datauser');
            this.router.navigateByUrl('home');
            return false;
        }
    }
}
