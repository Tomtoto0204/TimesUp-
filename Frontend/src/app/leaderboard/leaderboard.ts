import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameState } from '../game-state';

interface Team {
  teamId: number;
  players: string[];
  teamScore: number;
  currentPlayerIndex: number;
}

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leaderboard.html'
})
export class LeaderboardComponent implements OnInit {
  private router = inject(Router);
  private gameState = inject(GameState);

  sortedTeams: Team[] = [];

  ngOnInit() {
    this.sortedTeams = [...this.gameState.teams].sort((a, b) => b.teamScore - a.teamScore);
  }

  startNewGame() {
    this.gameState.resetGame();
    this.router.navigate(['/']); // Vissza a Lobbyba
  }
}
