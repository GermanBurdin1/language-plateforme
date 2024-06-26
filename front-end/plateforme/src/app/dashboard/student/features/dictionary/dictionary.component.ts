import { Component } from '@angular/core';
import { WordService } from './dictionary.service';// Ensure this path is correct

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.scss']
})
export class DictionaryComponent {
  original: string = '';
  translation: string = '';

  constructor(private wordService: WordService) {}

  addWord() {
    this.wordService.translateWord(this.original, 'en', 'fr').subscribe((response: any) => {
      this.translation = response.translatedText;
      this.wordService.addWord(this.original, this.translation);
      this.original = '';
      this.translation = '';
    });
  }

  getWords() {
    return this.wordService.getWords();
  }
}
