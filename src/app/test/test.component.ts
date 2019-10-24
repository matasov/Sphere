import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
    selector: 'app-test',
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

    matrixes: any;
    statistics: any;

    constructor(private apiService: ApiService) { }

    ngOnInit() {
        this.updateTables();
    }

    pushQueue() {
        this.apiService.setNextUser().subscribe(
            (data) => {
                this.updateTables();
            },
            err => {
                console.log(err)
                console.log(err.status)
                // alert("Нет данных.")
            }
        );
    }

    updateTables() {
        this.apiService.getAllMatrix().subscribe(
            (data) => {
                this.matrixes = data;
                this.matrixes.forEach(mobj => {
                    mobj[5] = mobj[5] + 1;
                });
                this.apiService.getAllStatistic().subscribe(
                    data => {
                        this.statistics = data;
                        this.statistics.forEach(stobj => {
                            stobj["balance"] = parseFloat(stobj[8]) - parseFloat(stobj[7]);
                            this.matrixes.forEach(mobj => {
                                if (mobj[1] == stobj[1]) {
                                    stobj["login"] = mobj[6]["login"];
                                    return false;
                                }
                            });
                        });
                    },
                    err => {  }
                );
            },
            err => { alert("error!" + err); }
        );

    }
}
