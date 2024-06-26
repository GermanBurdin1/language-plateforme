import { Injectable } from '@angular/core';
import { Word } from '../models/word.model';  // Импортируем модель

@Injectable({
  providedIn: 'root',
})
export class WordService {
  private words: Word[] = [];
  private idCounter = 0;

  constructor() {}

  addWord(original: string, translation: string): void {
    const word: Word = {
      id: this.idCounter++,
      original,
      translation,
    };
    this.words.push(word);
  }

  getWords(): Word[] {
    return this.words;
  }
}
