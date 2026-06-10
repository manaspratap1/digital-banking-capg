import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BillService } from '../../services/bill';
import { BillStatus } from '../../../../shared/enums/bill-status.enum';
import { Bill } from '../../../../shared/models';

@Component({
  selector: 'app-bill-form',
  imports: [ReactiveFormsModule],
  templateUrl: './bill-form.html',
  styleUrl: './bill-form.scss',
})
export class BillForm {

  private fb = inject(FormBuilder);
  private billService = inject(BillService);

  billForm = this.fb.group({
    billerName: ['', Validators.required],
    category: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(1)]],
    dueDate: ['', Validators.required]
  });

  onSubmit(): void {

    if (this.billForm.invalid) {

      this.billForm.markAllAsTouched();

      return;

    }

    const bill = {

      ...this.billForm.getRawValue(),

      id: Date.now(),

      userId: 2,

      status: BillStatus.PENDING

    };

    this.billService
      .addBill(bill as Bill)
      .subscribe(() => {

        this.billService.loadBills();

        this.billForm.reset();

      });

  }

}