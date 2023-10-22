import { Injectable } from '@angular/core';

import { Appointment } from '../models/appointment';

const DATA = [
  { id: 10, title: 'Reunião das 6', date: new Date(2023, 3, 2), hour: 8, minute: 0, tags: ['Appointement', 'Home'], description: 'Hello world!!!', appointmentTime: 60 },
  { id: 20, title: 'Reunião das 7', date: new Date(2023, 3, 2), hour: 12, minute: 0, tags: ['Office', 'Computer'], description: 'Hello world!!!', appointmentTime: 30 },
  { id: 30, title: 'Reunião das 19', date: new Date(2023, 3, 2), hour: 12, minute: 30, tags: ['Office', 'Computer'], description: 'Hello world!!!', appointmentTime: 30 },
  { id: 40, title: 'Reunião das 8', date: new Date(2023, 3, 2), hour: 15, minute: 30, tags: ['Online'], description: 'Hello world!!!', appointmentTime: 60 },
  { id: 50, title: 'Reunião das 9', date: new Date(2023, 3, 2), hour: 17, minute: 0, tags: [], description: 'Hello world!!!', appointmentTime: 15 },
  { id: 60, title: 'Reunião das 10', date: new Date(2023, 3, 2), hour: 22, minute: 15, tags: ['Online'], description: 'Hello world!!!', appointmentTime: 90 },

  { id: 70, title: 'Lookup teste 1', date: new Date(2023, 3, 3), hour: 10, minute: 0, tags: [], description: 'Hello world!!!', appointmentTime: 60 },
  { id: 80, title: 'Lookup teste 3', date: new Date(2023, 3, 3), hour: 12, minute: 15, tags: [], description: 'Hello world!!!', appointmentTime: 120 },
  { id: 90, title: 'Lookup teste 4', date: new Date(2023, 3, 3), hour: 14, minute: 30, tags: [], description: 'Hello world!!!', appointmentTime: 60 },
  { id: 100, title: 'Lookup teste 6', date: new Date(2023, 3, 3), hour: 17, minute: 25, tags: ['Online'], description: 'Hello world!!!', appointmentTime: 30 },
  { id: 110, title: 'Lookup teste 8', date: new Date(2023, 3, 3), hour: 22, minute: 15, tags: [], description: 'Hello world!!!', appointmentTime: 25 },

  { id: 120, title: 'Justin Bieber 8', date: new Date(2023, 3, 4), hour: 3, minute: 0, tags: ['Office', 'Computer'], description: 'Hello world!!!', appointmentTime: 60 },
  { id: 130, title: 'Justin Bieber 9', date: new Date(2023, 3, 4), hour: 7, minute: 15, tags: ['Online'], description: 'Hello world!!!', appointmentTime: 15 },
  { id: 140, title: 'Justin Bieber 78', date: new Date(2023, 3, 4), hour: 11, minute: 30, tags: [], description: 'Hello world!!!', appointmentTime: 10 },
  { id: 150, title: 'Justin Bieber 55', date: new Date(2023, 3, 4), hour: 17, minute: 25, tags: ['Appointement', 'Home'], description: 'Hello world!!!', appointmentTime: 75 },
  { id: 160, title: 'Justin Bieber 10', date: new Date(2023, 3, 4), hour: 22, minute: 15, tags: [], description: 'Hello world!!!', appointmentTime: 60 }
];

@Injectable()
export class BackendService {

  private id = DATA[DATA.length - 1].id + 1;

  getAllAppointments(): PromiseLike<Appointment[]> {
    return Promise.resolve<Appointment[]>(DATA);
  }

  getAppointmentsByDate(date: Date): PromiseLike<Appointment[]> {
    const filteredData = DATA.filter((appointment) => {
      const itemDate = appointment.date;
      const parsedParamDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const parsedItemDate = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());

      return parsedParamDate.getTime() === parsedItemDate.getTime();
    });

    return Promise.resolve<Appointment[]>(filteredData.sort(this.compare));
  }

  storeAppointment(appointment: Appointment): void {
    if (appointment.id) {
      DATA.push(appointment);
    } else {
      DATA.push(this.putId(appointment));
    }
  }

  deleteAppoitment(id: number): void {
    const indexOfTheItemToBeDeleted = DATA.findIndex(s => s.id === id);
    DATA.splice(indexOfTheItemToBeDeleted, 1);
  }

  editAppoitment(appointment: Appointment): void {
    const dataIndexToEdit = DATA.findIndex((item) => item.id === appointment.id);
    DATA[dataIndexToEdit] = appointment;
  }

  private putId(appointment: Appointment): Appointment {
    appointment.id = this.id;
    this.id++;
    return appointment;
  }

  private compare(a: Appointment, b: Appointment) {
    if ( a.hour < b.hour ) {
      return -1;
    }
    if ( a.hour > b.hour ) {
      return 1;
    }
    return 0;
  }

}
