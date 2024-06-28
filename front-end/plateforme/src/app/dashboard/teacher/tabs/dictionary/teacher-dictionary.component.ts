import { Component } from '@angular/core';

interface Theme {
  name: string;
  topics: string[];
}

@Component({
  selector: 'app-dictionary',
  templateUrl: './teacher-dictionary.component.html',
  styleUrls: ['./teacher-dictionary.component.scss']
})
export class TeacherDictionaryComponent {
  themes: Theme[] = [
    { name: 'Animals', topics: ['Dog', 'Cat', 'Elephant'] },
    { name: 'Plants', topics: ['Tree', 'Flower', 'Grass'] },
    { name: 'Technology', topics: ['Computer', 'Smartphone', 'Internet'] }
  ];

  selectedTheme: Theme | null = null;
  showThemes: boolean = false;

  toggleThemes(): void {
    console.log("Toggling themes visibility");
    this.showThemes = !this.showThemes;
  }

  selectTheme(theme: Theme): void {
    console.log("Selected theme:", theme);
    this.selectedTheme = theme;
  }
}
