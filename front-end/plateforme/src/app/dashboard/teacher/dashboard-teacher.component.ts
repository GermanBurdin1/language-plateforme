import { Component } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { SettingsMenuComponent } from '../student/student-info/settings-menu/settings-menu/settings-menu.component';

@Component({
  selector: 'app-dashboard-teacher',
  templateUrl: './dashboard-teacher.component.html'
})
export class DashboardTeacherComponent {
  constructor(private modalService: ModalService) {}

  openSettingsModal() {
    this.modalService.open(SettingsMenuComponent, { size: 'lg' });
  }
}
