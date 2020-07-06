import { Component, OnInit } from '@angular/core';
import { IQuizQuestionsSet } from '../model/IQuizQuestionsSet';

@Component({
  selector: 'app-upload-questions',
  templateUrl: './upload-questions.component.html',
  styleUrls: ['./upload-questions.component.css']
})
export class UploadQuestionsComponent implements OnInit {

  private questionSetArray:Array<IQuizQuestionsSet>;
  public questionSet: IQuizQuestionsSet;
  public optionsArray: Array<string> = ['optionOne', 'optionTwo', 'optionThree', 'optionFour'];
  constructor() {
    this.questionSet = {
      audiencePoll: null,
      question: '',
      optionOne: '',
      optionTwo: '',
      optionThree: '',
      optionFour: '',
      rightAnswer: this.optionsArray[0],
      information: ''
    }
  }

  ngOnInit(): void {
  }

  submitted = false;

  onSubmit() { this.submitted = true; }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.questionSetArray); }

  }
