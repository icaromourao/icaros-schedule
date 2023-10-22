export interface Appointment {
  title: string;
  tags: string[];
  id: number;
  date: Date;
  hour: number;
  minute: number;
  description: string;
  appointmentTime: number;
}
