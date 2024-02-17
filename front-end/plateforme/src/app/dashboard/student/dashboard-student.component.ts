import { Component } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { SettingsMenuComponent } from '../student-info/settings-menu/settings-menu/settings-menu.component';

@Component({
  selector: 'app-dashboard-student',
  templateUrl: './dashboard-student.component.html'
})
export class DashboardStudentComponent {
  constructor(private modalService: ModalService) {}

  openSettingsModal() {
    // Вызов метода open для открытия модального окна настроек студента
    this.modalService.open(SettingsMenuComponent, { size: 'lg' });
  }
}
