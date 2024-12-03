import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService extends Socket {
  callback: EventEmitter<any> = new EventEmitter();
  nameEvent: string;
  constructor() {
    super({ url: environment.url_ms_modulos })
    this.nameEvent = ""
  }
  setNameEvent(nameEvent: string) {
    this.nameEvent = nameEvent
    this.listen()
  }
  listen = () => {
    this.ioSocket.on(this.nameEvent, (res: any) => this.callback.emit(res))
  }
}