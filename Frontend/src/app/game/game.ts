import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router} from '@angular/router';
import {GameState} from '../game-state';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.html'
})
export class GameComponent {
  private router = inject(Router)
  private gameState = inject(GameState)
  currentPhase = this.gameState.currentPhase;
  phaseTitle = this.gameState.getPhaseTitle();
  phaseDescription = this.gameState.getPhaseDesc();

  currentTeam = this.gameState.currentTeamIndex+1 + '. Csapat';
  currentPlayerIndex:number = this.gameState.teams[this.gameState.currentTeamIndex].currentPlayerIndex;
  currentPlayer:string = this.gameState.teams[this.gameState.currentTeamIndex].players[this.currentPlayerIndex];
  startTimer() {
      this.router.navigate(['/play']);
  }
}
