import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {GameState} from '../game-state';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.html'
})
export class SummaryComponent {
  private router = inject(Router);
  private gameState = inject(GameState)
  teamName = this.gameState.currentTeamIndex + 1 + ". Csapat";
  roundPoints = this.gameState.currentScore;
  previousTotal = this.gameState.teams[this.gameState.currentTeamIndex].teamScore;

  get newTotal() {
    return this.previousTotal + this.roundPoints;
  }

  nextTurn() {
    this.gameState.nextPlayer();
    if (this.gameState.isGameFinished()) {
      this.router.navigate(['/leaderboard']);
      return
    }
    this.router.navigate(['/game']);
  }
}
