import { Component, inject } from '@angular/core';

import { Admin } from '../../services/admin';

@Component({
  selector: 'app-accounts-table',
  imports: [],
  templateUrl: './accounts-table.html',
  styleUrl: './accounts-table.scss',
})
export class AccountsTable {

  admin =
    inject(Admin);

}