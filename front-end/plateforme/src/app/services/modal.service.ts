import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(private ngbModal: NgbModal) {}

  open(component: any, options?: object) {
    const modalRef = this.ngbModal.open(component, options);
    return modalRef;
  }
}
