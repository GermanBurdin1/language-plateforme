import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

interface Theme {
  name: string;
  topics: (string | TranslatableTopic | Theme)[];
}

interface TranslatableTopic {
  name: string;
  translation: string;
  editTranslation?: string;
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
      topics: [
        { name: 'Dog', translation: 'Chien' },
        { name: 'Cat', translation: 'Chat' },
        { name: 'Elephant', translation: 'Éléphant' },
        {
          name: 'Birds',
          topics: [
            { name: 'Eagle', translation: 'Aigle' },
            { name: 'Parrot', translation: 'Perroquet' },
            { name: 'Sparrow', translation: 'Moineau' },
            {
              name: 'Water Birds',
              topics: [
                { name: 'Duck', translation: 'Canard' },
                { name: 'Swan', translation: 'Cygne' },
                { name: 'Goose', translation: 'Oie' }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'Plants',
      topics: [
        { name: 'Tree', translation: 'Arbre' },
        { name: 'Flower', translation: 'Fleur' },
        { name: 'Grass', translation: 'Herbe' },
        {
          name: 'Flowers',
          topics: [
            { name: 'Rose', translation: 'Rose' },
            { name: 'Tulip', translation: 'Tulipe' },
            { name: 'Sunflower', translation: 'Tournesol' },
            {
              name: 'Garden Flowers',
              topics: [
                { name: 'Daisy', translation: 'Marguerite' },
                { name: 'Marigold', translation: 'Souci' },
                { name: 'Lily', translation: 'Lys' }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'Technology',
      topics: [
        { name: 'Computer', translation: 'Ordinateur' },
        { name: 'Smartphone', translation: 'Téléphone intelligent' },
        { name: 'Internet', translation: 'Internet' },
        {
          name: 'Software',
          topics: [
            { name: 'Operating System', translation: 'Système d\'exploitation' },
            { name: 'Application', translation: 'Application' },
            { name: 'Driver', translation: 'Pilote' },
            {
              name: 'Web Development',
              topics: [
                { name: 'HTML', translation: 'HTML' },
                { name: 'CSS', translation: 'CSS' },
                { name: 'JavaScript', translation: 'JavaScript' }
              ]
            }
          ]
        }
      ]
    }
  ];

  currentTheme: Theme | null = null;
  newThemeName: string = '';
  newSubthemeName: string = '';
  newWordName: string = '';

  editMode: boolean = false;
  editItem: any = null;
  editItemName: string = '';
  editItemTranslation: string = '';
  flipped: { [key: string]: boolean } = {};

  get isRoot(): boolean {
    return this.currentTheme === null;
  }

  toggleThemes(): void {
    if (this.isRoot) {
      this.currentTheme = { name: 'Root', topics: this.sortThemes(this.themes) };
    } else {
      this.currentTheme = null;
    }
  }

  selectTheme(theme: Theme): void {
    this.currentTheme = { ...theme, topics: this.sortThemes(theme.topics) };
  }

  clearCurrentTheme(): void {
    this.currentTheme = null;
  }

  onTopicClick(topic: Theme | TranslatableTopic | string): void {
    if (this.isTheme(topic)) {
      this.selectTheme(topic);
    } else if (this.isTranslatableTopic(topic)) {
      const key = this.getTopicKey(topic);
      this.flipped[key] = !this.flipped[key];
    }
  }

  isTheme(topic: any): topic is Theme {
    return topic && typeof topic === 'object' && 'name' in topic && 'topics' in topic;
  }

  isTranslatableTopic(topic: any): topic is TranslatableTopic {
    return topic && typeof topic === 'object' && 'translation' in topic;
  }

  getSubthemeCount(topic: Theme): number {
    return topic.topics.length;
  }

  sortThemes(themes: (string | TranslatableTopic | Theme)[]): (string | TranslatableTopic | Theme)[] {
    return themes.sort((a, b) => {
      if (this.isTheme(a) && this.isTheme(b)) {
        return this.getSubthemeCount(b) - this.getSubthemeCount(a);
      }
      if (this.isTheme(a)) return -1;
      if (this.isTheme(b)) return 1;
      return 0;
    });
  }

  getClassForTopic(topic: Theme | TranslatableTopic | string): string {
    if (this.isTheme(topic)) {
      return 'sub-theme';
    }
    return '';
  }

  getFilteredThemes(): Theme[] {
    if (this.currentTheme) {
      return this.themes.filter(theme => theme.name !== this.currentTheme?.name);
    }
    return this.themes;
  }

  addTheme(): void {
    if (this.newThemeName) {
      this.themes.push({ name: this.newThemeName, topics: [] });
      this.newThemeName = '';
    }
  }

  addSubtheme(): void {
    if (this.newSubthemeName && this.currentTheme) {
      this.currentTheme.topics.push({ name: this.newSubthemeName, topics: [] });
      this.newSubthemeName = '';
    }
  }

  addWord(): void {
    if (this.newWordName && this.currentTheme) {
      this.currentTheme.topics.push({ name: this.newWordName, translation: 'Translation' }); // Placeholder translation
      this.newWordName = '';
    }
  }

  deleteTheme(theme: Theme): void {
    this.themes = this.themes.filter(t => t !== theme);
    if (this.currentTheme === theme) {
      this.clearCurrentTheme();
    }
  }

  deleteSubtheme(index: number): void {
    if (this.currentTheme) {
      this.currentTheme.topics.splice(index, 1);
    }
  }

  editTheme(theme: Theme): void {
    this.editItem = theme;
    this.editItemName = theme.name;
    this.editMode = true;
  }

  editSubtheme(index: number): void {
    const subtheme = this.currentTheme?.topics[index];
    if (this.isTheme(subtheme)) {
      this.editItem = subtheme;
      this.editItemName = subtheme.name;
    } else {
      this.editItem = { index, name: (subtheme as TranslatableTopic).name };
      this.editItemName = (subtheme as TranslatableTopic).name;
      this.editItemTranslation = (subtheme as TranslatableTopic).translation;
    }
    this.editMode = true;
  }

  updateItem(): void {
    if (this.isTheme(this.editItem)) {
      this.editItem.name = this.editItemName;
    } else if (this.editItem.index !== undefined && this.currentTheme) {
      const item = this.currentTheme.topics[this.editItem.index];
      if (this.isTranslatableTopic(item)) {
        item.name = this.editItemName;
        item.translation = this.editItemTranslation;
      } else {
        this.currentTheme.topics[this.editItem.index] = this.editItemName;
      }
    }
    this.editMode = false;
    this.editItem = null;
    this.editItemName = '';
    this.editItemTranslation = '';
  }

  cancelEdit(): void {
    this.editMode = false;
    this.editItem = null;
    this.editItemName = '';
    this.editItemTranslation = '';
  }

  getTopicKey(topic: TranslatableTopic | Theme | string): string {
    if (typeof topic === 'string') {
      return topic;
    }
    if (this.isTranslatableTopic(topic)) {
      return topic.name;
    }
    if (this.isTheme(topic)) {
      return topic.name;
    }
    return '';
  }

  getTopicName(topic: Theme | TranslatableTopic | string): string {
    if (this.isTheme(topic)) {
      return topic.name;
    } else if (this.isTranslatableTopic(topic)) {
      return topic.name;
    } else {
      return topic;
    }
  }

  getTopicTranslation(topic: Theme | TranslatableTopic | string): string {
    if (this.isTranslatableTopic(topic)) {
      return topic.translation;
    } else {
      return '';
    }
  }

  drop(event: CdkDragDrop<Theme[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }
}
