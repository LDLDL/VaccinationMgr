export interface Vaccine {
  id: number;
  type: string;
  manufacturer: string;
  location: string;
}

export interface Person {
  name: string;
  id_number: string;
  sex: string;
  phone_number: string;
  birthday: number;
}

export interface VaccinationSite {
  id: number;
  name: string;
  address: string;
  province: string;
  city: string;
  district: string;
}

export interface VaccinationSiteAdmin {
  name: string;
  account: string;
  phone: string;
  vaccination_site_id: number;

  vaccination_site: VaccinationSite | null;
}

export interface VaccineInventory {
  vaccine_id: number;
  vaccination_site_id: number;
  number: number;

  vaccine: Vaccine | null;
  vaccination_site: VaccinationSite | null;
}

export interface VaccinationLog {
  id: number;
  vaccination_site_id: number;
  person_id_number: string;
  vaccine_id: number;
  time: number;
  vaccination_times: number;

  vaccination_site: VaccinationSite | null;
  person: Person | null;
  vaccine: Vaccine | null;
}

export interface VaccinationAppointment {
  id: number;
  person_id_number: string;
  vaccination_site_id: number;
  vaccine_id: number;
  date: number;
  appointment_id: number;
  vaccination: boolean;

  vaccination_site: VaccinationSite | null;
  person: Person | null;
  vaccine: Vaccine | null;
}

export interface AppointmentArrangement {
  vaccination_site_id: number;
  vaccine_id: number;
  date: number;
  total_number: number;
  booked_number: number;

  vaccine: Vaccine | null;
}

export interface RegisterQ {
  name: string;
  password: string;
  id_number: string;
  sex: string;
  phone_number: string;
  birthday: number;
}

export interface LoginPersonQ {
  id_number: string;
  password: string;
}

export interface AddSiteAdminQ {
  name: string;
  account: string;
  phone: string;
  password: string;
  vaccination_site_id: number;
}

export interface LoginSiteAdminQ {
  account: string;
  password: string;
}

export interface LoginAdminQ {
  password: string;
}

export interface ChangePasswordQ {
  old_password: string;
  new_password: string;
}

export interface ChangeProfileQ {
  name: string;
  sex: string;
  phone_number: string;
  birthday: number;
}

export interface VaccinationLogsP {
  vaccinations: VaccinationLog[] | null
}

export interface MakeAppointmentQ {
  vaccine_id: number;
  vaccination_site_id: number;
  date: number;
}

export interface ListAppointmentPersonP {
  available: VaccinationAppointment | null;
  history: VaccinationAppointment[] | null;
}

export interface ListSitesQ {
  province: string;
  city: string;
  district: string;
}

export interface ListSitesP {
  vaccination_sites: VaccinationSite[] | null;
}

export interface ListInventoriesP {
  inventories: VaccineInventory[] | null;
}

export interface AddInventoriesQ {
  vaccine_id: number;
  number: number;
}

export interface SetInventoriesQ {
  vaccine_id: number;
  number: number;
}

export interface AddVaccinationLogSiteQ {
  vaccine_id: number;
  person_id_number: string;
  vaccination_times: number;
}

export interface ListAppointmentsSiteP {
  appointments: VaccinationAppointment[] | null;
  appointments_no_vaccination: VaccinationAppointment[] | null;
}

export interface AddVaccineQ {
  type: string;
  manufacturer: string;
  location: string;
}

export interface SetVaccineQ {
  id: number;
  type: string;
  manufacturer: string;
  location: string;
}

export interface ListVaccinesP {
  vaccines: Vaccine[] | null;
}

export interface AddSiteQ {
  name: string;
  address: string;
  province: string;
  city: string;
  district: string;
}

export interface SetSiteQ {
  id: number;
  name: string;
  address: string;
  province: string;
  city: string;
  district: string;
}

export interface RemoveSiteAdminQ {
  account: string;
}

export interface ListSiteAdminsP {
  admins: VaccinationSiteAdmin[] | null;
}

export interface SetSiteAdminPasswordQ {
  account: string;
  password: string;
}

export interface SetPersonPasswordQ {
  id_number: string;
  password: string;
}

export interface AddArrangementQ {
  date: number;
  vaccine_id: number;
  total_number: number;
}

export interface RemoveArrangementQ {
  date: number;
  vaccine_id: number;
}

export interface SetArrangementQ {
  date: number;
  vaccine_id: number;
  total_number: number;
}

export interface GetArrangementDatesP {
  dates: number[] | null;
}

export interface ListArrangementsQ {
  vaccination_site_id: number;
  date: number;
}

export interface ListArrangementsP {
  arrangements: AppointmentArrangement[] | null;
}

export interface AddVaccinationLogAdminQ {
  vaccine_id: number;
  vaccination_site_id: number;
  person_id_number: string;
  time: number;
  vaccination_times: number;
}

export interface SetVaccinationLogAdminQ {
  id: number;
  vaccine_id: number;
  vaccination_site_id: number;
  person_id_number: string;
  time: number;
  vaccination_times: number;
}

export interface ListVaccinationLogsLocationQ {
  province: string;
  city: string;
  district: string;
}

export interface AddVaccinationLogSiteByAppointmentQ {
  appointment_id: number;
  vaccination_times: number;
}

export interface VaccinationVaccineCountP {
  count: number;
  vaccine_id: number;
  vaccine: Vaccine | null;
}

export interface VaccinationMonthCountP {
  count: number;
  month: number;
}

export enum UserType {
  Person,
  VaccinationSiteAdmin,
  Admin
}

export interface Navigation {
  name: string;
  url: string;
}
