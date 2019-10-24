import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ApiService } from '../api.service';
declare var $: any;
@Component({
    selector: 'app-business',
    templateUrl: './business.component.html',
    styleUrls: ['./business.component.css']
})
export class BusinessComponent implements OnInit {
    //levels
    levelArray: Array<Object>;
    showArray: Array<Object>;
    currentLevel: string = "0";
    // @ViewChild('modalpayment', { static: false }) modal: ElementRef;
    @ViewChild('modalpayment', { static: false }) modal;

    constructor(private formBuilder: FormBuilder, private apiService: ApiService) { }

    ngOnInit() {
        this.setLevel("0");
    }

    createLevel(respond) {
        let count = 3;
        if (this.currentLevel !== "0") {
            count = 7;
        }
        let base = 6;
        this.showArray = new Array(count);
        if (respond && respond[0]) {
            this.levelArray = respond[0];
            this.showArray = new Array(count);
            for (let i = base; i < count + base; i++) {
                let shift = (i < 9) ? 0 : 2;
                this.showArray[i - base] = this.levelArray[i + shift] ? this.levelArray[i + shift] : {};
            }
        } else {
            this.levelArray = new Array(base + count);
            for (let i = base; i < count + base; i++) {
                this.showArray[i - base] = { login: 'Айда к нам!', tech: 'REAL' };
                this.levelArray[i] = { login: 'Айда к нам!', tech: 'REAL' };
            }
        }
    }

    setLevel(element) {
        this.currentLevel = element;
        this.apiService.getSelfMatrixes(this.currentLevel).subscribe(
            data => {
                this.createLevel(data);
                $("#modalpayment").modal('hide');
            },
            err => {
                let count = 3;
                if (this.currentLevel !== "0") {
                    count = 7;
                }
                let base = 6;
                this.levelArray = new Array(base + count);
                for (let i = base; i < count + base; i++) {
                    this.showArray[i - base] = { login: 'Айда к нам!', tech: 'REAL' };
                    this.levelArray[i] = { login: 'Айда к нам!', tech: 'REAL' };
                }
                $("#modalpayment").modal('hide');
            }
        );
    }

    sendBuyRequest() {
        this.apiService.sendBuyRequest(this.currentLevel).subscribe(
            data => {
                $("#modalpayment").modal('show');
            },
            err => { alert("Ошибка получения данных.") }
        );
    }

    getImageByLevel(level) {
        switch (level) {
            case 0:
                return "./../../assets/media/images/bussiness/home.svg";
            case 1:
                return "./../../assets/media/images/bussiness/limo.svg";
            case 2:
                return "./../../assets/media/images/bussiness/bus.svg";
            case 3:
                return "./../../assets/media/images/bussiness/train.svg";
            case 4:
                return "./../../assets/media/images/bussiness/ship.svg";
            case 5:
                return "./../../assets/media/images/bussiness/plain.svg";
            default: return "./../../assets/media/images/bussiness/home.svg";
        }
    }

    getClassByLevel(level) {
        switch (level) {
            case 0:
                return "transport transport-home";
            case 1:
                return "transport transport-limo";
            case 2:
                return "transport transport-bus";
            case 3:
                return "transport transport-train";
            case 4:
                return "transport transport-ship";
            case 5:
                return "transport transport-plain";
            default: return "transport transport-home";
        }
    }

    reloadPage(){
        this.setLevel(this.currentLevel);        
    }

}
