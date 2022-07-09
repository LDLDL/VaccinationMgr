import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from "../services/auth.service";
import {first, map} from "rxjs/operators";
import {UserType} from "../types";

@Injectable({
  providedIn: 'root'
})
export class NonLoginGuard implements CanActivate, CanActivateChild {
  constructor(private auth: AuthService, private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.auth.type$.pipe(first(), map(type => {
      if (type === UserType.Person) {
        return this.router.parseUrl('/user');
      } else if (type === UserType.VaccinationSiteAdmin){
        return this.router.parseUrl('/site');
      } else if (type === UserType.Admin) {
        return this.router.parseUrl('/admin');
      } else {
        return true;
      }
    }));
  }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(next, state);
  }

}
