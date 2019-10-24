import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
    selector: 'app-banners',
    templateUrl: './banners.component.html',
    styleUrls: ['./banners.component.css']
})
export class BannersComponent implements OnInit {
    userName: string;
    recordID: string;
    sponsorLogin: string;

    constructor(private apiService: ApiService) { }

    ngOnInit() {
        this.userName = localStorage.getItem("login");
        this.apiService.getCommonData().subscribe(
            data => {
                let customerRecord = data["7a38bfb3-7874-4eb4-b981-b38e5ade2df8"][0];
                this.sponsorLogin = customerRecord[15];
                this.recordID = customerRecord[0];
            },
            err => { alert("Ошибка получения данных. Перезапустите аккаунт.") }
        );
    }

}
