import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { IOEventName } from '../model/messaging-model.model';

@Injectable({
  providedIn: 'root'
})

export class SocketService {
  constructor(public socket: Socket) { }

  public onEvent<T>(event: IOEventName): Observable<T | Array<T>> {
    return new Observable(observer => {
      this.socket.on(event, (data: T) => observer.next(data));
    });
  }

  public onEventWithParameter<T>(event: IOEventName, parameter): Observable<T | Array<T>> {
    return new Observable(observer => {
      this.socket.on(event, (data: T) => observer.next(data));
    });
  }

  public emitEvent(eventName: string, message: any, ) {
    this.socket.emit(eventName, message);
  }
}
