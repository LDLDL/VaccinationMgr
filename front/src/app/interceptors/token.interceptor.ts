import {Injectable} from '@angular/core';
import {
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpHeaderResponse,
  HttpInterceptor,
  HttpRequest, HttpResponse
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {MessageService} from "../services/message.service";
import {Response} from "../services/api.service";
import {tap} from "rxjs/operators";
import {ECredentialExpired, EPermissionDenied} from "../errors";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService,
              private router: Router,
              private msg: MessageService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.includes('/api/')) {
      return new Observable<HttpEvent<unknown>>(observer => {
        this.auth.get().subscribe(token => {
          if (token) {
            const authReq = request.clone({
              setHeaders: {Authorization: token}
            });

            next.handle(authReq).subscribe({
              next: i => {
                this.updateToken(i);
                observer.next(i);
              },
              complete: () => observer.complete(),
              error: e => observer.error(e)
            });
          } else {
            next.handle(request).subscribe({
              next: i => {
                this.updateToken(i);
                observer.next(i);
              },
              complete: () => observer.complete(),
              error: e => observer.error(e)
            });
          }
        });
      });
    } else {
      return next.handle(request).pipe(
        tap(this.updateToken)
      );
    }
  }

  private updateToken(httpEvent: HttpEvent<unknown>): void {
    if (httpEvent.type === HttpEventType.Response || httpEvent.type === HttpEventType.ResponseHeader) {
      const token = (httpEvent as HttpHeaderResponse).headers.get('X-Update-Authorization');
      if (token) {
        this.auth.set(token).subscribe();
      }

      if (httpEvent.type === HttpEventType.Response) {
        const response = (httpEvent as HttpResponse<Response>);
        if (response && response.body) {
          if (response.body.status === ECredentialExpired || response.body.status === EPermissionDenied){
            const redirectUrl = this.auth.getRedirectLogin();
            this.auth.clear().subscribe(_ => {
              this.router.navigateByUrl(redirectUrl).then();
              this.msg.SendMessage('登录过期，请重新登录');
            });
          }
        }
      }
    }
  }
}
