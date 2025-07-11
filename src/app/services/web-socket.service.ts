import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Socket } from 'ngx-socket-io';

interface WebSocketMessage {
  type: string;
  data: unknown; // o algo más específico
}

@Injectable({
  providedIn: 'root'
})


export class WebSocketService extends Socket {
callback: EventEmitter<WebSocketMessage> = new EventEmitter<WebSocketMessage>();
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.ioSocket.on(this.nameEvent, (res: any) => this.callback.emit(res))
  }
}
