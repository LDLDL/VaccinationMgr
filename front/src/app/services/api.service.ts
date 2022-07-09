import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {EOK} from "../errors";
import {
  AddArrangementQ,
  AddInventoriesQ,
  AddSiteAdminQ,
  AddSiteQ, AddVaccinationLogAdminQ, AddVaccinationLogSiteByAppointmentQ,
  AddVaccinationLogSiteQ,
  AddVaccineQ,
  ChangePasswordQ,
  ChangeProfileQ,
  GetArrangementDatesP, VaccinationVaccineCountP,
  ListAppointmentPersonP,
  ListAppointmentsSiteP,
  ListArrangementsP,
  ListArrangementsQ,
  ListInventoriesP,
  ListSiteAdminsP,
  ListSitesP,
  ListSitesQ, ListVaccinationLogsLocationQ, ListVaccinesP,
  LoginAdminQ,
  LoginPersonQ,
  LoginSiteAdminQ,
  MakeAppointmentQ,
  Person,
  RegisterQ,
  RemoveArrangementQ,
  RemoveSiteAdminQ,
  SetArrangementQ,
  SetInventoriesQ,
  SetPersonPasswordQ,
  SetSiteAdminPasswordQ,
  SetSiteQ, SetVaccinationLogAdminQ, SetVaccineQ,
  VaccinationLogsP, VaccinationSite,
  VaccinationSiteAdmin, VaccinationMonthCountP
} from "../types";

export interface Response {
  status: string;
  data: any;
}

declare type PostBody =
  string
  | { [key: string]: any }
  | Blob
  | FormData
  | ArrayBuffer
  | ArrayBufferView
  | URLSearchParams
  | ReadableStream;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {
  }

  private get(url: string): Observable<any> {
    return new Observable(observer => {
      this.http.get<Response>(url).subscribe({
        next: resp => {
          if (resp.status === EOK) {
            observer.next(resp.data);
            observer.complete();
          } else {
            observer.error(resp.status)
          }
        },
        error: err => {
          observer.error(err)
        }
      });
    });
  }

  private post(url: string, body: PostBody): Observable<any> {
    return new Observable(observer => {
      this.http.post<Response>(url, body).subscribe({
        next: resp => {
          if (resp.status === EOK) {
            observer.next(resp.data);
            observer.complete();
          } else {
            observer.error(resp.status);
          }
        },
        error: err => {
          observer.error(err);
        }
      });
    });
  }

  public PersonExist(id_number: string): Observable<boolean> {
    return this.get(`/api/user/exist/${id_number}`);
  }

  public Register(r: RegisterQ): Observable<undefined> {
    return this.post('/api/user/register', r);
  }

  public PersonLogin(r: LoginPersonQ): Observable<Person> {
    return this.post('/api/user/login', r);
  }

  public ChangePasswordPerson(r: ChangePasswordQ): Observable<undefined> {
    return this.post('/api/user/password', r);
  }

  public ChangeProfile(r: ChangeProfileQ): Observable<undefined> {
    return this.post('/api/user/profile', r)
  }

  public GetVaccinationLogPerson(): Observable<VaccinationLogsP> {
    return this.get('/api/user/vaccinations/list');
  }

  public MakeAppointment(r: MakeAppointmentQ): Observable<undefined> {
    return this.post('/api/user/appointments/make', r);
  }

  public RemoveAppointment(id: number): Observable<undefined> {
    return this.get(`/api/user/appointments/remove/${id}`);
  }

  public ListAppointmentsPerson(): Observable<ListAppointmentPersonP> {
    return this.get('/api/user/appointments/list')
  }

  public LoginSiteAdmin(r: LoginSiteAdminQ): Observable<VaccinationSiteAdmin> {
    return this.post('/api/sites/login', r);
  }

  public ListSites(r: ListSitesQ): Observable<ListSitesP>{
    return this.post('/api/sites/list', r);
  }

  public ListAllSites(): Observable<ListSitesP> {
    return this.get('/api/sites/list/all');
  }

  public ListArrangements(r: ListArrangementsQ): Observable<ListArrangementsP> {
    return this.post('/api/sites/arrangements/list', r);
  }

  public GetArrangementDates(site_id: number): Observable<GetArrangementDatesP> {
    return this.get(`/api/sites/arrangements/dates/${site_id}`);
  }

  public AddVaccinationLogSite(r: AddVaccinationLogSiteQ): Observable<undefined> {
    return this.post('/api/sites/vaccinations/add', r);
  }

  public ListInventoriesSite(): Observable<ListInventoriesP> {
    return this.get('/api/sites/inventories/list/all');
  }

  public AddInventories(r: AddInventoriesQ): Observable<undefined> {
    return this.post('/api/sites/inventories/add', r);
  }

  public RemoveInventories(vaccine_id: number): Observable<undefined> {
    return this.get(`/api/sites/inventories/remove/${vaccine_id}`);
  }

  public SetInventories(r: SetInventoriesQ): Observable<undefined> {
    return this.post('/api/sites/inventories/set', r);
  }

  public ListAppointmentsSite(date: number): Observable<ListAppointmentsSiteP> {
    return this.get(`/api/sites/appointments/list/${date}`);
  }

  public RemoveAppointmentSite(appointment_id: number): Observable<undefined> {
    return this.get(`/api/sites/appointments/remove/${appointment_id}`);
  }

  public AddArrangement(r: AddArrangementQ): Observable<undefined> {
    return this.post('/api/sites/appointments/arrangements/add', r);
  }

  public RemoveArrangement(r: RemoveArrangementQ): Observable<undefined> {
    return this.post('/api/sites/appointments/arrangements/remove', r);
  }

  public SetArrangement(r: SetArrangementQ): Observable<undefined> {
    return this.post('/api/sites/appointments/arrangements/set', r);
  }

  public LoginAdmin(r: LoginAdminQ): Observable<undefined> {
    return this.post('/api/admin/login', r);
  }

  public AddVaccine(r: AddVaccineQ): Observable<undefined> {
    return this.post('/api/admin/vaccines/add', r);
  }

  public SetVaccine(r: SetVaccineQ): Observable<undefined> {
    return this.post('/api/admin/vaccines/set', r);
  }

  public RemoveVaccine(vaccine_id: number): Observable<undefined> {
    return this.get(`/api/admin/vaccines/remove/${vaccine_id}`);
  }

  public AddSite(r: AddSiteQ): Observable<undefined> {
    return this.post('/api/admin/sites/add', r);
  }

  public GetSite(site_id: number): Observable<VaccinationSite> {
    return this.get(`/api/admin/sites/${site_id}`);
  }

  public SetSite(r: SetSiteQ): Observable<undefined> {
    return this.post('/api/admin/sites/set', r);
  }

  public RemoveSite(site_id: number): Observable<undefined> {
    return this.get(`/api/admin/sites/remove/${site_id}`);
  }

  public SiteAdminExist(account: string): Observable<boolean> {
    return this.get(`/api/admin/siteadmins/exist/${account}`);
  }

  public AddSiteAdmin(r: AddSiteAdminQ): Observable<undefined> {
    return this.post('/api/admin/siteadmins/add', r);
  }

  public RemoveSiteAdmin(r: RemoveSiteAdminQ): Observable<undefined> {
    return this.post('/api/admin/siteadmins/remove', r);
  }

  public ListSiteAdmins(site_id: number): Observable<ListSiteAdminsP> {
    return this.get(`/api/admin/siteadmins/list/${site_id}`);
  }

  public SetSiteAdminPassword(r: SetSiteAdminPasswordQ): Observable<undefined> {
    return this.post('/api/admin/siteadmins/password', r);
  }

  public RemovePerson(id_number: string): Observable<undefined> {
    return this.get(`/api/admin/user/remove/${id_number}`);
  }

  public GetPerson(id_number: string): Observable<Person> {
    return this.get(`/api/admin/user/${id_number}`);
  }

  public SetPersonPassword(r: SetPersonPasswordQ): Observable<undefined> {
    return this.post('/api/admin/user/password', r);
  }

  public ListVaccinationLogsAll(): Observable<VaccinationLogsP> {
    return this.get('/api/admin/vaccinations/list/all');
  }

  public ListVaccinationLogsSite(site_id: number): Observable<VaccinationLogsP> {
    return this.get(`/api/admin/vaccinations/list/site/${site_id}`);
  }

  public ListVaccinationLogsPersonAdmin(id_number: string): Observable<VaccinationLogsP> {
    return this.get(`/api/admin/vaccinations/list/user/${id_number}`);
  }

  public ListVaccinationLogsLocation(r: ListVaccinationLogsLocationQ): Observable<VaccinationLogsP> {
    return this.post('/api/admin/vaccinations/list/location', r);
  }

  public AddVaccinationLogAdmin(r: AddVaccinationLogAdminQ): Observable<undefined> {
    return this.post('/api/admin/vaccinations/add', r);
  }

  public RemoveVaccinationLogAdmin(vaccination_id: number): Observable<undefined> {
    return this.get(`/api/admin/vaccinations/remove/${vaccination_id}`);
  }

  public SetVaccinationLogAdmin(r: SetVaccinationLogAdminQ): Observable<undefined> {
    return this.post('/api/admin/vaccinations/set', r);
  }

  public ListVaccines(): Observable<ListVaccinesP> {
    return this.get('/api/vaccines/list');
  }

  public PhoneNumberExist(phone_number: string): Observable<boolean> {
    return this.get(`/api/phone/exist/${phone_number}`);
  }

  public GetUser(): Observable<Person> {
    return this.get('/api/user/me');
  }

  public GetSiteAdmin(): Observable<VaccinationSiteAdmin> {
    return this.get('/api/sites/admin');
  }

  public GetAdmin(): Observable<string> {
    return this.get('/api/admin');
  }

  public AddVaccinationLogSiteByAppointment(r: AddVaccinationLogSiteByAppointmentQ): Observable<undefined> {
    return this.post('/api/sites/vaccinations/add/appointment', r);
  }

  public GetVaccinationVaccineCountSite(): Observable<VaccinationVaccineCountP[]> {
    return this.get('/api/sites/vaccinations/count/vaccine');
  }

  public GetVaccinationVaccineCountAdmin(): Observable<VaccinationVaccineCountP[]> {
    return this.get('/api/admin/vaccinations/count/vaccine');
  }

  public GetVaccinationMonthCountSite(): Observable<VaccinationMonthCountP[]> {
    return this.get('/api/sites/vaccinations/count/month');
  }

  public GetVaccinationMonthCountAdmin(): Observable<VaccinationMonthCountP[]> {
    return this.get('/api/admin/vaccinations/count/month');
  }
}
