import {
  Component,
  inject
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register-page',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register-page.html',
  styleUrl: './register-page.scss',
})
export class RegisterPage {

  private fb = inject(FormBuilder);

  private auth = inject(AuthService);

  private router = inject(Router);

  form = this.fb.group({

      name: ['', Validators.required ],

      email: ['', [Validators.required, Validators.email]],

      password: ['', Validators.required]

  });

    register(): void {
      if ( this.form.invalid) {
        return;
      }

      const { name, email, password } = this.form.getRawValue();

      this.auth.register( name!, email!, password!)
        .subscribe(() => {
          this.router.navigate(['/login']);
        });

    }

}
