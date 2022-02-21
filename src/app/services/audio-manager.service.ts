import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioManagerService {

  audio: any;
  constructor() {
    this.audio = new Audio();
   }

  playBackgroundSound(sound: string) {
    this.stopIfAudioIsPlaying();
    this.audio.src = sound;
    this.audio.load();
    this.audio.play();
    this.audio.volume = 0.5;
  }

  stopIfAudioIsPlaying() {
    if (this.audio.duration > 0 && !this.audio.paused) {
      this.audio.pause();
    }
}
}
