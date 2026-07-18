import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core'; // <-- ChangeDetectorRef importálása
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameState} from '../game-state';


@Component({
  selector: 'app-play',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './play.html'
})
export class PlayComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private gamestate = inject(GameState);
  private cdr = inject(ChangeDetectorRef); // <-- ChangeDetectorRef beillesztése

  remainingWords = this.gamestate.remainingWords;
  guessedWords:string[]=[]
  currentWordIndex = 0;
  score = 0;
  timeLeft = this.gamestate.timeLeft;
  totaltime = this.gamestate.timeLeft;
  timer: any;

  touchStartX = 0;
  touchEndX = 0;
  cardTransform = '';
  isAnimating = false;

  get currentWord() {
    return this.gamestate.remainingWords[this.currentWordIndex] || 'VÉGE!';
  }

  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.timeLeft--;
      this.cdr.detectChanges();
      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        const audio = new Audio('/audio/alarmring.mp3');
        audio.play();
      }
    }, 1000);
  }

  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  onTouchMove(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].screenX;
    const deltaX = this.touchEndX - this.touchStartX;
    this.cardTransform = `translateX(${deltaX}px) rotate(${deltaX * 0.05}deg)`;
    this.cdr.detectChanges();
  }

  onTouchEnd() {
    const deltaX = this.touchEndX - this.touchStartX;

    if (deltaX > 75) {
      this.handleCorrect();
    } else if (deltaX < -75) {
      this.handlePass();
    } else {
      this.cardTransform = '';
      this.cdr.detectChanges();
    }

    this.touchStartX = 0;
    this.touchEndX = 0;
  }

  handleCorrect() {
    if (this.isAnimating) return;
    this.score++;
    this.guessedWords.push(this.remainingWords[this.currentWordIndex])
    this.nextWord('right');
  }

  handlePass() {
    if (this.timeLeft==0) this.endRound();
    if (this.gamestate.currentPhase === 1 && this.gamestate.difficulty === "hard") return;
    if (this.isAnimating) return;
    this.nextWord('left');
  }

  nextWord(direction: 'left' | 'right') {
    if(this.timeLeft == 0)
      this.endRound();
    this.isAnimating = true;

    this.cardTransform = direction === 'right'
      ? 'translateX(150%) rotate(20deg)'
      : 'translateX(-150%) rotate(-20deg)';
    this.cdr.detectChanges();

    setTimeout(() => {
      this.currentWordIndex++;
      this.cardTransform = '';
      this.isAnimating = false;
      this.cdr.detectChanges();

      if (this.currentWordIndex >= this.gamestate.remainingWords.length) {
        this.endRound();
      }
    }, 300);
  }

  endRound() {
    clearInterval(this.timer);
    this.gamestate.currentScore = this.score;
    this.gamestate.remainingWords = this.remainingWords.filter(word => !this.guessedWords.includes(word));
    if (this.gamestate.remainingWords.length == 0)
      this.gamestate.nextPhase();

    this.router.navigate(['summary']);
  }
}
