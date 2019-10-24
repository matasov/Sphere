import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'app-dash-sidebar',
    templateUrl: './dash-sidebar.component.html',
    styleUrls: ['./dash-sidebar.component.css']
})
export class DashSidebarComponent implements OnInit {

    userName: string;
    constructor(private apiService: ApiService, private cookieService: CookieService) {
        this.setUserName(localStorage.getItem('login'));
    }

    ngOnInit() {
    }

    onLogOut(): void {
        this.apiService.logOut();
    }

    setUserName(userName: string) {
        this.userName = userName;
    }
}
