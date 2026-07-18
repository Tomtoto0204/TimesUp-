import {Component, inject, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {CommonModule} from '@angular/common';
import {GameState} from '../game-state';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.html',
  standalone: true,
  imports: [
    CommonModule
  ],
  styleUrls: ['./edit.css']
})
export class EditComponent implements OnInit {
  words:any;
  router:Router = inject(Router);
  gameState:GameState = inject(GameState)
  rightwords:string[]  =[]


  ngOnInit(): void {
   this.words =  this.gameState.currentWords
  }

  toggleWordState(index: number): void {
    this.words[index].isCorrect = !this.words[index].isCorrect;
  }

  saveAndGoBack(): void {
    for (const word of this.gameState.currentWords) {
      if (word.isCorrect){
        this.rightwords.push(word.text)
      }
    }
    this.gameState.endRoundErands(this.rightwords, this.rightwords.length)
    this.gameState.nextPlayer();
    if (this.gameState.isGameFinished()) {
      this.router.navigate(['/leaderboard']);
      return
    }
    this.router.navigate(['/game']);
  }
}
