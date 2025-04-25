import { Injectable } from "@angular/core";

@Injectable()

export class AuthorizationService {
    public loggedIn() {
        /* const token: string = (JSON.parse(localStorage.getItem('Datauser')) != undefined) ? JSON.parse(localStorage.getItem('Datauser')).token : ""; */
        const token: boolean = (JSON.parse(localStorage.getItem('Datauser')) != undefined) ?true: false;
        return token;
        /* if (!token) {
            return false
        }else{
            return true;
        } */
    }
}