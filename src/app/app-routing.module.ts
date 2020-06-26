import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameComponent } from './game-components/game.component';
import { AudiencePollComponent } from './game-components/audience-poll/audience-poll.component';
import { NavigationComponent } from './navigation/navigation.component';
import { RulesComponent } from './rules/rules.component';
import { AboutMeComponent } from './about-me/about-me.component';
import { StartupComponent } from './startup/startup.component';


const routes: Routes = [
  { path: '', redirectTo: '/startup', pathMatch: 'full'},
  { path: 'game-show', component: GameComponent },
  { path: 'audience-poll', component: AudiencePollComponent },
  { path: 'operations', component: NavigationComponent },
  { path: 'rules', component: RulesComponent },
  { path: 'about', component: AboutMeComponent },
  { path: 'startup', component: StartupComponent },
  {path: '**', redirectTo: '/startup'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [GameComponent, AudiencePollComponent];