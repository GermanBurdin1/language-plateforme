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
      this.currentTheme = { name: 'Root', topics: this.sortThemes(this.themes) };
    } else {
      this.currentTheme = null;
      this.previousThemes = [];
      this.themeStack = [];
    }
  }

  selectTheme(theme: Theme): void {
    this.themeStack.push(this.currentTheme as Theme);
    this.currentTheme = { ...theme, topics: this.sortThemes(theme.topics) };
  }

  goBack(): void {
    this.currentTheme = this.themeStack.pop() || null;
  }

  isTheme(topic: any): topic is Theme {
    return (topic as Theme).name !== undefined && (topic as Theme).topics !== undefined;
  }

  getSubthemeCount(topic: Theme): number {
    return topic.topics.length;
  }

  sortThemes(themes: (string | Theme)[]): (string | Theme)[] {
    return themes.sort((a, b) => {
      if (this.isTheme(a) && this.isTheme(b)) {
        return this.getSubthemeCount(b) - this.getSubthemeCount(a);
      }
      if (this.isTheme(a)) return -1;
      if (this.isTheme(b)) return 1;
      return 0;
    });
  }

  getClassForTopic(topic: Theme | string): string {
    if (this.isTheme(topic)) {
      return 'sub-theme';
    }
    return '';
  }

  onTopicClick(topic: Theme | string): void {
    if (this.isTheme(topic)) {
      this.selectTheme(topic);
    }
  }
}
