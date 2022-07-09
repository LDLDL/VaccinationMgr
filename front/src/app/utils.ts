export function BirthdayToUnix(date: any): number {
  return Math.round(new Date(date).getTime() / 1000);
}

export function DateToAppointmentTime(date: any): number {
  return Math.round(new Date(date).getTime() / 1000);
}

export function AppointmentTimeToDate(unix: number): Date {
  return  new Date(unix * 1000);
}

export function UnixToTime(unix: number): Date {
  return  new Date(unix * 1000);
}
