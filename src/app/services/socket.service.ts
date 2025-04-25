import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import * as moment from 'moment';
//import * as io from 'socket.io-client';
import io from 'socket.io-client';
import * as SocketIOClient from 'socket.io-client';
//import { io } from 'socket.io-client';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from './commonServices'; 
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs'; 

// Convertimos la función "io" a un tipo callable
const ioFunc = io as unknown as (uri: string, opts?: any) => any;

// Definimos el alias de tipo usando ReturnType
type SocketType = ReturnType<typeof ioFunc>;

@Injectable({
    providedIn: 'root'
})
export class Socket {
    //private socket: SocketIOClient.Socket;
    private socket: SocketType;

    constructor(private commonSrv: CommonService, private toastr: ToastrService) {
        let payload = commonSrv.getDataUserLogued();
        this.socket = ioFunc(environment.apiSocket, {
          query: {
            id: payload['id_usuario'],
            username: payload['usuario']
          },
          transports: ['websocket']
        });
        //this.socket = io(environment.apiSocket, { query: `id=${payload['id_usuario']}&username=${payload['usuario']}`, transports: ['websocket'] });
       console.log(this.socket)
        this.onSocket();
    }

    onSocket() {
        this.socket.on('notification-push', () => {
            this.toastr.info('Un nuevo mensaje en su bandeja de entrada');
            this.commonSrv.onHandleNotification.next();
        });
    }

    onEmitNotification(payload) {
        console.log('emitiendo notificacion')
        this.socket.emit('notification', payload);
    }

    onEmitDisconnected(identifier) {
        this.socket.emit('leave-room', identifier);
    }
   
}