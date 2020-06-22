import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators'
import { IQuizQuestionsSet } from '../model/IQuizQuestionsSet';

@Injectable({
  providedIn: 'root'
})
export class QuizInformationDetailsService {
  private _quizQuestionsSet: string = '/assets/datasource/questions-set-5.json';
  private _quizFlipQuestionsSet: string = '/assets/datasource/flip-questions-set-5.json';
  constructor(private httpClient: HttpClient) { }

  getsQuestionsList(): Observable<any> {
    return this.httpClient.get<IQuizQuestionsSet[]>(this._quizQuestionsSet).pipe(
      catchError(
      this.errorHandler
      ));
  }

  getsFlipQuestionsList(): Observable<any> {
    return this.httpClient.get<IQuizQuestionsSet>(this._quizFlipQuestionsSet).pipe(
      catchError(
      this.errorHandler
      ));
  }

  errorHandler(error: HttpErrorResponse) {
    if (error.status == 401) {
      return observableThrowError('Status ' + error.status + ': You are not authorized to access this service.');
    }
    else if (error.status == 400) {
      return observableThrowError('Status ' + error.status + ': Bad request!');
    }
    else if (error.status == 0) {
      return observableThrowError('Status ' + error.status + ': Unknown Error!');
    }
    else if (error.status == 404) {
      return observableThrowError('Status ' + error.status + ': Not found!');
    }
    return observableThrowError(error.message || 'Server Error');
  }
}
