import { timer, throwError as observableThrowError, Observable, BehaviorSubject } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent, HttpErrorResponse } from "@angular/common/http";

import { ApiService } from './api.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    isRefreshingToken: boolean = false;
    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    constructor(private auth: ApiService) { }

    addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
        let path = req.url.split("/");

        if (path[path.length - 1] != 'token' && path[path.length - 2] != 'oauth' && token) {
            return req.clone({ setHeaders: { Authorization: 'Bearer ' + token } })
        }
        return req;
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
        return next.handle(this.addToken(req, this.auth.getAccessToken())).pipe(
            catchError(error => {
                if (error instanceof HttpErrorResponse) {
                    switch ((<HttpErrorResponse>error).status) {
                        case 400:
                            return this.handle400Error(error);
                        case 401:
                            return this.handle401Error(req, next);
                        default:
                            return observableThrowError(error);
                    }
                } else {
                    return observableThrowError(error);
                }
            }));
    }

    handle400Error(error) {
        if (error && error.status === 400 && error.error && error.error.error === 'invalid_grant') {
            // If we get a 400 and the error message is 'invalid_grant', the token is no longer valid so logout.
            console.log("handle this 400 error")
            
            return this.logoutUser();
        }
        return observableThrowError(error);
    }

    handle401Error(req: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshingToken) {
            this.isRefreshingToken = true;

            return this.auth.refreshExampleToken().pipe(

                switchMap((data: any) => {
                    if (data) {
                        this.isRefreshingToken = false;
                        return next.handle(this.addToken(req, data.access_token));
                    }
                })
            );
        } else {
            return timer(5000).pipe(switchMap(() => next.handle(this.addToken(req, this.auth.getAccessToken()))))
        }
    }

    logoutUser() {
        // Route to the login page (implementation up to you)
this.auth.logOut();
        return observableThrowError("not found refresh token");
    }
}