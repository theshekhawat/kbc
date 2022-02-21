import { Injectable } from '@angular/core';
import { ConstantsService } from './constants.service';

@Injectable({
  providedIn: 'root'
})
export class GameShowUtilitiesService {
  public hasGameStarted: boolean;
  public imageSourceAskTheAudience: string;
  public imageSourceFlipTheQuestion: string;
  public imageSourceFiftyFifty: string;
  public imageSourceDoubleChance: string;
  public imageSourceExtraTime: string;
  public imageSourceAskTheExpert: string;
  public isOptionOneLocked: boolean;
  public isOptionTwoLocked: boolean;
  public isOptionThreeLocked: boolean;
  public isOptionFourLocked: boolean;
  public isOptionOneEnabled: boolean;
  public isOptionTwoEnabled: boolean;
  public isOptionThreeEnabled: boolean;
  public isOptionFourEnabled: boolean;
  public rightAnswerOptionOne: boolean;
  public rightAnswerOptionTwo: boolean;
  public rightAnswerOptionThree: boolean;
  public rightAnswerOptionFour: boolean;
  public wrongAnswerOptionOne: boolean;
  public wrongAnswerOptionTwo: boolean;
  public wrongAnswerOptionThree: boolean;
  public wrongAnswerOptionFour: boolean;
  public audiencePollOptionOnePercentage: string;
  public audiencePollOptionTwoPercentage: string;
  public audiencePollOptionThreePercentage: string;
  public audiencePollOptionFourPercentage: string;
  public lifelineFiftyFiftyLocked = false;
  public lifelineDoubleChanceLocked = false;
  public lifelineAskTheAudienceLocked = false;
  public lifelineFlipTheQuestionLocked = false;
  public lifelineExtraTimeLocked = false;
  public lifelineAskTheExpertLocked = false;
  public isFlippedQuestionPresented = false;
  public doubleChanceCounter = 0;
  public startGameHeading: string = ConstantsService.startGameHeading;
  public nextQuestionHeading: string = ConstantsService.nextQuestionHeading;
  public quitGameHeading: string = ConstantsService.quiteGameHeading;
  public questionInformation: string = ConstantsService.informationAboutQuestion;

  constructor() {
    this.hasGameStarted = false;
    this.isOptionOneEnabled = true;
    this.isOptionTwoEnabled = true;
    this.isOptionThreeEnabled = true;
    this.isOptionFourEnabled = true;
    this.setInitialPathForLifeLineImages();
    this.resetOptions();
  }

  public setInitialPathForLifeLineImages() {
    this.imageSourceAskTheAudience = ConstantsService.askTheAudienceImageSourcePath;
    this.imageSourceFlipTheQuestion = ConstantsService.switchTheQuestionImageSourcePath;
    this.imageSourceFiftyFifty = ConstantsService.fiftyFiftyImageSourcePath;
    this.imageSourceDoubleChance = ConstantsService.doubleChanceImageSourcePath;
    this.imageSourceExtraTime = ConstantsService.extraTimeImageSourcePath;
    this.imageSourceAskTheExpert = ConstantsService.askTheExpertImageSourcePath;
  }

  public resetOptions() {
    this.isOptionOneLocked = false;
    this.isOptionTwoLocked = false;
    this.isOptionThreeLocked = false;
    this.isOptionFourLocked = false;
    this.rightAnswerOptionOne = false;
    this.rightAnswerOptionTwo = false;
    this.rightAnswerOptionThree = false;
    this.rightAnswerOptionFour = false;
    this.wrongAnswerOptionOne = false;
    this.wrongAnswerOptionTwo = false;
    this.wrongAnswerOptionThree = false;
    this.wrongAnswerOptionFour = false;
    this.audiencePollOptionOnePercentage = ConstantsService.emptyString;
    this.audiencePollOptionTwoPercentage = ConstantsService.emptyString;
    this.audiencePollOptionThreePercentage = ConstantsService.emptyString;
    this.audiencePollOptionFourPercentage = ConstantsService.emptyString;
    this.questionInformation = ConstantsService.informationAboutQuestion;
    this.doubleChanceCounter = 0;
    this.setWrongAnswer(false);

  }

  public setOptions(isOptionEnabled: boolean) {
    this.isOptionOneEnabled = this.isOptionTwoEnabled = this.isOptionThreeEnabled = this.isOptionFourEnabled = isOptionEnabled;
  }

  public setRightAnswer(isRightAnswerEnabled: boolean) {
    this.rightAnswerOptionOne = this.rightAnswerOptionTwo = this.rightAnswerOptionThree = this.rightAnswerOptionFour = isRightAnswerEnabled;
  }

  public setWrongAnswer(isWrongAnswerEnabled: boolean) {
    this.wrongAnswerOptionOne = this.wrongAnswerOptionTwo = this.wrongAnswerOptionThree = this.wrongAnswerOptionFour = isWrongAnswerEnabled;
  }

  public setLifeLines(isLifeLineEnabled: boolean) {
    this.lifelineAskTheAudienceLocked = this.lifelineFlipTheQuestionLocked = this.lifelineFiftyFiftyLocked =
      this.lifelineDoubleChanceLocked = this.lifelineExtraTimeLocked = this.lifelineAskTheExpertLocked = isLifeLineEnabled;
  }

  public prepareWinningDetails() {
    return ['5,000', '10,000', '20,000', '40,000', '80,000', '1,60,000', '3,20,000', '6,40,000', '12,50,000', '25 Lakh', '50 Lakh',
      '1 Crore', '3 Crore', '5 Crore', '7 Crore'];
  }

  public isFirstGuessRight(): boolean {
    if (this.lifelineDoubleChanceLocked) {
      this.doubleChanceCounter++;
      if (this.doubleChanceCounter < 2) {
        this.setRightAnswer(false);
        return true;
      }
      return false;
    }
  }

  parseNumber(stringToBeConverted: string) {
    switch (stringToBeConverted) {
      case '25 Lakh':
        stringToBeConverted = '25,00,000';
        break;
      case '50 Lakh':
        stringToBeConverted = '50,00,000';
        break;
      case '1 Crore':
        stringToBeConverted = '1,00,00,000';
        break;
      case '3 Crore':
        stringToBeConverted = '3,00,00,000';
        break;
      case '5 Crore':
        stringToBeConverted = '5,00,00,000';
        break;
      case '7 Crore':
        stringToBeConverted = '7,00,00,000';
        break;
    }
    stringToBeConverted = stringToBeConverted || '';
    let decimal = '.';
    stringToBeConverted = stringToBeConverted.replace(/[^0-9$.,]/g, '');
    if (stringToBeConverted.indexOf(',') > stringToBeConverted.indexOf('.')) { decimal = ','; }
    if ((stringToBeConverted.match(new RegExp('\\' + decimal, 'g')) || []).length > 1) { decimal = ''; }
    if (decimal !== '' && (stringToBeConverted.length - stringToBeConverted.indexOf(decimal) - 1 === 3) &&
    stringToBeConverted.indexOf('0' + decimal) !== 0) { decimal = ''; }
    stringToBeConverted = stringToBeConverted.replace(new RegExp('[^0-9$' + decimal + ']', 'g'), '');
    stringToBeConverted = stringToBeConverted.replace(',', '.');
    return parseFloat(stringToBeConverted);
  }

  isMobile() {
    const match = window.matchMedia;
    if (match) {
      const mq = match('(pointer:coarse)');
      return mq.matches;
    }
    return false;
  }
}
