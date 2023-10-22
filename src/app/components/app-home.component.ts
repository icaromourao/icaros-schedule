import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragEnd } from '@angular/cdk/drag-drop';

import { Appointment } from '../models/appointment';
import { BackendService } from '../services/backend.service';
import { DialogComponent } from './dialog.component';
import { DialogViewComponent } from './dialog-view-component';


@Component({
  selector: 'app-home',
  templateUrl: './templates/app-home.component.html',
  styleUrls: ['./styles/app-home.component.css']
})
export class HomeComponent implements OnInit {

  appointments: Appointment[] = [];
  selectedDate = new Date();
  hours: string[] = [];

  constructor(public backend: BackendService, public dialog: MatDialog) {
    this.hours = this.getHours();
  }

  ngOnInit() {
    this.getAppointements();
  }

  getAppointements() {
    this.backend.getAppointmentsByDate(this.selectedDate)
      .then((appointments: Appointment[]) => {
        this.appointments = appointments;
      });
  }

  getStyle(appointment: Appointment): string {
    const top = (appointment.hour * 120) + (appointment.minute * 2);
    const heigth = appointment.appointmentTime * 2;

    return `top: ${top}px; height: ${heigth}px;`;
  }

  getHours(): string[] {
    return Array.from(Array(24).keys()).map(
      (hour) => hour < 10 ? '0' + hour + ':00' : hour + ':00'
    );
  }

  getAppointmentHeaderTitle() {
    return this.selectedDate.toDateString();
  }

  zeroBefore(n: number): string | number {
    return n < 10 ? '0' + n : n;
  }

  getHour(date: Date, hour: number, minute: number, appointmentTime: number) {
    const endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour);
    endDate.setMinutes(minute + appointmentTime);
    const startHoursAndMinutes = this.zeroBefore(hour) + ':' + this.zeroBefore(minute);
    const endHoursAndMinutes =  this.zeroBefore(endDate.getHours()) + ':' + this.zeroBefore(endDate.getMinutes());

    return startHoursAndMinutes + ' - ' + endHoursAndMinutes;
  }

  isAppointmentsEmpty() {
    return this.appointments.length === 0;
  }

  setAppointmentBySelectedDate() {
    this.backend.getAppointmentsByDate(this.selectedDate)
      .then((appointments: Appointment[]) => {
        this.appointments = appointments;
      });
  }

  nextDay() {
    const selectedDate = this.selectedDate;
    this.selectedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1);
    this.setAppointmentBySelectedDate();
  }

  lastDay() {
    const selectedDate = this.selectedDate;
    this.selectedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() - 1);
    this.setAppointmentBySelectedDate();
  }

  instanceOfAppointment(object: object): object is Appointment {
    return  'title' in object &&
      'tags' in object &&
      'date' in object &&
      'hour' in object &&
      'minute' in object &&
      'description' in object &&
      'appointmentTime' in object;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, { data: {} });

    dialogRef.afterClosed().subscribe(data => {
      if (!data) {
        return;
      }

      const parsedData = {
        ...data,
        tags: data.tags || '',
        description: data.description || '',
      }

      if (this.instanceOfAppointment(parsedData)) {
        this.backend.storeAppointment(data);
        this.setAppointmentBySelectedDate();
      }
    });
  }

  deleteAnAppoitment(id: number): void {
    this.backend.deleteAppoitment(id);
    this.setAppointmentBySelectedDate();
  }

  viewAppoitment(appointment: Appointment): void {
    this.dialog.open(DialogViewComponent, { data: { ...appointment } });
  }

  onSelectedDateChange(value: Date): void {
    this.selectedDate = value;
    this.setAppointmentBySelectedDate();
  }

  onDragEnd(event: CdkDragEnd, appointment: Appointment) {
    const date = appointment.date;
    const distanceInMinutes = Math.round(event.distance.y / 2);
    let newDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      appointment.hour,
      appointment.minute
    );
    newDate.setMinutes(appointment.minute + distanceInMinutes);
    const parsedNewDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
    const parsedSelectedDate = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth(),
      this.selectedDate.getDate()
    );

    if (parsedNewDate.getTime() < parsedSelectedDate.getTime()) {
      newDate = this.selectedDate;
      newDate.setHours(0);
      newDate.setMinutes(0);
    }

    parsedSelectedDate.setHours(23);
    parsedSelectedDate.setMinutes(59);
    parsedNewDate.setHours(newDate.getHours());
    parsedNewDate.setMinutes(newDate.getMinutes() + appointment.appointmentTime);

    if (parsedNewDate.getTime() > parsedSelectedDate.getTime()) {
      newDate = this.selectedDate;
      newDate.setHours(23);
      newDate.setMinutes(60 - appointment.appointmentTime);
    }

    const editedAppointment: Appointment = {
      ...appointment,
      date: newDate,
      hour: newDate.getHours(),
      minute: newDate.getMinutes(),
    };


    this.backend.editAppoitment(editedAppointment);
    this.setAppointmentBySelectedDate();
    return;
  }

}
