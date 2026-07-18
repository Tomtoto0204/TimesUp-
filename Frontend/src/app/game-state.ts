import {inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
interface Player {
  name: string;
  teamId: number;
}

interface Team {
  teamId: number;
  players: string[];
  teamScore: number;
  currentPlayerIndex:number;
}
interface Phase{
  phaseId: number,
  phaseTitle: string,
  phaseDesc: string
}
interface WordsData {
  [themeName: string]: string[];
}
@Injectable({
  providedIn: 'root'
})
export class GameState {
  private http = inject(HttpClient);
  router:Router = inject(Router)
  words: string[] = [];
  remainingWords = this.words;
  timeLeft:number = 60;
  teams : Team[] = []
  currentTeamIndex = 0;
  currentPhase = 1;
  currentScore = 0;
  difficulty:string = "easy";
  private isFinished: boolean = false;

  async initGame(teams: Team[], themes:string[], difficulty:string) {
    this.teams = teams;
    let masterDeck: string[] = [];
    if (difficulty == "easy"){
      this.difficulty = "easy";
      this.timeLeft = 60;
    }else{
      this.timeLeft = 40;
      this.difficulty = "hard";
    }

    try {
      const data = await firstValueFrom(this.http.get<WordsData>('/words.json'));
      for (const theme of themes) {
        const themeWords = data[theme];
        if (themeWords) {
          masterDeck.push(...data[theme]);
        }
      }
      console.log('Betöltött adatok:', data)
      if (masterDeck.length < 40) {
        alert(`Figyelem! A kiválasztott témákban összesen csak ${masterDeck.length} szó van 40 helyett.`);
      }
      masterDeck = masterDeck.sort(() => 0.5 - Math.random());
      this.words = masterDeck.slice(0, 40);
      this.remainingWords = [...this.words];
    } catch (error) {
      console.error('Hiba történt a szavak betöltésekor:', error);
      alert('Nem sikerült betölteni a szótárat!');
    }
  }
  nextPlayer(){
    if (this.teams[this.currentTeamIndex].currentPlayerIndex + 1 == this.teams[this.currentTeamIndex].players.length){
      this.teams[this.currentTeamIndex].currentPlayerIndex = 0;
    }else {
      this.teams[this.currentTeamIndex].currentPlayerIndex++;
    }

    this.teams[this.currentTeamIndex].teamScore += this.currentScore;
    this.currentScore = 0;
    if (this.currentTeamIndex+1 == this.teams.length){
      this.currentTeamIndex = 0;
    }else{
      this.currentTeamIndex++;
    }
    this.saveState()

  }

  getPhaseTitle(){
    switch (this.currentPhase){
      case 1:
        return "Körülírás!"
      case 2:
        return "Asszociáció!"
      case 3:
        return "Mutogatás!"
      default:
        return "Valami baj van xd"
    }
  }
  getPhaseDesc(){
    switch (this.currentPhase){
      case 1:
        return "Írd körül a kártyán lévő szót annyi mondattal, amennyivel csak akarod! A szótagokat és a szó tövét nem használhatod. Passzolás nincs!!"
      case 2:
        return "Egy szóval utalj a kitalálandó szóra.A tulajdonnevek egy szónak számítanak! Passzolás mostmár van!!"
      case 3:
        return "Mutogatás! Nem beszélhetsz. Hangokat kiadni, dúdolni ér!"
      default:
        return "Valami baj van xd"
    }
  }
  nextPhase(){
    if (this.currentPhase<3){
      this.currentPhase++;
      this.remainingWords = [...this.words].sort(() => 0.5 - Math.random());
    }else
      this.isFinished = true;
    this.saveState()
  }
  isGameFinished(){
    return this.isFinished && this.remainingWords.length == 0;

  }
  resetGame(){
    this.remainingWords = this.words;
    this.timeLeft = 40;
    this.teams = []
    this.currentTeamIndex = 0;
    this.currentPhase = 1;
    this.currentScore = 0;
    this.clearSavedState();
  }
  saveState() {
    const stateToSave = {
      words: this.words,
      remainingWords: this.remainingWords,
      timeLeft: this.timeLeft,
      teams: this.teams,
      currentTeamIndex: this.currentTeamIndex,
      currentPhase: this.currentPhase,
      currentScore: this.currentScore
    };
    localStorage.setItem('times_up_state', JSON.stringify(stateToSave));
  }
  loadState() {
    const savedState = localStorage.getItem('times_up_state');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      this.words = parsedState.words;
      this.remainingWords = parsedState.remainingWords;
      this.timeLeft = parsedState.timeLeft;
      this.teams = parsedState.teams;
      this.currentTeamIndex = parsedState.currentTeamIndex;
      this.currentPhase = parsedState.currentPhase;
      this.currentScore = parsedState.currentScore;
    }
  }
  hasSavedGame(): boolean {
    return localStorage.getItem('times_up_state') !== null;
  }
  clearSavedState() {
    localStorage.removeItem('times_up_state');
  }
}
