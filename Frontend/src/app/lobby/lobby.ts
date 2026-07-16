import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Router} from '@angular/router';
import {GameState} from '../game-state';

interface Player {
  name: string;
  teamId: number;
}
interface Team {
  teamId: number;
  players: string[];
  teamScore: number;
  currentPlayerIndex: number;
}


@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lobby.html',
})
export class LobbyComponent {
  private router = inject(Router)
  private gameState = inject(GameState)
  themes = ['Általános', 'Filmek', 'TV Műsorok', 'Társasjátékok', 'Színészek', 'Hírességek', 'Videójátékok', 'Foglalkozások', 'Mesék és Gyerekműsorok', 'IT kifejezések', 'Történelmi események', 'Felnőtt(18+)'];
  selectedThemes: string[] = ['Általános']; // Kezdetben egy téma van kiválasztva
  teams : Team[] = [];


  hasSavedGame = false;

  ngOnInit() {
    this.hasSavedGame = this.gameState.hasSavedGame();
  }

  resumeGame() {
    this.gameState.loadState();
    this.router.navigate(['/game']);
  }

  deleteSave() {
    this.gameState.clearSavedState();
    this.hasSavedGame = false;
  }

  toggleTheme(theme: string) {
    if (this.selectedThemes.includes(theme)) {
      this.selectedThemes = this.selectedThemes.filter(t => t !== theme);
    } else {
      this.selectedThemes.push(theme);
    }
  }

  selectAllThemes() {
    if (this.selectedThemes.length === this.themes.length-1) {
      this.selectedThemes = [];
    } else {
      this.selectedThemes = [...this.themes]
      this.toggleTheme("Felnőtt(18+)");
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

  async startGame() {
    this.teams = [];
    for (const player of this.players) {
      let newteam = true;
      for (const team of this.teams) {
        if(team.teamId == player.teamId){
          team.players.push(player.name);
          newteam = false;
        }
      }
      if (newteam){
        this.teams.push({
          teamId : player.teamId,
          teamScore : 0,
          players : [player.name],
          currentPlayerIndex : 0
        })
      }
    }
    for (let i = 0; i < this.teamCount; i++) {
      if (this.teams[i].players.length<2){
        alert('Legalább 2 játékosra van szükség minden csapatban!');
        return;
      }
    }

    console.log('Játék indítása a következő adatokkal:', {
      theme: this.selectedThemes,
      teams: this.teamCount,
      players: this.players
    });
    await this.gameState.initGame( this.teams, this.selectedThemes);
    this.router.navigate(['/game']);
  }
}
