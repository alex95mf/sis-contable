import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpHeaders, HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CookieService } from "ngx-cookie-service";

@Injectable()

export class ApiServices {

    dataUser: any;
    URL_API = environment.apiUrl;
    /* url = environment.Url; */
    URI: string = environment.baseUrl;

    constructor(private http: HttpClient, private cookies: CookieService) { }

    public apiCall(endpoint, method, data) {
        this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
        data['token'] = this.getToken();
        data['user_token_id'] = this.dataUser.id_usuario;
        const headers = new HttpHeaders({ "Content-Type": "application/json" });
        switch (method) {
            case "GET":
                return this.http.get(`${this.URL_API}${endpoint}`);
            case "POST":
                return this.http.post(`${this.URL_API}${endpoint}`, data, { headers: headers });
            case "PUT":
                return this.http.put(`${this.URL_API}${endpoint}`, data, { headers: headers });
                case "DELETE":
                    return this.http.put(`${this.URL_API}${endpoint}`, data, { headers: headers });
            case "GETV1":
                return this.http.get(`${this.URL_API}${endpoint}`);
            case "PUT":
                return this.http.put(`${this.URL_API}${endpoint}`, data, { headers: headers });
            case "PUTV1":
                return this.http.put(`${this.URL_API}${endpoint}`, data, { headers: headers });
            case "DELETEV1":
                return this.http.delete(`${this.URL_API}${endpoint}`, { headers: headers });
            case "GETFILEV1":
                return this.http.get(`${this.URL_API}${endpoint}`,{ responseType: 'blob' });
        }
    }

    public apiCallPublic(endpoint, method, data) {
        switch (method) {
            case "GET":
                return this.http.get(`${this.URL_API}baja.php?codigo=${data}`);
            case "POST":
                return this.http.post(`${this.URL_API}${endpoint}`, data);
        }
    }

    public apiCallFile(endpoint, method, file: File, payload?: any): Observable<HttpEvent<any>> {
        const formData: FormData = new FormData();

        if (file !== undefined) {
            formData.append('file', file);
            formData.append('type', file['type']);
        }

        if (payload !== undefined) {
            formData.append('module', payload.module);
            formData.append('component', payload.component);
            formData.append('identifier', payload.identifier);
            formData.append('description', payload.description);
            formData.append('token', this.getToken());
            formData.append('user_token_id', this.dataUser.id_usuario);
            formData.append('id_controlador', payload.id_controlador);
            formData.append('accion', payload.accion);
            formData.append('ip', payload.ip);

            if ('custom1' in payload && payload.custom1) formData.append('custom1', payload.custom1)
            if ('custom2' in payload && payload.custom2) formData.append('custom2', payload.custom2)
            if ('custom3' in payload && payload.custom3) formData.append('custom3', payload.custom3)
        }

        if (payload?.id_anexo !== undefined) {
            formData.append('id_anexo', payload.id_anexo);
        }

        const req = new HttpRequest(method, `${this.URL_API}${endpoint}`, formData, {
            reportProgress: true,
            responseType: 'json'
        });
        return this.http.request(req);
    }
    public apiCallFile2(endpoint, method, file: File, payload?: any): Observable<HttpEvent<any>> {
        const formData: FormData = new FormData();
        this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
        formData['token'] = this.getToken();
        formData['user_token_id'] = this.dataUser.id_usuario;
       
        if (file !== undefined) {
            formData.append('file', file);
            formData.append('type', file['type']);
        }
    
        if (payload !== undefined) {
            for (const key of Object.keys(payload)) {
                if (typeof payload[key] === 'object') {
                    formData.append(key, JSON.stringify(payload[key]));
                } else {
                    formData.append(key, payload[key]);
                }
            }/* 
            for (const key of Object.keys(payload)) {
                formData.append(key, payload[key]);
            } */
        }
    console.log("prueba andy",formData);
        const req = new HttpRequest(method, `${this.URL_API}${endpoint}`, formData, {
            reportProgress: true,
            responseType: 'json'
        });
        return this.http.request(req);
    }
    
  
    public apiCallFileNom(endpoint, method, file: File, payload?: any): Observable<HttpEvent<any>> {
        const formData: FormData = new FormData();

        if (file !== undefined) {
            formData.append('file', file);
            formData.append('type', file['type']);
        }

        if (payload !== undefined) {
            formData.append('periodo', payload.periodo)
            formData.append('mes', payload.mes)
            formData.append('token', this.getToken());
            formData.append('user_token_id', this.dataUser.id_usuario);
        }

        const req = new HttpRequest(method, `${this.URL_API}${endpoint}`, formData, {
            reportProgress: true,
            responseType: 'json'
        });
        return this.http.request(req);
    }

    public getIPAddress() {
        return this.http.get("https://api.ipify.org/?format=json");
    }

    public setToken(token: any) {
        this.cookies.set("token", token);
    }

    public getToken() {
        return this.cookies.get("token");
    }

    public getTipoBlob(servicio: string, datos: any): Observable<any> {

        this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
        datos['token'] = this.getToken();
        datos['user_token_id'] = this.dataUser.id_usuario;

        return this.http.get(this.URI + servicio, { responseType: "blob", params: datos });
    }

}
