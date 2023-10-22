import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

import { Appointment } from '../models/appointment';

@Component({
  selector: 'app-dialog-component',
  templateUrl: './templates/dialog-component.html',
  styleUrls: ['./styles/dialog.component.css']
})
export class DialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Appointment
  ) {}


  errorMessage = '';

  onCancelClick(): void {
    this.dialogRef.close();
  }

  validateInputs(data: Appointment) {
    const titleValidator = new FormControl(data.title, [Validators.required, Validators.minLength(3)]);
    const dateValidator = new FormControl(data.date, Validators.required);
    const appointmentTimeValidator = new FormControl(data.appointmentTime, [Validators.required, Validators.min(1), Validators.max(480)]);
    const hourValidator = new FormControl(data.hour, [Validators.required, Validators.min(0), Validators.max(23)]);
    const minuteValidator = new FormControl(data.minute, [Validators.required, Validators.min(0), Validators.max(60)]);

    if (titleValidator.status === 'INVALID') {
      return 'The Title input needs at least 3 characters';
    }

    if (dateValidator.status === 'INVALID') {
      return 'The Date input is invalid';
    }

    if (appointmentTimeValidator.status === 'INVALID') {
      return 'The Appointment Duration input is invalid';
    }

    if (hourValidator.status === 'INVALID') {
      return 'The Hours input is invalid';
    }

    if (minuteValidator.status === 'INVALID') {
      return 'The Minutes input is invalid';
    }

    return '';
  }

  onSaveClick(data: Appointment): void {
    this.errorMessage = '';
    const errorMessage = this.validateInputs(data);

    if (errorMessage) {
      this.errorMessage = errorMessage;
      return;
    }

    if (data.title && data.date && data.appointmentTime
      && (data.hour || data.hour === 0) && (data.minute || data.minute === 0)) {
      this.dialogRef.close(data);
    } else {
      this.errorMessage = 'Fill in the required fields';
    }
  }
}
