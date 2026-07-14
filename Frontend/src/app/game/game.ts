import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.html'
})
export class GameComponent {
  currentPhase = 1;
  phaseTitle = 'Szabad körülírás';
  phaseDescription = 'Írd körül a kártyán lévő szót annyi mondattal, amennyivel csak akarod! A szótagokat és a szó tövét nem használhatod. Passzolás nincs!';

  currentPlayer = 'Péter';
  currentTeam = '1. Csapat';

  startTimer() {
    console.log('Stopper elindítva, jöhet a kártyahúzás!');
   // Itt navigálunk majd át a konkrét kártyamutató / 40 másodperces képernyőre
  }
}
