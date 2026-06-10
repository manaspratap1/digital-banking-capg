import {
  Component,
  inject
} from '@angular/core';

import { Admin } from '../../services/admin';

@Component({
  selector: 'app-users-table',
  imports: [],
  templateUrl: './users-table.html',
  styleUrl: './users-table.scss',
})
export class UsersTable {

  admin = inject(Admin);

  viewUser( userId: string | number): void {
    this.admin
      .openUserDetails(
        userId
      );

  }

  onSearch( event: Event): void {
    const value =
      (event.target as HTMLInputElement)
        .value;

    this.admin
      .searchTerm
      .set(value);

  }

}