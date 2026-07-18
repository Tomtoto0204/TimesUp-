import { Routes } from '@angular/router';
import { LobbyComponent } from './lobby/lobby';
import { GameComponent } from './game/game';
import {PlayComponent} from './play/play';
import {SummaryComponent} from './summary/summary';
import {LeaderboardComponent} from './leaderboard/leaderboard';
import {EditComponent} from './edit/edit';

export const routes: Routes = [
  { path: '', component: LobbyComponent },
  { path: 'game', component: GameComponent },
  { path: 'play', component: PlayComponent },
  { path: 'summary', component: SummaryComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: 'edit', component: EditComponent }
];
