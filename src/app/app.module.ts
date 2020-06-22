import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import {HttpClientModule} from '@angular/common/http'
import { QuizInformationDetailsService } from './services/quiz-information-details.service';
import { FormsModule } from "@angular/forms";
import { AudiencePollComponent } from './game-components/audience-poll/audience-poll.component';
import { ChartsModule } from "ng2-Charts";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TimerComponent } from './game-components/timer/timer.component';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    AudiencePollComponent,
    TimerComponent,
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ChartsModule,
    NgbModule
  ],
  providers: [
    QuizInformationDetailsService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
