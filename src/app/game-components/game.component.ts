import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { AudioManagerService } from 'src/app/services/audio-manager.service';
import { QuizInformationDetailsService } from '../services/quiz-information-details.service';
import { IQuizQuestionsSet } from '../model/IQuizQuestionsSet';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AudiencePollComponent } from './audience-poll/audience-poll.component';
import { DataService } from '../services/data.service';
import { ConstantsService } from '../services/constants.service';
import { GameShowUtilitiesService } from '../services/utilities.service';
import { TimerComponent } from "./timer/timer.component";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  providers: [GameShowUtilitiesService, TimerComponent]
})
export class GameComponent implements OnInit {
  //#region view-child
  @ViewChild('questionPlaceholder', { static: true }) questionElement:        ElementRef;
  @ViewChild('optionOnePlaceHolder', { static: true }) optionOneElement:      ElementRef;
  @ViewChild('optionTwoPlaceHolder', { static: true }) optionTwoElement:      ElementRef;
  @ViewChild('optionThreePlaceHolder', { static: true }) optionThreeElement:  ElementRef;
  @ViewChild('optionFourPlaceHolder', { static: true }) optionFourElement:    ElementRef;
  @ViewChild('information', { static: true }) informationElement:             ElementRef;
  //#endregion

  //#region public-properties
  public currentWinnings:       string;
  public guaranteedWinnings:    string;
  public username:              string  = ConstantsService.emptyString;
  public isNextQuestionAllowed: boolean = false;
  public hasOptionBeenLocked:   boolean = false;
  public isGameReset:           boolean = false;
  public isCollapsed:           boolean = true;
  public arrayIndex:            number;
  //#endregion

  //#region private-properties
  private questions:              Array<string>;
  private flippedQuestionDetails: IQuizQuestionsSet;
  private winningDetails:         Array<string>;
  //#endregion

  constructor(
    private _audioManager: AudioManagerService,
    private _quizInformationDetails: QuizInformationDetailsService,
    private modalService: NgbModal,
    private _data: DataService,
    public _utilities: GameShowUtilitiesService,
    public _timerComponent: TimerComponent
    ) {
    this.arrayIndex                 = 0;
    this.username                   = ConstantsService.emptyString;
    this.currentWinnings            = ConstantsService.zero;
    this.guaranteedWinnings         = ConstantsService.zero;
  }

  ngOnInit(): void {
    this.checkIsBrowserMobile();
    this.getQuizQuestions();
    this.prepareWinningsDetails();
  }
  checkIsBrowserMobile() {
    if (this._utilities.isMobile()) {
      this._utilities.startGameHeading = this._utilities.quitGameHeading = this._utilities.nextQuestionHeading = '';
    }
  }

  getTheLifeline(lifeline: string) {
    if (this._utilities.hasGameStarted && !this.hasOptionBeenLocked) {
      switch (lifeline) {
        case ConstantsService.fiftyFifty:
          this.lifeLineFiftyFifty();
          break;
        case ConstantsService.audiencePoll:
          this.lifeLineAskTheAudience();
          break;
        case ConstantsService.switchTheQuestion:
          this.lifeLineFlipTheQuestion();
          break;
        case ConstantsService.doubleChance:
          this.lifeLineDoubleChance();
          break;
        case ConstantsService.extraTime:
          this.lifeLineExtraTime();
          break;
        case ConstantsService.askTheExpert:
          this.lifeLineAskTheExpert();
          break;
      }
    }
  }

  startNewGame(username: string) {
    this._utilities.hasGameStarted = true;
    if (this.arrayIndex == 0 && username.length) {
      this._audioManager.stopIfAudioIsPlaying();
      this._audioManager.playBackgroundSound(ConstantsService.startNewGameAudioFilePath);
      this.presentQuestion();
    }
  }

  showNextQuestion() {
    if (this._utilities.hasGameStarted && this.hasOptionBeenLocked && this.isNextQuestionAllowed) {
      this.resetOptions();
      this._utilities.setLifeLines(false);
      this._audioManager.stopIfAudioIsPlaying();
      this._audioManager.playBackgroundSound(ConstantsService.showNextQuestionAudioFilePath);
      this.presentQuestion();
    }
  }

  quitTheGame() {
    if (this._utilities.hasGameStarted) {
      this._audioManager.playBackgroundSound(ConstantsService.quitTheGameAudioFilePath);
      this.resetTheGame();
      this.resetOptions();
      this._utilities.setLifeLines(false);
    }
  }

  lockOptionAndWait(optionNumber: number, isEnabled: boolean) {
    if (this._utilities.hasGameStarted && isEnabled) {
      this.hasOptionBeenLocked = true;
      this._audioManager.playBackgroundSound(ConstantsService.finalAnswerAudioFilePath);

      var lockedAnswer: number;
      lockedAnswer = this.getsLockedOption(optionNumber);
      this._utilities.setOptions(false);
      this.isNextQuestionAllowed = false;
      setTimeout(this.optionLocked , 4000, lockedAnswer);
    }
  }

  optionLocked = async (lockedAnswer: number) =>  {
    this._utilities.setOptions(true);
    this.isNextQuestionAllowed = true;
      var correctAnswer: number;
      let choice: string;
      if (this._utilities.lifelineFlipTheQuestionLocked && this._utilities.isFlippedQuestionPresented) {
         choice = this.flippedQuestionDetails.rightAnswer;
      }
      else {
        choice = this.questions['Questions'][this.arrayIndex - 1].rightAnswer;
      }
      correctAnswer = this.getsRightAnswer(choice);

      if (lockedAnswer == correctAnswer) {
        if (this.isCollapsed) {
          this.calculateWinnings();
          this.isNextQuestionAllowed = true;
        }
        else {
          this.isNextQuestionAllowed = false;
          this._utilities.isFlippedQuestionPresented = false;
        }

        this._utilities.setOptions(false);
        this._audioManager.playBackgroundSound(ConstantsService.correctAnswerAudioFilePath);
      }
      else {
        if (this._utilities.isFirstGuessRight()) {
          return;
        }

        if (this.isCollapsed) {
          this.calculateWinnings();
          this._utilities.setOptions(false);
          this.currentWinnings = this.guaranteedWinnings;
        }
        else {
          this._utilities.isFlippedQuestionPresented = false;
        }
        this.isNextQuestionAllowed = false;
        this.getsWrongOption(lockedAnswer);
        this._audioManager.playBackgroundSound(ConstantsService.wrongAnswerAudioFilePath);
      }
      this.informationElement.nativeElement.innerHTML     = this.questions['Questions'][this.arrayIndex - 1].information;
      this.stopTheTimer();
  }

  applyFlipTheQuestionLifeLine(shouldApplyFlipTheQuestion: any) {
    if (shouldApplyFlipTheQuestion) {
      this.resetOptions();
      this.presentFlippedQuestion();
      this.isCollapsed = true;
    }
  }

  public clockStatusFromTimerComponent(data: string) {
    this.quitTheGame();
    this.questionElement.nativeElement.innerHTML    = ConstantsService.timeOver;
  }

  private startTheTimer() {
    var deadline = new Date(Date.parse(new Date().toString()) + 45 * 1000);
    this._timerComponent.startTheClock(deadline);
  }

  private stopTheTimer() {
    this._timerComponent.stopTheClock();
  }

  private getsRightAnswer(choice: string) {
    let correctAnswer:number;
    switch (choice) {
      case ConstantsService.caseOptionOne:
        this._utilities.rightAnswerOptionOne   = true;
        correctAnswer = 1;
        break;
      case ConstantsService.caseOptionTwo:
        this._utilities.rightAnswerOptionTwo   = true;
        correctAnswer = 2;
        break;
      case ConstantsService.caseOptionThree:
        this._utilities.rightAnswerOptionThree = true;
        correctAnswer = 3;
        break;
      case ConstantsService.caseOptionFour:
        this._utilities.rightAnswerOptionFour  = true;
        correctAnswer = 4;
        break;
    }
    return correctAnswer;
  }

  private getsLockedOption(optionNumber: number) {
    var lockedAnswer: number;
    switch (optionNumber) {
      case 1:
        this._utilities.isOptionOneLocked    = true;
        lockedAnswer = 1;
        break;
      case 2:
        this._utilities.isOptionTwoLocked    = true;
        lockedAnswer = 2;
        break;
      case 3:
        this._utilities.isOptionThreeLocked  = true;
        lockedAnswer = 3;
        break;
      case 4:
        this._utilities.isOptionFourLocked   = true;
        lockedAnswer = 4;
        break;
    }
    return lockedAnswer;
  }

  private getsWrongOption(optionNumber: number) {
    switch (optionNumber) {
      case 1:
        this._utilities.wrongAnswerOptionOne    = true;
        break;
      case 2:
        this._utilities.wrongAnswerOptionTwo    = true;
        break;
      case 3:
        this._utilities.wrongAnswerOptionThree  = true;
        break;
      case 4:
        this._utilities.wrongAnswerOptionFour   = true;
        break;
    }
  }

  private getQuizQuestions() {
    this._quizInformationDetails.getsQuestionsList().subscribe(
      (data) => this.questions = data,
      (error) => (console.log(error))
    );
  }

  private calculateWinnings() {
    if (this._utilities.hasGameStarted) {
      this.currentWinnings = this.winningDetails[this.arrayIndex - 1];
      if (this.arrayIndex - 1 > 3 && this.arrayIndex - 1 < 5) {
        this.guaranteedWinnings = ConstantsService.firstMilestoneAmount;
      }
      else if (this.arrayIndex - 1 > 7 && this.arrayIndex - 1 < 9) {
        this.guaranteedWinnings = ConstantsService.secondMilestoneAmount;
      }
      if (this.arrayIndex - 1 > 11) {
        this.guaranteedWinnings = ConstantsService.thirdMilestoneAmount;
      }
    }
  }

  private lifeLineDoubleChance() {
    if (!this._utilities.lifelineDoubleChanceLocked) {
      this._audioManager.playBackgroundSound(ConstantsService.lifeLineAudioFilePath);
      this._utilities.lifelineDoubleChanceLocked = true;
      this._utilities.imageSourceDoubleChance = ConstantsService.doubleChanceDoneImageSourcePath;
    }
  }

  private lifeLineFiftyFifty() {
    if (!this._utilities.lifelineFiftyFiftyLocked) {
      this._audioManager.playBackgroundSound(ConstantsService.lifeLineAudioFilePath);
      this._utilities.lifelineFiftyFiftyLocked = true;
      this._utilities.imageSourceFiftyFifty = ConstantsService.fiftyFiftyDoneImageSourcePath;
      switch (this.questions['Questions'][this.arrayIndex - 1].rightAnswer) {
        case ConstantsService.caseOptionOne:
          this.optionFourElement.nativeElement.innerHTML  = ConstantsService.exclamation;
          this.optionThreeElement.nativeElement.innerHTML = ConstantsService.exclamation;
          this._utilities.isOptionFourEnabled = false;
          this._utilities.isOptionThreeEnabled = false;
          break;
        case ConstantsService.caseOptionTwo:
          this.optionOneElement.nativeElement.innerHTML   = ConstantsService.exclamation;
          this.optionThreeElement.nativeElement.innerHTML = ConstantsService.exclamation;
          this._utilities.isOptionOneEnabled = false;
          this._utilities.isOptionThreeEnabled = false;
          break;
        case ConstantsService.caseOptionThree:
          this.optionOneElement.nativeElement.innerHTML   = ConstantsService.exclamation;
          this.optionTwoElement.nativeElement.innerHTML   = ConstantsService.exclamation;
          this._utilities.isOptionOneEnabled = false;
          this._utilities.isOptionTwoEnabled = false;
          break;
        case ConstantsService.caseOptionFour:
          this.optionOneElement.nativeElement.innerHTML   = ConstantsService.exclamation;
          this.optionThreeElement.nativeElement.innerHTML = ConstantsService.exclamation;
          this._utilities.isOptionOneEnabled = false;
          this._utilities.isOptionThreeEnabled = false;
          break;
      }
    }
  }

  private lifeLineAskTheExpert() {
    if (!this._utilities.lifelineAskTheExpertLocked) {
      this._audioManager.playBackgroundSound(ConstantsService.lifeLineAudioFilePath);
      this._utilities.lifelineAskTheExpertLocked = true;
      this._utilities.imageSourceAskTheExpert = ConstantsService.askTheExpertDoneImageSourcePath;
      var query = this.questions['Questions'][this.arrayIndex - 1].question;
      window.open(`http://google.com/search?q=${query}`);
    }
  }

  private lifeLineAskTheAudience() {
    if (!this._utilities.lifelineAskTheAudienceLocked) {
      this._timerComponent.pauseTheClock();
      this._audioManager.playBackgroundSound(ConstantsService.lifeLineAudioFilePath);
      this._utilities.lifelineAskTheAudienceLocked = true;
      this._utilities.imageSourceAskTheAudience    = ConstantsService.askTheAudienceDoneImageSourcePath;
      const modalRef = this.modalService.open(AudiencePollComponent, 
        {
          size: 'lg',
          centered: true,
          keyboard: true
        });
      modalRef.componentInstance.name = ConstantsService.audiencePoll;
      modalRef.result.then((data) => {
        //Close Event
        this.showAudiencePollPercentage();
        this._timerComponent.resumeTheClock();
      }, (reason) => {
        //dismiss event
        this.showAudiencePollPercentage();
        this._timerComponent.resumeTheClock();
      });
    }
  }

  private lifeLineFlipTheQuestion() {
    if (!this._utilities.lifelineFlipTheQuestionLocked) {
      this._audioManager.playBackgroundSound(ConstantsService.lifeLineAudioFilePath);
      this._utilities.imageSourceFlipTheQuestion = ConstantsService.switchTheQuestionDoneImageSourcePath;
      this._utilities.lifelineFlipTheQuestionLocked = true;
      this.isCollapsed = false;
        this._quizInformationDetails.getsFlipQuestionsList().subscribe(
          (data) => {
            this.flippedQuestionDetails = data;
            this._timerComponent.pauseTheClock();
          },
          (error) => (console.log(error))
        );
    }
  }

  private lifeLineExtraTime() {
  if (!this._utilities.lifelineExtraTimeLocked) {
    this._audioManager.playBackgroundSound(ConstantsService.lifeLineAudioFilePath);
    this._utilities.imageSourceExtraTime = ConstantsService.extraTimeDoneImageSourcePath;
    this._utilities.lifelineExtraTimeLocked = true;
    this._timerComponent.incrementTheClockBy(30);
  }
}

  private showAudiencePollPercentage() {
    var audiencePollDataArray = JSON.parse("[" + this.questions['Questions'][this.arrayIndex - 1].audiencePoll + "]");
    this._utilities.audiencePollOptionOnePercentage    = audiencePollDataArray[0] + ConstantsService.percentageSign;
    this._utilities.audiencePollOptionTwoPercentage    = audiencePollDataArray[1] + ConstantsService.percentageSign;
    this._utilities.audiencePollOptionThreePercentage  = audiencePollDataArray[2] + ConstantsService.percentageSign;
    this._utilities.audiencePollOptionFourPercentage   = audiencePollDataArray[3] + ConstantsService.percentageSign;
  }

  private prepareWinningsDetails() {
    this.winningDetails = this._utilities.prepareWinningDetails();
  }

  private resetOptions() {
    this._utilities.resetOptions();
    this._utilities.setOptions(true);
    if (this.isCollapsed) {
      this._utilities.isFlippedQuestionPresented       = false;
    }
    this.stopTheTimer();
  }

  private resetTheGame() {
    this.questionElement.nativeElement.innerHTML    = ConstantsService.questionTextPlaceHolder;
    this.optionOneElement.nativeElement.innerHTML   = ConstantsService.optionOneTextPlaceHolder;
    this.optionTwoElement.nativeElement.innerHTML   = ConstantsService.optionTwoTextPlaceHolder;
    this.optionThreeElement.nativeElement.innerHTML = ConstantsService.optionThreeTextPlaceHolder;
    this.optionFourElement.nativeElement.innerHTML  = ConstantsService.optionFourTextPlaceHolder;
    this.informationElement.nativeElement.innerHTML = ConstantsService.informationAboutQuestion;
    this.arrayIndex                                 = 0;
    this._utilities.hasGameStarted                  = false;
    this.username                                   = ConstantsService.emptyString;
    this.flippedQuestionDetails                     = null;
    this.isGameReset                                = true;
    this.currentWinnings                            = ConstantsService.zero;
    this.guaranteedWinnings                         = ConstantsService.zero;
    this.isCollapsed                                = true;
    this._utilities.isFlippedQuestionPresented                 = true;
    this._utilities.setInitialPathForLifeLineImages();
    this._utilities.setLifeLines(false);
  }

  private presentQuestion() {
    this.questionElement.nativeElement.innerHTML        = this.questions['Questions'][this.arrayIndex].question;
    this.optionOneElement.nativeElement.innerHTML       = this.questions['Questions'][this.arrayIndex].optionOne;
    this.optionTwoElement.nativeElement.innerHTML       = this.questions['Questions'][this.arrayIndex].optionTwo;
    this.optionThreeElement.nativeElement.innerHTML     = this.questions['Questions'][this.arrayIndex].optionThree;
    this.optionFourElement.nativeElement.innerHTML      = this.questions['Questions'][this.arrayIndex].optionFour;
    this.informationElement.nativeElement.innerHTML     = ConstantsService.informationAboutQuestion;
    this.isNextQuestionAllowed = true;
    this.hasOptionBeenLocked = false;
    this.arrayIndex++;
    this._data.changeMessage(this.questions['Questions'][this.arrayIndex -1].audiencePoll);
    this.startTheTimer();
    this.playQuestionsBackgroundSound();
  }

  private presentFlippedQuestion() {
    this.questionElement.nativeElement.innerHTML    = this.flippedQuestionDetails.question;
    this.optionOneElement.nativeElement.innerHTML   = this.flippedQuestionDetails.optionOne;
    this.optionTwoElement.nativeElement.innerHTML   = this.flippedQuestionDetails.optionTwo;
    this.optionThreeElement.nativeElement.innerHTML = this.flippedQuestionDetails.optionThree;
    this.optionFourElement.nativeElement.innerHTML  = this.flippedQuestionDetails.optionFour;
    this.informationElement.nativeElement.innerHTML = ConstantsService.informationAboutQuestion;
    this._data.changeMessage(this.flippedQuestionDetails.audiencePoll);
    this._utilities.isFlippedQuestionPresented = true;
    this.startTheTimer();
    this.playQuestionsBackgroundSound();
  }

  private playQuestionsBackgroundSound() {
    var soundToPlay: string;
    if (this._utilities.parseNumber(this.currentWinnings) <= this._utilities.parseNumber(ConstantsService.firstMilestoneAmount)) {
      soundToPlay = ConstantsService.easyQuestionsAudioFilePath;
    }
    else if (this._utilities.parseNumber(this.currentWinnings) <= this._utilities.parseNumber(ConstantsService.secondMilestoneAmount)) {
      soundToPlay = ConstantsService.mediumQuestionsAudioFilePath;
    }
    else if (this._utilities.parseNumber(this.currentWinnings) <= this._utilities.parseNumber(ConstantsService.thirdMilestoneAmount)) {
      soundToPlay = ConstantsService.hardQuestionsAudioFilePath;
    }
    this._audioManager.stopIfAudioIsPlaying();
    this._audioManager.playBackgroundSound(soundToPlay);
  }

}
