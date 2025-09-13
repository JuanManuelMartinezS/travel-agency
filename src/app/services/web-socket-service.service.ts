import { EventEmitter, Injectable } from
  '@angular/core';

import { Socket } from 'ngx-socket-io';

import { environment } from 'src/environments/environment';
import { SecurityService } from './security.service';
//Socket es clase abstrcta con metodos abstractos, se hace polimorfismo

@Injectable({
  providedIn: 'root'
})

export class WebSocketService extends Socket {
  //por medio de callback nos suscribirmos al socket y vemos lo que paso
  callback: EventEmitter<any> = new EventEmitter();
  //Definir el nombre del grupo al que me voy a suscribir para las noticaciones del backend
  nameEvent: string;
  //El constructor recibe el servicio de seguridad para obtener el usuario activo
  constructor(private securityService: SecurityService) {
    const userId = securityService.activeUserSession?.email || ''; 
    //Sobreescribimos el constructor de la clase Socket
    super({
      url: environment.url_ms_socket,
      //Esto me puede servor para obtener lo que tiene un usuario
      options: {
        query: {
          "user_id": userId
        }
      }
    })
    this.nameEvent = ""
    //this.listen()
  }
  setNameEvent(nameEvent: string) {
    this.nameEvent = nameEvent
    this.listen()
  }
  listen = () => {
    this.ioSocket.on(this.nameEvent, (res: any) => this.callback.emit(res))
  }
  // Para llamar este método es necesario inyectar el servicio
  // y enviar el payload
  // emitEvent=(payload={})=>{
  // this.ioSocket.emit(this.nameEvent,payload)
  //}
}