import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-withdrawal',
    templateUrl: './withdrawal.component.html',
    styleUrls: ['./withdrawal.component.css']
})
export class WithdrawalComponent implements OnInit {
    perfectForm: FormGroup;
    payeerForm: FormGroup;
    recordID: string;
    balance: string;
    constructor(private formBuilder: FormBuilder, private apiService: ApiService) {

    }

    ngOnInit() {
        this.perfectForm = this.formBuilder.group({
            finPass: [''],
            perfectAmount: [''],
            perfectWallet: ['']
        });
        this.payeerForm = this.formBuilder.group({
            finPass: [''],
            payeerAmount: [''],
            payeerWallet: ['']
        });
        this.getBalance();
    }

    onSavePerfect() {
        this.apiService.payOut({
            "id": this.recordID, "fields": {
                "81613045-4bb7-4576-9752-12dc08689b7d": "superUserPass",
                "1be6e27e-a98d-41d8-8717-95b4396bef43": this.perfectForm.controls['finPass'].value,
                "amount": this.perfectForm.controls['perfectAmount'].value,
                "wallet": "b0caea61-600a-4b24-8f9f-5f6e70dd8a8f"

            }
        }).subscribe(
            data => {
                this.getBalance();
                alert("Данные были успешно сохранены.")
            },
            (err) => { alert("Ошибка сохранения данных."); console.log(err) }
        );
    }

    onSavePayeer() {
        this.apiService.payOut({
            "id": this.recordID, "fields": {
                "81613045-4bb7-4576-9752-12dc08689b7d": "superUserPass",
                "1be6e27e-a98d-41d8-8717-95b4396bef43": this.payeerForm.controls['finPass'].value,
                "amount": this.payeerForm.controls['payeerAmount'].value,
                "wallet": "3ca41c65-0d98-415b-9cfa-cdbc86d223bb"
            }
        }).subscribe(
            data => { alert("Данные были успешно сохранены.") },
            (err) => { alert("Ошибка сохранения данных."); console.log(err) }
        );
    }

    getBalance() {
        this.apiService.getCommonData().subscribe(
            data => {
                let customerRecord = data["7a38bfb3-7874-4eb4-b981-b38e5ade2df8"][0];
                this.recordID = customerRecord[0];
                this.balance = customerRecord[11];
                this.perfectForm.patchValue({
                    perfectWallet: customerRecord[10],
                    perfectAmount: 0
                });
                this.payeerForm.patchValue({
                    payeerWallet: customerRecord[9],
                    payeerAmount: 0
                });
            },
            err => { alert("Ошибка получения данных. Перезапустите аккаунт.") }
        );
    }
}
