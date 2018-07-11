import {Component, OnInit} from '@angular/core';

enum Color {
  Empty = '',
  Red = 'RED',
  Purple = 'PURPLE',
  Blue = 'BLUE',
  Green = 'GREEN',
  Yellow = 'YELLOW',
  Orange = 'ORANGE'
}

enum Results {
  SimiValid = 'SIMIVALID',     // White
  Valid = 'VALID',             // Black
  invalid = 'INVALID'          // no Color
}

class Selection {
  constructor(color?: Color) {
    this.value = color ? color : Color.Empty;
  }

  value: Color;
}

type TupleSelections = [Selection, Selection, Selection, Selection];
type TupleResults = [Results, Results, Results, Results];

class Selections {
  constructor() {
    this.selections = [
      new Selection(), new Selection(), new Selection(), new Selection(),
    ];
    this.results = [Results.invalid, Results.invalid, Results.invalid, Results.invalid];
  }

  selections: TupleSelections;
  results: TupleResults;
}

type TupleGuesses = [Selections, Selections, Selections, Selections, Selections,
  Selections, Selections, Selections, Selections, Selections];

class Guesses {
  constructor() {
    this.guesses = [
      new Selections(), new Selections(), new Selections(), new Selections(), new Selections(),
      new Selections(), new Selections(), new Selections(), new Selections(), new Selections()
    ];
  }

  guesses: TupleGuesses;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public msg: string;
  public colors = [Color.Red, Color.Purple, Color.Blue, Color.Green, Color.Yellow, Color.Orange];
  public answer: TupleSelections;

  public guessCount = 0;
  public guesses: TupleGuesses;

  ngOnInit() {
    this.resetGuesses();
    this.setAnswers();
  }

  resetGuesses() {
    this.guessCount = 0;
    this.guesses = new Guesses().guesses;
    console.log(this.answer);
  }

  setAnswers() {
    this.answer = [new Selection(this.getRandomColor()), new Selection(this.getRandomColor()),
      new Selection(this.getRandomColor()), new Selection(this.getRandomColor())];
  }

  getRandomColor(): Color {
    return this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  updateSelection(selections: Selections, index: number) {
    const colorIndex = selections[index].value ? this.colors.indexOf(selections[index].value) + 1 : 0;

    selections[index].value = this.colors[colorIndex < this.colors.length ? colorIndex : 0];
  }

  canSubmit() {
    if (this.guessCount >= 10) {
      return false;
    }

    let isValid = true;
    this.guesses[this.guessCount].selections.forEach((s: Selection) => {
      if(s.value !in Color || s.value === Color.Empty) {
        isValid = false;
      }
    });

    return isValid;
  }

  submit() {
    this.guesses[this.guessCount] = this.updateResults(this.guesses[this.guessCount]);
    if (this.validateResults(this.guesses[this.guessCount])) {
      // TODO: Game Won
      this.msg = 'You Won !!!';
      console.log('game won');
    }


    this.guessCount++;

    if (this.guessCount >= 10) {
      // TODO: GAME OVER
      this.msg = 'Game Over !!!';
      console.log('game over');
    }
  }

  updateResults(selections: Selections): Selections {
    let newSelections: Selections = new Selections(),
      validCount = 0,
      simiValidCount = 0,
      tempAnswers = this.answer.map(a => a.value),
      tempSelection = selections.selections.map(s => s.value),
      selectionIndex = -1;

    tempAnswers.forEach((c: Color, i: number) => {
      if (c === tempSelection[i]) {
        validCount++;
        tempAnswers[i] = Color.Empty;
        tempSelection[i] = Color.Empty;
      }
    });

    tempAnswers.forEach((c: Color, i: number) => {
      if (c) {
        selectionIndex = selections.selections.findIndex((s: Selection) => s.value === c);
        if (selectionIndex > -1) {
          simiValidCount++;
          tempAnswers[i] = Color.Empty;
          tempSelection[selectionIndex] = Color.Empty;
        }
      }
    });

    // for (let i = 0; i < selections.selections.length; i++) {
    //   newSelections.selections[i].value = selections.selections[i].value;
    //   if (tempAnswers[i] === newSelections.selections[i].value) {
    //   } else {
    //     answerIndex = tempAnswers.indexOf(newSelections.selections[i].value);
    //     if (answerIndex > -1) {
    //       simiValidCount++;
    //       tempAnswers[answerIndex] = Color.Empty;
    //     } else {
    //       invalidCount++;
    //     }
    //   }
    // }

    newSelections.selections = selections.selections;

    newSelections.results = <TupleResults> newSelections.results.map((r: Results) => {
      if (validCount > 0) {
        validCount--;
        return Results.Valid;
      } else if (simiValidCount > 0) {
        simiValidCount--;
        return Results.SimiValid;
      }

      return Results.invalid;
    });

    return newSelections;
  }

  validateResults(selections: Selections): boolean {
    let valid = true;

    selections.results.forEach(r => {
      if (r === Results.SimiValid || r === Results.invalid) {
        valid = false;
      }
    });

    return valid;
  }
}
