import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

    statistic: Array<Object>;

    constructor(private apiService: ApiService) { }

    ngOnInit() {
        this.apiService.getStatistic().subscribe(
            data => {
                console.log(data)
                this.statistic = data;
            },
            err => { alert("Ошибка получения данных.") }
        );
    }

}
