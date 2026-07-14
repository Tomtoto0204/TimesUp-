import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Router} from '@angular/router';

interface Player {
  name: string;
  teamId: number;
}

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [CommonModule, FormsModule], // A FormsModule kell az inputok kezeléséhez
  templateUrl: './lobby.html',
})
export class LobbyComponent {
  private router = inject(Router)

  themes = ['Általános', 'Filmek', 'Hírességek', 'Felnőtt (18+)'];
  selectedThemes: string[] = ['Általános']; // Kezdetben egy téma van kiválasztva


  toggleTheme(theme: string) {
    if (this.selectedThemes.includes(theme)) {
      this.selectedThemes = this.selectedThemes.filter(t => t !== theme);
    } else {
      this.selectedThemes.push(theme);
    }
  }

  selectAllThemes() {
    if (this.selectedThemes.length === this.themes.length) {
      this.selectedThemes = [];
    } else {
      this.selectedThemes = [...this.themes];
    }
  }

  newPlayerName = '';
  players: Player[] = [];
  teamCount = 2;

  get teamOptions() {
    return Array.from({ length: this.teamCount }, (_, i) => i + 1);
  }

  addPlayer() {
    if (this.newPlayerName.trim()) {
      this.players.push({
        name: this.newPlayerName.trim(),
        teamId: 1
      });
      this.newPlayerName = '';
    }
  }

  removePlayer(index: number) {
    this.players.splice(index, 1);
  }

  randomizeTeams() {
    let shuffled = [...this.players].sort(() => 0.5 - Math.random());
    shuffled.forEach((player, index) => {
      player.teamId = (index % this.teamCount) + 1;
    });
    this.players = shuffled;
  }

  startGame() {
    if (this.players.length < 2) {
      alert('Legalább 2 játékosra van szükség!');
      return;
    }
    console.log('Játék indítása a következő adatokkal:', {
      theme: this.selectedThemes,
      teams: this.teamCount,
      players: this.players
    });

    this.router.navigate(['/game']);
  }
}
