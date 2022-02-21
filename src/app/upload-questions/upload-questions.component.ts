import { Component, OnInit } from '@angular/core';
import { IQuizQuestionsSet } from '../model/IQuizQuestionsSet';

@Component({
  selector: 'app-upload-questions',
  templateUrl: './upload-questions.component.html',
  styleUrls: ['./upload-questions.component.css']
})
export class UploadQuestionsComponent implements OnInit {
  constructor() {
    this.questionSet = {
      audiencePoll: null,
      question: '',
      optionOne: '',
      optionTwo: '',
      optionThree: '',
      optionFour: '',
      rightAnswer: '',
      information: ''
    };
  }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.questionSetArray); }

  private questionSetArray: Array<IQuizQuestionsSet>;
  public questionSet: IQuizQuestionsSet;
  public optionsArray: Array<string> = ['optionOne', 'optionTwo', 'optionThree', 'optionFour'];

  submitted = false;

  ngOnInit(): void {
  }

  onSubmit() { this.submitted = true; }

  }
