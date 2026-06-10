import { Component, inject } from '@angular/core';

import { Admin } from '../../services/admin';

@Component({
  selector: 'app-user-details-modal',
  imports: [],
  templateUrl: './user-details-modal.html',
  styleUrl: './user-details-modal.scss',
})
export class UserDetailsModal {

  admin = inject(Admin);

}