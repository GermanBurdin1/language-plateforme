import { Component } from '@angular/core';

interface Theme {
  name: string;
  topics: (string | Theme)[];
}

@Component({
  selector: 'app-teacher-dictionary',
  templateUrl: './teacher-dictionary.component.html',
  styleUrls: ['./teacher-dictionary.component.scss']
})
export class TeacherDictionaryComponent {
  themes: Theme[] = [
    {
      name: 'Animals',
      topics: ['Dog', 'Cat', 'Elephant', {
        name: 'Birds',
        topics: ['Eagle', 'Parrot', 'Sparrow', {
          name: 'Water Birds',
          topics: ['Duck', 'Swan', 'Goose']
        }]
      }]
    },
    {
      name: 'Plants',
      topics: [
        'Tree',
        'Flower',
        'Grass',
        {
          name: 'Flowers',
          topics: ['Rose', 'Tulip', 'Sunflower', {
            name: 'Garden Flowers',
            topics: ['Daisy', 'Marigold', 'Lily']
          }]
        }
      ]
    },
    {
      name: 'Technology',
      topics: ['Computer', 'Smartphone', 'Internet', {
        name: 'Software',
        topics: ['Operating System', 'Application', 'Driver', {
          name: 'Web Development',
          topics: ['HTML', 'CSS', 'JavaScript']
        }]
      }]
    }
  ];

  currentTheme: Theme | null = null;
  previousThemes: Theme[] = [];
  themeStack: Theme[] = [];

  get isRoot(): boolean {
    return this.currentTheme === null;
  }

  toggleThemes(): void {
    if (this.isRoot) {
      this.currentTheme = { name: 'Root', topics: this.themes };
    } else {
      this.currentTheme = null;
      this.previousThemes = [];
      this.themeStack = [];
    }
  }

  selectTheme(theme: Theme): void {
    this.themeStack.push(this.currentTheme as Theme);
    this.currentTheme = theme;
  }

  goBack(): void {
    this.currentTheme = this.themeStack.pop() || null;
  }

  isTheme(topic: any): topic is Theme {
    return (topic as Theme).name !== undefined && (topic as Theme).topics !== undefined;
  }
}
