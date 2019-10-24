import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {
    constructor(private authService: ApiService, private router: Router) { }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (state.url.startsWith('/sponsor')) {
            let sponsorName: string = state.url.substring(state.url.lastIndexOf("/") + 1, state.url.length);
            sessionStorage.setItem("sponsor", sponsorName);
            return this.router.parseUrl("/registration?sponsor=" + sponsorName);
        }
        if (state.url === '/login' || state.url.startsWith('/registration')) {
            if (this.authService.isLoggedId()) {
                return this.router.parseUrl("/account");
            } else return true;
        }


        if (this.authService.isLoggedId()) {
            return true;
        }
        else {
            return this.router.parseUrl("/login");
        }
    }

}
