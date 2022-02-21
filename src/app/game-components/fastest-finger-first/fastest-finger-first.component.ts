import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { ITestEventMessage, IOEventName } from 'src/app/model/messaging-model.model';

@Component({
  selector: 'app-fastest-finger-first',
  templateUrl: './fastest-finger-first.component.html',
  styleUrls: ['./fastest-finger-first.component.css']
})
export class FastestFingerFirstComponent implements OnInit {

  public listOfParticipants: Array<string>;
  newMessage: string;
  messageList: string[] = [];

  constructor(private socketService: SocketService) {
    this.listOfParticipants = ['Participant 1', 'Participant 2', 'Participant 3', 'Participant 4', 'Participant 5'];
  }

  ngOnInit() {
    this.socketService
      .onEvent<ITestEventMessage>(IOEventName.TEST_EVENT)
      .subscribe((message: any) => {
        console.log('Incoming message', message.description);
      });

    this.socketService.emitEvent(IOEventName.JOIN_ROOM, 'newRoom');
  }
  sendMessage(message: string) {
    this.socketService.emitEvent('new-message', message);
  }
}
