import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

declare var $: any;

@Component({
    selector: 'app-referrals',
    templateUrl: './referrals.component.html',
    styleUrls: ['./referrals.component.css']
})

export class ReferralsComponent implements OnInit {


    currentRefTable: Array<Object> = [];
    referrals: Array<Object>;
    title: string;
    level: string;

    constructor(private apiService: ApiService) { }

    ngOnInit() {
        this.apiService.getReffs().subscribe(
            data => {
                this.referrals = data;
                this.referrals.forEach(ref => {
                    ref[8] = ref[8] > -1 ? ref[8] + 1 : "нет"
                })
            },
            err => { alert("Ошибка получения данных.") }
        );
    }

    showRefModal(event) {
        this.title = event[5];
        this.level = event[4];
        this.apiService.getRefMatrix(event[0]).subscribe(
            data => {
                let line = data['respond'];//JSON.parse(data);
                this.currentRefTable[0] = line[7];
                this.currentRefTable[1] = this.getLineOrEmpty(line[8]);
                this.currentRefTable[2] = this.getLineOrEmpty(line[9]);
                this.currentRefTable[3] = this.getLineOrEmpty(line[10]);
                this.currentRefTable[4] = this.getLineOrEmpty(line[11]);
                this.currentRefTable[5] = this.getLineOrEmpty(line[12]);
                this.currentRefTable[6] = this.getLineOrEmpty(line[13]);

                $("#referralsModalDetale").modal('show');
            },
            err => { console.log(err) }
        );
    }

    private getLineOrEmpty(line) {
        if (line == null) {
            return { login: "", date: "", tech: "" };
        } else {
            return line;
        }
    }
}
