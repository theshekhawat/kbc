import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { HttpClientModule} from '@angular/common/http';
import { QuizInformationDetailsService } from './services/quiz-information-details.service';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-Charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TimerComponent } from './game-components/timer/timer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    TimerComponent,
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ChartsModule,
    NgbModule,
    BrowserAnimationsModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [
    QuizInformationDetailsService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
