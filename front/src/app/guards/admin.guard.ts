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
import {MessageService} from "../services/message.service";
import {first, map} from "rxjs/operators";
import {UserType} from "../types";

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate, CanActivateChild {
  constructor(private auth: AuthService, private router: Router, private msg: MessageService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.auth.type$.pipe(first(), map(type => {
      if (type === UserType.Admin) {
        return true;
      } else if (type === null) {
        this.msg.SendMessage("请先登录");
        return this.router.parseUrl('/admin/login');
      } else {
        this.msg.SendMessage('无权访问');
        return this.router.parseUrl(this.auth.getRedirect());
      }
    }));
  }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(next, state);
  }

}
