import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { AudioManagerService } from 'src/app/services/audio-manager.service';
import { QuizInformationDetailsService } from '../services/quiz-information-details.service';
import { IQuizQuestionsSet } from '../model/IQuizQuestionsSet';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AudiencePollComponent } from './audience-poll/audience-poll.component';
import { DataService } from '../services/data.service';
import { ConstantsService } from '../services/constants.service';
import { GameShowUtilitiesService } from '../services/utilities.service';
import { TimerComponent } from './timer/timer.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  providers: [GameShowUtilitiesService, TimerComponent]
})
export class GameComponent implements OnInit {
  //#region view-child
  @ViewChild('questionPlaceholder', { static: true }) questionElement: ElementRef;
  @ViewChild('optionOnePlaceHolder', { static: true }) optionOneElement: ElementRef;
  @ViewChild('optionTwoPlaceHolder', { static: true }) optionTwoElement: ElementRef;
  @ViewChild('optionThreePlaceHolder', { static: true }) optionThreeElement: ElementRef;
  @ViewChild('optionFourPlaceHolder', { static: true }) optionFourElement: ElementRef;
  @ViewChild('information', { static: true }) informationElement: ElementRef;
  //#endregion

  //#region public-properties
  public currentWinnings: string;
  public guaranteedWinnings: string;
  public username: string = ConstantsService.emptyString;
  public isNextQuestionAllowed = false;
  public hasOptionBeenLocked = false;
  public isGameReset = false;
  public isCollapsed = true;
  public arrayIndex: number;
  //#endregion

  //#region private-properties
  private questions: Array<string>;
  private flippedQuestionDetails: IQuizQuestionsSet;
  private winningDetails: Array<string>;
  //#endregion

  constructor(
    private audioManagerService: AudioManagerService,
    private quizInformationDetailsService: QuizInformationDetailsService,
    private modalService: NgbModal,
    private dataService: DataService,
    public utilitiesService: GameShowUtilitiesService,
    public timerComponent: TimerComponent
  ) {
    this.arrayIndex = 0;
    this.username = ConstantsService.emptyString;
    this.currentWinnings = ConstantsService.zero;
    this.guaranteedWinnings = ConstantsService.zero;
  }

  ngOnInit(): void {
    this.checkIsBrowserMobile();
    this.getQuizQuestions();
    this.prepareWinningsDetails();
  }
  checkIsBrowserMobile() {
    if (this.utilitiesService.isMobile()) {
      this.utilitiesService.startGameHeading = this.utilitiesService.quitGameHeading = this.utilitiesService.nextQuestionHeading = '';
    }
  }

  getTheLifeline(lifeline: string) {
    if (this.utilitiesService.hasGameStarted && !this.hasOptionBeenLocked) {
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
    this.utilitiesService.hasGameStarted = true;
    if (this.arrayIndex === 0 && username.length) {
      this.audioManagerService.stopIfAudioIsPlaying();
      this.audioManagerService.playBackgroundSound(ConstantsService.startNewGameAudioFilePath);
      this.presentQuestion();
    }
  }

  showNextQuestion() {
    if (this.utilitiesService.hasGameStarted && this.hasOptionBeenLocked && this.isNextQuestionAllowed) {
      this.resetOptions();
      this.utilitiesService.setLifeLines(false);
      this.audioManagerService.stopIfAudioIsPlaying();
      this.audioManagerService.playBackgroundSound(ConstantsService.showNextQuestionAudioFilePath);
      this.presentQuestion();
    }
  }

  quitTheGame() {
    if (this.utilitiesService.hasGameStarted) {
      this.audioManagerService.playBackgroundSound(ConstantsService.quitTheGameAudioFilePath);
      this.resetTheGame();
      this.resetOptions();
      this.utilitiesService.setLifeLines(false);
    }
  }

  lockOptionAndWait(optionNumber: number, isEnabled: boolean) {
    if (this.utilitiesService.hasGameStarted && isEnabled) {
      this.isNextQuestionAllowed = false;
      this.hasOptionBeenLocked = true;
      this.audioManagerService.playBackgroundSound(ConstantsService.finalAnswerAudioFilePath);

      let lockedAnswer: number;
      lockedAnswer = this.getsLockedOption(optionNumber);
      this.utilitiesService.setOptions(false);
      this.isNextQuestionAllowed = false;
      this.timerComponent.pauseTheClock();
      if (this.utilitiesService.lifelineDoubleChanceLocked) {
        this.optionLocked(lockedAnswer);
      }
      else {
        setTimeout(this.optionLocked, 4000, lockedAnswer);
      }
    }
  }

  optionLocked = async (lockedAnswer: number) => {
    this.utilitiesService.setOptions(true);
    let correctAnswer: number;
    let choice: string;
    if (this.utilitiesService.lifelineFlipTheQuestionLocked && this.utilitiesService.isFlippedQuestionPresented) {
      choice = this.flippedQuestionDetails.rightAnswer;
    }
    else {
      // tslint:disable-next-line: no-string-literal
      choice = this.questions['Questions'][this.arrayIndex - 1].rightAnswer;
    }
    correctAnswer = this.getsRightAnswer(choice);

    if (lockedAnswer === correctAnswer) {
      if (this.isCollapsed) {
        this.calculateWinnings();
        this.isNextQuestionAllowed = true;
      }
      else {
        this.isNextQuestionAllowed = false;
        this.utilitiesService.isFlippedQuestionPresented = false;
      }

      this.utilitiesService.setOptions(false);
      this.audioManagerService.playBackgroundSound(ConstantsService.correctAnswerAudioFilePath);
    }
    else {
      if (this.utilitiesService.isFirstGuessRight()) {
        this.getsWrongOption(lockedAnswer);
        return;
      }

      if (this.isCollapsed) {
        this.calculateWinnings();
        this.utilitiesService.setOptions(false);
        this.currentWinnings = this.guaranteedWinnings;
      }
      else {
        this.utilitiesService.isFlippedQuestionPresented = false;
      }
      this.isNextQuestionAllowed = false;
      this.getsWrongOption(lockedAnswer);
      this.audioManagerService.playBackgroundSound(ConstantsService.wrongAnswerAudioFilePath);
    }
    this.informationElement.nativeElement.innerHTML = this.questions[ConstantsService.Questions][this.arrayIndex - 1].information;
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
    this.questionElement.nativeElement.innerHTML = ConstantsService.timeOver;
  }

  private startTheTimer() {
    const deadline = new Date(Date.parse(new Date().toString()) + 600 * 1000);
    this.timerComponent.startTheClock(deadline);
  }

  private stopTheTimer() {
    this.timerComponent.stopTheClock();
  }

  private getsRightAnswer(choice: string) {
    let correctAnswer: number;
    switch (choice) {
      case ConstantsService.caseOptionOne:
        this.utilitiesService.rightAnswerOptionOne = true;
        correctAnswer = 1;
        break;
      case ConstantsService.caseOptionTwo:
        this.utilitiesService.rightAnswerOptionTwo = true;
        correctAnswer = 2;
        break;
      case ConstantsService.caseOptionThree:
        this.utilitiesService.rightAnswerOptionThree = true;
        correctAnswer = 3;
        break;
      case ConstantsService.caseOptionFour:
        this.utilitiesService.rightAnswerOptionFour = true;
        correctAnswer = 4;
        break;
    }
    return correctAnswer;
  }

  private getsLockedOption(optionNumber: number) {
    let lockedAnswer: number;
    switch (optionNumber) {
      case 1:
        this.utilitiesService.isOptionOneLocked = true;
        lockedAnswer = 1;
        break;
      case 2:
        this.utilitiesService.isOptionTwoLocked = true;
        lockedAnswer = 2;
        break;
      case 3:
        this.utilitiesService.isOptionThreeLocked = true;
        lockedAnswer = 3;
        break;
      case 4:
        this.utilitiesService.isOptionFourLocked = true;
        lockedAnswer = 4;
        break;
    }
    return lockedAnswer;
  }

  private getsWrongOption(optionNumber: number) {
    switch (optionNumber) {
      case 1:
        this.utilitiesService.wrongAnswerOptionOne = true;
        break;
      case 2:
        this.utilitiesService.wrongAnswerOptionTwo = true;
        break;
      case 3:
        this.utilitiesService.wrongAnswerOptionThree = true;
        break;
      case 4:
        this.utilitiesService.wrongAnswerOptionFour = true;
        break;
    }
  }

  private getQuizQuestions() {
    this.quizInformationDetailsService.getsQuestionsList().subscribe(
      (data) => this.questions = data,
      (error) => (console.log(error))
    );
  }

  private calculateWinnings() {
    if (this.utilitiesService.hasGameStarted) {
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
    if (!this.utilitiesService.lifelineDoubleChanceLocked) {
      this.audioManagerService.playBackgroundSound(ConstantsService.lifeLineAudioFilePath);
      this.utilitiesService.lifelineDoubleChanceLocked = true;
      this.utilitiesService.imageSourceDoubleChance = ConstantsService.doubleChanceDoneImageSourcePath;
    }
  }

  private lifeLineFiftyFifty() {
    if (!this.utilitiesService.lifelineFiftyFiftyLocked) {
      this.audioManagerService.playBackgroundSound(ConstantsService.lifeLineAudioFilePath);
      this.utilitiesService.lifelineFiftyFiftyLocked = true;
      this.utilitiesService.imageSourceFiftyFifty = ConstantsService.fiftyFiftyDoneImageSourcePath;
      switch (this.questions[ConstantsService.Questions][this.arrayIndex - 1].rightAnswer) {
        case ConstantsService.caseOptionOne:
          this.optionFourElement.nativeElement.innerHTML = ConstantsService.exclamation;
          this.optionThreeElement.nativeElement.innerHTML = ConstantsService.exclamation;
          this.utilitiesService.isOptionFourEnabled = false;
          this.utilitiesService.isOptionThreeEnabled = false;
          break;
        case ConstantsService.caseOptionTwo:
          this.optionOneElement.nativeElement.innerHTML = ConstantsService.exclamation;
          this.optionThreeElement.nativeElement.innerHTML = ConstantsService.exclamation;
          this.utilitiesService.isOptionOneEnabled = false;
          this.utilitiesService.isOptionThreeEnabled = false;
          break;
        case ConstantsService.caseOptionThree:
          this.optionOneElement.nativeElement.innerHTML = ConstantsService.exclamation;
          this.optionTwoElement.nativeElement.innerHTML = ConstantsService.exclamation;
          this.utilitiesService.isOptionOneEnabled = false;
          this.utilitiesService.isOptionTwoEnabled = false;
          break;
        case ConstantsService.caseOptionFour:
          this.optionOneElement.nativeElement.innerHTML = ConstantsService.exclamation;
          this.optionThreeElement.nativeElement.innerHTML = ConstantsService.exclamation;
          this.utilitiesService.isOptionOneEnabled = false;
          this.utilitiesService.isOptionThreeEnabled = false;
          break;
      }
    }
  }

  private lifeLineAskTheExpert() {
    if (!this.utilitiesService.lifelineAskTheExpertLocked) {
      this.audioManagerService.playBackgroundSound(ConstantsService.lifeLineAudioFilePath);
      this.utilitiesService.lifelineAskTheExpertLocked = true;
      this.utilitiesService.imageSourceAskTheExpert = ConstantsService.askTheExpertDoneImageSourcePath;
      const query = this.questions[ConstantsService.Questions][this.arrayIndex - 1].question;
      window.open(`http://google.com/search?q=${query}`);
    }
  }

  private lifeLineAskTheAudience() {
    if (!this.utilitiesService.lifelineAskTheAudienceLocked) {
      this.timerComponent.pauseTheClock();
      this.audioManagerService.playBackgroundSound(ConstantsService.lifeLineAudioFilePath);
      this.utilitiesService.lifelineAskTheAudienceLocked = true;
      this.utilitiesService.imageSourceAskTheAudience = ConstantsService.askTheAudienceDoneImageSourcePath;
      const modalRef = this.modalService.open(AudiencePollComponent,
        {
          size: 'lg',
          centered: true,
          keyboard: true
        });
      modalRef.componentInstance.name = ConstantsService.audiencePoll;
      modalRef.result.then((data) => {
        // Close Event
        this.showAudiencePollPercentage();
        this.timerComponent.resumeTheClock();
      }, (reason) => {
        // dismiss event
        this.showAudiencePollPercentage();
        this.timerComponent.resumeTheClock();
      });
    }
  }

  private lifeLineFlipTheQuestion() {
    if (!this.utilitiesService.lifelineFlipTheQuestionLocked) {
      this.audioManagerService.playBackgroundSound(ConstantsService.lifeLineAudioFilePath);
      this.utilitiesService.imageSourceFlipTheQuestion = ConstantsService.switchTheQuestionDoneImageSourcePath;
      this.utilitiesService.lifelineFlipTheQuestionLocked = true;
      this.isCollapsed = false;
      this.quizInformationDetailsService.getsFlipQuestionsList().subscribe(
        (data) => {
          this.flippedQuestionDetails = data;
          this.timerComponent.pauseTheClock();
        },
        (error) => (console.log(error))
      );
    }
  }

  private lifeLineExtraTime() {
    if (!this.utilitiesService.lifelineExtraTimeLocked) {
      this.audioManagerService.playBackgroundSound(ConstantsService.lifeLineAudioFilePath);
      this.utilitiesService.imageSourceExtraTime = ConstantsService.extraTimeDoneImageSourcePath;
      this.utilitiesService.lifelineExtraTimeLocked = true;
      this.timerComponent.incrementTheClockBy(60);
    }
  }

  private showAudiencePollPercentage() {
    const audiencePollDataArray = JSON.parse('[' + this.questions[ConstantsService.Questions][this.arrayIndex - 1].audiencePoll + ']');
    this.utilitiesService.audiencePollOptionOnePercentage = audiencePollDataArray[0] + ConstantsService.percentageSign;
    this.utilitiesService.audiencePollOptionTwoPercentage = audiencePollDataArray[1] + ConstantsService.percentageSign;
    this.utilitiesService.audiencePollOptionThreePercentage = audiencePollDataArray[2] + ConstantsService.percentageSign;
    this.utilitiesService.audiencePollOptionFourPercentage = audiencePollDataArray[3] + ConstantsService.percentageSign;
  }

  private prepareWinningsDetails() {
    this.winningDetails = this.utilitiesService.prepareWinningDetails();
  }

  private resetOptions() {
    this.utilitiesService.resetOptions();
    this.utilitiesService.setOptions(true);
    if (this.isCollapsed) {
      this.utilitiesService.isFlippedQuestionPresented = false;
    }
    this.stopTheTimer();
  }

  private resetTheGame() {
    this.questionElement.nativeElement.innerHTML = ConstantsService.questionTextPlaceHolder;
    this.optionOneElement.nativeElement.innerHTML = ConstantsService.optionOneTextPlaceHolder;
    this.optionTwoElement.nativeElement.innerHTML = ConstantsService.optionTwoTextPlaceHolder;
    this.optionThreeElement.nativeElement.innerHTML = ConstantsService.optionThreeTextPlaceHolder;
    this.optionFourElement.nativeElement.innerHTML = ConstantsService.optionFourTextPlaceHolder;
    this.informationElement.nativeElement.innerHTML = ConstantsService.informationAboutQuestion;
    this.arrayIndex = 0;
    this.utilitiesService.hasGameStarted = false;
    this.username = ConstantsService.emptyString;
    this.flippedQuestionDetails = null;
    this.isGameReset = true;
    this.currentWinnings = ConstantsService.zero;
    this.guaranteedWinnings = ConstantsService.zero;
    this.isCollapsed = true;
    this.utilitiesService.isFlippedQuestionPresented = true;
    this.utilitiesService.setInitialPathForLifeLineImages();
    this.utilitiesService.setLifeLines(false);
  }

  private presentQuestion() {
    this.questionElement.nativeElement.innerHTML = this.questions[ConstantsService.Questions ?? 'Questions'][this.arrayIndex].question;
    this.optionOneElement.nativeElement.innerHTML = this.questions[ConstantsService.Questions ?? 'Questions'][this.arrayIndex].optionOne;
    this.optionTwoElement.nativeElement.innerHTML = this.questions[ConstantsService.Questions ?? 'Questions'][this.arrayIndex].optionTwo;
    this.optionThreeElement.nativeElement.innerHTML = this.questions[ConstantsService.Questions ?? 'Questions'][this.arrayIndex].optionThree;
    this.optionFourElement.nativeElement.innerHTML = this.questions[ConstantsService.Questions ?? 'Questions'][this.arrayIndex].optionFour;
    this.informationElement.nativeElement.innerHTML = ConstantsService.informationAboutQuestion;
    this.isNextQuestionAllowed = true;
    this.hasOptionBeenLocked = false;
    this.arrayIndex++;
    this.dataService.changeMessage(this.questions[ConstantsService.Questions][this.arrayIndex - 1].audiencePoll);
    this.startTheTimer();
    this.playQuestionsBackgroundSound();
  }

  private presentFlippedQuestion() {
    this.questionElement.nativeElement.innerHTML = this.flippedQuestionDetails.question;
    this.optionOneElement.nativeElement.innerHTML = this.flippedQuestionDetails.optionOne;
    this.optionTwoElement.nativeElement.innerHTML = this.flippedQuestionDetails.optionTwo;
    this.optionThreeElement.nativeElement.innerHTML = this.flippedQuestionDetails.optionThree;
    this.optionFourElement.nativeElement.innerHTML = this.flippedQuestionDetails.optionFour;
    this.informationElement.nativeElement.innerHTML = ConstantsService.informationAboutQuestion;
    this.dataService.changeMessage(this.flippedQuestionDetails.audiencePoll);
    this.utilitiesService.isFlippedQuestionPresented = true;
    this.startTheTimer();
    this.playQuestionsBackgroundSound();
  }

  private playQuestionsBackgroundSound() {
    let soundToPlay: string;
    if (this.utilitiesService.parseNumber(this.currentWinnings) <
      this.utilitiesService.parseNumber(ConstantsService.firstMilestoneAmount)) {
      soundToPlay = ConstantsService.easyQuestionsAudioFilePath;
    }
    else if (this.utilitiesService.parseNumber(this.currentWinnings) <
      this.utilitiesService.parseNumber(ConstantsService.secondMilestoneAmount)) {
      soundToPlay = ConstantsService.mediumQuestionsAudioFilePath;
    }
    else if (this.utilitiesService.parseNumber(this.currentWinnings) <
      this.utilitiesService.parseNumber(ConstantsService.thirdMilestoneAmount)) {
      soundToPlay = ConstantsService.hardQuestionsAudioFilePath;
    }
    this.audioManagerService.stopIfAudioIsPlaying();
    this.audioManagerService.playBackgroundSound(soundToPlay);
  }

}
