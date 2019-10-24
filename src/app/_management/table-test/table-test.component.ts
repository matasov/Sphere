import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';

@Component({
    selector: 'app-table-test',
    templateUrl: './table-test.component.html',
    styleUrls: ['./table-test.component.css']
})
export class TableTestComponent implements OnInit {
    editKey: string;
    canvas;// = document.createElement("canvas");
    context: CanvasRenderingContext2D;// = this.canvas.getContext("2d");
    currentClassID: string = "7a38bfb3-7874-4eb4-b981-b38e5ade2df8";
    columns: Object = {};
	matrixes: Array<Object> = [];
    
    filters: Array<Object> = [];
    orders: Array<Object> = [];
    constructor(private apiService: ApiService) { }

    ngOnInit() {

        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        this.apiService.customerStructure(this.currentClassID).subscribe(
            data => {
                this.columns = data;
                this.orders = [{ map: 'null.null.' + this.getFirstPartUUID(this.currentClassID) + "." + this.getFirstPartUUID(this.columns[3]['id']), order: '1' }];
                this.getData();
            },
            err => { alert("Ошибка сохранения данных.") }
        );
        this.context.font = this.getCurrentTextStyle(document.getElementById('testtable'));
        
    }

    getKeys(obj): string[] {
        if (!obj) return null;
        return Object.keys(obj)
    }

    startEdit(key: string) {
        console.log("try edit key: " + key)
        this.editKey = key;
    }

    saveEdit(index: number) {
        console.log(this.matrixes[index])

        let recordObject: Object = { fields: {} };
        recordObject['id'] = this.editKey;
        this.getKeys(this.matrixes[index]).forEach((element) => {
            recordObject['fields'][this.columns[element]["id"]] = this.matrixes[index][element];
        });
        console.log(recordObject)
        this.editKey = null;
        this.apiService.adminClassSave(this.currentClassID, [recordObject]).subscribe(
            data => { alert("Данные были успешно сохранены.") },
            err => { alert("Ошибка сохранения данных.") }
        );
    }

    isVisibleHeader(perm: string) {
        return perm.substr(1, 1) === '1';
    }

    isVisibleData(index: string) {
        let perm = this.columns[index]['perm'];
        return perm.substr(1, 1) === '1';
    }

    isEditable(perm: string) {
        return perm.substr(2, 1) === '1'
    }

    css(element, property) {
        return window.getComputedStyle(element).getPropertyValue(property);
    }

    getCurrentTextStyle(element) {
        return this.css(element, 'font-size') + " " + this.css(element, 'font-family').split(",").join("");
    }

    getTextWidth(text) {
        return this.context.measureText(text).width;
    }

    eventFilter(event) {
        console.log((event.target.id));

        let inputValue = event.target.value;
        console.log(inputValue);
        this.setFiltersValue("7a38bfb3-7874-4eb4-b981-b38e5ade2df8", event.target.id, event.target.value);
        if (event.target.value.length > 2)
            this.getData();
    }

    getData() {

        this.apiService.customerData(this.currentClassID,
            this.filters,
            this.orders).subscribe(
                data => {
                    console.log(data)
                    if (data.error != null) {
                        this.matrixes = [];
                        console.log(data.error)
                    } else {
                        if (data != null)
                            this.matrixes = data;
                        else this.matrixes = [];
                    }
                },
                err => { alert("Ошибка сохранения данных."); this.matrixes = []; }
            );
    }

    setFiltersValue(classID: string, fieldID: string, value: string) {
        let presentArray: Array<Object> = this.filters;
        let key = "null.null." + classID + "." + fieldID;
        let newObject: Object = {};
        newObject[key] = { value: value, operator: "11" };
        if (presentArray == null) {
            if (value.length > 2)
                presentArray = [newObject];
        } else {
            let presentIndex: number = -1;
            presentArray.forEach((element, index) => {
                if (this.getKeys(element).includes(key)) {
                    presentIndex = index;
                    return false;
                }
            })
            if (presentIndex === -1) {
                if (value.length > 2)
                    presentArray.push(newObject);
            } else {
                if (value.length > 2)
                    presentArray[presentIndex] = newObject;
                else {
                    presentArray.splice(presentIndex, 1);
                }
            }
        }

        if (presentArray != null && presentArray.length > 0)
            this.filters = presentArray;
        else {
            this.filters = [];
        }
    }

    getFirstPartUUID(uuidString: string) {
        return uuidString.substr(0, 8);
    }

    clear() {
        document.getElementById("81613045-4bb7-4576-9752-12dc08689b7d")['value'] = "";
        document.getElementById("9941fd7b-8272-4913-9731-8d5f90368791")['value'] = "";
        this.filters = [];
        this.getData();
    }
}
