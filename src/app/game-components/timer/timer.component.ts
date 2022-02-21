import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {
  constructor() {
    this.clockStatus = new EventEmitter<string>();
   }
  private static observer: any;

  @Output() clockStatus: EventEmitter<string>;
  public timeRemaining: any;
  private isPaused = false;
  private pausedTime: any;
  private isResumed = false;
  private startTime: any;
  private numberOfSecondsIncremented: number;
  private isTimerTimeIncremented: boolean;
  private isTimedOut = true;

  ngOnInit(): void {
    TimerComponent.observer = this.clockStatus.observers;
  }

  initializeClock(id: string, endtime: Date) {
    const clock = document.getElementById(id);
    const minutesSpan = clock.querySelector('.minutes');
    const secondsSpan = clock.querySelector('.seconds');
    const timeInterval = setInterval(() => {
    if (this.isTimerTimeIncremented) {
      endtime.setSeconds(endtime.getSeconds() + this.numberOfSecondsIncremented);
      this.isTimerTimeIncremented = false;
    }
    if (this.timeRemaining === -1) {
      this.timeRemaining = 0;
    }
    else {
      if (this.isPaused) {
        return;
      }
      else {
        if (!this.isResumed) {
          this.timeRemaining = Date.parse(endtime.toString()) - Date.parse(new Date().toString());
        }
        else {
          setTimeout(() => {
            this.timeRemaining = this.timeRemaining - 1000;
          }, this.pausedTime);
        }
      }
    }
    const seconds = Math.floor((this.timeRemaining / 1000) % 60);
    const minutes = Math.floor((this.timeRemaining / 1000 / 60) % 60);
    secondsSpan.innerHTML = ('0' + seconds).slice(-2);
    minutesSpan.innerHTML = ('0' + minutes).slice(-2);
    if (this.timeRemaining <= 0) {
      clearInterval(timeInterval);
      if (this.isTimedOut) {
        this.clockStatus.emit('Hello Parent');
      }
    }
  }, 1000);
}

  stopTheClock() {
    if (this.timeRemaining > 0) {
      this.timeRemaining = -1;
      this.isTimedOut = false;
      this.isPaused = false;
      this.isResumed = false;
    }
  }

  startTheClock(deadline: Date) {
    if (this.clockStatus.observers.length === 0 && TimerComponent.observer) {
      this.clockStatus.observers = TimerComponent.observer;
    }
    this.startTime = deadline;
    this.isTimedOut = true;
    this.initializeClock('clockdiv', deadline);
  }

  pauseTheClock() {
    this.pausedTime = Date.parse(new Date().toString()) - this.startTime;
    this.isPaused = true;
  }

  resumeTheClock() {
    this.isPaused = false;
    this.isResumed = true;
  }

  incrementTheClockBy(numberOfSeconds: number) {
    this.numberOfSecondsIncremented = numberOfSeconds;
    this.isTimerTimeIncremented = true;
  }
}
