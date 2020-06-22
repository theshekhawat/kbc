import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameComponent } from './game-components/game.component';
import { AudiencePollComponent } from './game-components/audience-poll/audience-poll.component';


const routes: Routes = [
  { path: '', redirectTo: '/game-show', pathMatch: 'full'},
  { path: 'game-show', component: GameComponent },
  { path: 'audience-poll', component: AudiencePollComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [GameComponent, AudiencePollComponent];