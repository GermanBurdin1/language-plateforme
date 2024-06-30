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
    this.modalService.close();
    switch(section) {
      case 'security':
        break;
      case 'tariffs':
        break;
      case 'studentSettings':
        console.log('Opening StudentSettingsComponent');
        this.modalService.open(StudentSettingsComponent, { size: 'lg' });
        break;
    }
  }
}

