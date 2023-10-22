import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import { Appointment } from '../models/appointment';

@Component({
  selector: 'app-dialog-view-component',
  templateUrl: './templates/dialog-view-component.html',
  styleUrls: ['./styles/dialog-view.component.css']
})
export class DialogViewComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Appointment
  ) {}

  onOkClick(): void {
    this.dialogRef.close();
  }

  zeroBefore(n: number): string | number {
    return n < 10 ? '0' + n : n;
  }

}
