/** Your events enum */
export enum IOEventName {
    USER_CONNECTED = 'user-connected',
    TEST_EVENT = 'testerEvent',
    CONNECTED_TO_ROOM = 'connectedToRoom',
    JOIN_ROOM = 'join-new-room'
  }

  /** Interfaces for your event messages */
export interface IUserConnectedMessage {
    propOne: number;
    propTwo: string;
  }

export interface ITestEventMessage {
    description: string;
  }

