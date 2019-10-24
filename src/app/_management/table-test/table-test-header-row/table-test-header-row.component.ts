import { Input, Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-table-test-header-row',
    templateUrl: './table-test-header-row.component.html',
    styleUrls: ['./table-test-header-row.component.css']
})
export class TableTestHeaderRowComponent implements OnInit {

    @Input() columns: Array<Object>;

    constructor() { }

    ngOnInit() {
    }



}
