import {Injectable} from '@angular/core';
import {LocalStorage} from '@ngx-pwa/local-storage';
import {Observable, ReplaySubject} from "rxjs";
import {Person, UserType, VaccinationSiteAdmin} from "../types";
import {first} from "rxjs/operators";
import {ApiService} from "./api.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token$ = new ReplaySubject<string | null>(1);
  public type$ = new ReplaySubject<UserType | null>(1);
  public type: UserType | null | undefined;
  public user$ = new ReplaySubject<Person | VaccinationSiteAdmin | string | null>(1);

  constructor(private storage: LocalStorage, private api: ApiService) {
    this.storage.getItem('token').subscribe(token => {
      if (token) {
        this.token$.next(token as string);
      } else {
        this.token$.next(null);
      }
    });
    this.storage.getItem('type').subscribe(type => {
      if (type != null) {
        this.type$.next(type as UserType);
      } else {
        this.type$.next(null);
      }
    });
    this.type$.subscribe((type: UserType | null) => {
      this.type = type;

      // this.storage.getItem('user').subscribe(user => {
      //   if (type === UserType.Person) {
      //     this.user$.next(user as Person);
      //   } else if (type === UserType.VaccinationSiteAdmin) {
      //     this.user$.next(user as VaccinationSiteAdmin);
      //   } else if (type === UserType.Admin) {
      //     this.user$.next(user as string);
      //   }
      // });

      if (this.type === UserType.Person) {
        this.api.GetUser().subscribe(person => {
          this.user$.next(person);
        });
      } else if (this.type === UserType.VaccinationSiteAdmin) {
        this.api.GetSiteAdmin().subscribe(siteAdmin => {
          this.user$.next(siteAdmin);
        });
      } else if (this.type === UserType.Admin) {
        this.api.GetAdmin().subscribe(admin => {
          this.user$.next(admin);
        });
      }
    });
  }

  public updateUser(user: Person | VaccinationSiteAdmin | string | null, type: UserType | null): Observable<undefined> {
    return new Observable(observer => {
      this.user$.next(user);
      this.storage.setItem('user', user).subscribe();
      this.storage.setItem('type', type).subscribe(_ => {
        this.type$.next(type);
        observer.next();
        observer.complete();
      });
    });
  }

  public get(): Observable<string | null> {
    return this.token$.pipe(first());
  }

  public set(token: string): Observable<undefined> {
    return new Observable(observer => {
      this.storage.setItem('token', token).subscribe(_ => {
        this.token$.next(token);
        observer.next();
        observer.complete();
      });
    });
  }

  public clear(): Observable<undefined> {
    return new Observable(observer => {
      this.storage.setItem('token', null).subscribe(_ => {
        this.token$.next(null);
        this.updateUser(null, null).subscribe(() => {
          observer.next();
          observer.complete();
        })
      });
    });
  }

  public getRedirect(): string {
    if (this.type === UserType.Person) {
      return '/user';
    } else if (this.type === UserType.VaccinationSiteAdmin) {
      return '/site';
    } else if (this.type === UserType.Admin) {
      return '/admin';
    } else {
      return '/';
    }
  }

  public getRedirectLogin(): string {
    if (this.type === UserType.Person) {
      return '/login';
    } else if (this.type === UserType.VaccinationSiteAdmin) {
      return '/site/login';
    } else if (this.type === UserType.Admin) {
      return '/admin/login';
    } else {
      return '/';
    }
  }

}
