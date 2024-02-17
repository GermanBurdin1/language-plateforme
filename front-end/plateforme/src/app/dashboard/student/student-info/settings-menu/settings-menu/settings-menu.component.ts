// settings-menu.component.ts
import { Component } from '@angular/core';
import { ModalService } from '../../../../../services/modal.service';
import { StudentSettingsComponent } from '../../student-settings/student-settings.component';

@Component({
  selector: 'app-settings-menu',
  templateUrl: './settings-menu.component.html',
  styleUrls: ['./settings-menu.component.scss']
})
export class SettingsMenuComponent {
  constructor(private modalService: ModalService) {}

  openSubSettings(section: string) {
    console.log(`Opening section: ${section}`);
    this.modalService.close(); // Закрыть текущее меню
    // Затем открываете нужное модальное окно в зависимости от раздела
    switch(section) {
      case 'security':
        // Открыть модальное окно для настроек безопасности
        break;
      case 'tariffs':
        // Открыть модальное окно для тарифов обучения
        break;
      case 'studentSettings':
        console.log('Opening StudentSettingsComponent');
        // Открыть модальное окно для настроек аккаунта и внешнего вида
        this.modalService.open(StudentSettingsComponent, { size: 'lg' });
        break;
    }
  }
}

