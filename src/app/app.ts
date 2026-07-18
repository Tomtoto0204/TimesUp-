import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LobbyComponent } from './lobby/lobby'; // Ezt az importot kell hozzáadni!

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LobbyComponent], // Itt is be kell húzni az imports tömbbe!
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'times-up-app';
}
