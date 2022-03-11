import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {
  public static readonly lifeLineAudioFilePath: string                = './assets/sounds/lifelines.mp3';
  public static readonly switchTheQuestionImageSourcePath: string     = './assets/images/switch-the-question.png';
  public static readonly switchTheQuestionDoneImageSourcePath: string = './assets/images/switch-the-question-done.png';
  public static readonly askTheAudienceImageSourcePath: string        = './assets/images/ask-the-audience.png';
  public static readonly askTheAudienceDoneImageSourcePath: string    = './assets/images/ask-the-audience-done.png';
  public static readonly fiftyFiftyImageSourcePath: string            = './assets/images/fifty-fifty.png';
  public static readonly fiftyFiftyDoneImageSourcePath: string        = './assets/images/fifty-fifty-done.png';
  public static readonly doubleChanceImageSourcePath: string          = './assets/images/double-chance.png';
  public static readonly doubleChanceDoneImageSourcePath: string      = './assets/images/double-chance-done.png';
  public static readonly extraTimeImageSourcePath: string             = './assets/images/extra-time.png';
  public static readonly extraTimeDoneImageSourcePath: string         = './assets/images/extra-time-done.png';
  public static readonly askTheExpertImageSourcePath: string          = './assets/images/ask-the-expert.png';
  public static readonly askTheExpertDoneImageSourcePath: string      = './assets/images/ask-the-expert-done.png';
  public static readonly startNewGameAudioFilePath: string            = './assets/sounds/lets_play.mp3';
  public static readonly mainThemeAudioFilePath: string               = './assets/sounds/main_theme.mp3';
  public static readonly correctAnswerAudioFilePath: string           = './assets/sounds/correct_answer.mp3';
  public static readonly wrongAnswerAudioFilePath: string             = './assets/sounds/wrong_answer.mp3';
  public static readonly finalAnswerAudioFilePath: string             = './assets/sounds/final_answer.mp3';
  public static readonly quitTheGameAudioFilePath: string             = './assets/sounds/resign.mp3';
  public static readonly showNextQuestionAudioFilePath: string        = './assets/sounds/next.mp3';
  public static readonly easyQuestionsAudioFilePath: string           = './assets/sounds/easy.mp3';
  public static readonly mediumQuestionsAudioFilePath: string         = './assets/sounds/medium.mp3';
  public static readonly hardQuestionsAudioFilePath: string           = './assets/sounds/hard.mp3';
  public static readonly flipQuestionsSetJsonFilePath: string         = './assets/datasource/flip-questions-set-1.json';
  public static readonly questionsSetJsonFilePath: string             = './assets/datasource/questions-set-1.json';
  public static readonly questionTextPlaceHolder: string              = 'Question';
  public static readonly optionOneTextPlaceHolder: string             = 'Option 1';
  public static readonly optionTwoTextPlaceHolder: string             = 'Option 2';
  public static readonly optionThreeTextPlaceHolder: string           = 'Option 3';
  public static readonly optionFourTextPlaceHolder: string            = 'Option 4';
  public static readonly timeOver: string                             = 'Time Over!';
  public static readonly zero: string                                 = '0';
  public static readonly audiencePoll: string                         = 'audience-poll';
  public static readonly fiftyFifty: string                           = 'fifty-fifty';
  public static readonly switchTheQuestion: string                    = 'switch-the-question';
  public static readonly doubleChance: string                         = 'double-chance';
  public static readonly extraTime: string                            = 'extra-time';
  public static readonly askTheExpert: string                         = 'ask-the-expert';
  public static readonly percentageSign: string                       = '%';
  public static readonly emptyString: string                          = '';
  public static readonly exclamation: string                          = '!';
  public static readonly caseOptionOne: string                        = 'optionOne';
  public static readonly caseOptionTwo: string                        = 'optionTwo';
  public static readonly caseOptionThree: string                      = 'optionThree';
  public static readonly caseOptionFour: string                       = 'optionFour';
  public static readonly firstMilestoneAmount: string                 = '80,000';
  public static readonly secondMilestoneAmount: string                = '12,50,000';
  public static readonly thirdMilestoneAmount: string                 = '1,00,00,000';
  public static readonly startGameHeading: string                     = 'Start Game!';
  public static readonly nextQuestionHeading: string                  = 'Next';
  public static readonly quiteGameHeading: string                     = 'Quit';
  public static readonly Questions                                    = 'Questions';
  public static readonly informationAboutQuestion: string             = 'This is the place where knowledge with fun begins! Brace yourselves!';
}
