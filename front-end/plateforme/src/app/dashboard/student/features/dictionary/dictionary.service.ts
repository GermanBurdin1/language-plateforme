import { Injectable } from '@angular/core';
import { Word } from '../../../../models/word.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WordService {
  private words: Word[] = [];
  private idCounter = 0;

  constructor(private http: HttpClient) {}

  translateWord(original: string, sourceLang: string, targetLang: string): Observable<any> {
    const data = { q: original, source: sourceLang, target: targetLang, format: 'text' };
    return this.http.post('http://learn-lang-platform.local/back-end/api/translate.php', data);
  }

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
