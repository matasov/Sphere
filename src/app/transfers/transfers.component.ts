import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-transfers',
    templateUrl: './transfers.component.html',
    styleUrls: ['./transfers.component.css']
})
export class TransfersComponent implements OnInit {
    transferForm: FormGroup;
    balance: string;
    constructor(private formBuilder: FormBuilder, private apiService: ApiService) { }

    ngOnInit() {
        this.transferForm = this.formBuilder.group({
            finPass: [''],
            amount: [''],
            userLogin: ['']
        });
        this.getBalance();
    }

    onTransfer() {
        this.apiService.transfer({
            "transfer": {
                "to": this.transferForm.controls['userLogin'].value,
                "amount": this.transferForm.controls['amount'].value
            }
        }).subscribe(
            data => {
                this.getBalance();
                alert("Данные были успешно сохранены.")
            },
            (err) => { alert("Ошибка сохранения данных."); console.log(err) }
        );
    }

    getBalance() {
        this.apiService.getCommonData().subscribe(
            data => {
                let customerRecord = data["7a38bfb3-7874-4eb4-b981-b38e5ade2df8"][0];
                this.transferForm.patchValue({
                    amount: 0
                });
                this.balance = customerRecord[11];
            },
            err => { alert("Ошибка получения данных. Перезапустите аккаунт.") }
        );
    }

}
