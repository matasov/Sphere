import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { switchMap, catchError, finalize } from 'rxjs/operators';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

    commonForm: FormGroup;
    perfectForm: FormGroup;
    payeerForm: FormGroup;
    passwordForm: FormGroup;
    finPassForm: FormGroup;
    get f() { return this.commonForm.controls; }
    email: string;
    sponsorLogin: string;
    recordID: string;
    userName: string;
    balance: string;

    constructor(private formBuilder: FormBuilder, private apiService: ApiService) { }

    ngOnInit() {

        console.log("refresh token with: ");
        console.log()
        this.userName = localStorage.getItem("login");
        this.apiService.getCommonData().subscribe(
            data => {
                let customerRecord = data["7a38bfb3-7874-4eb4-b981-b38e5ade2df8"][0];
                this.balance = customerRecord[11];
                this.email = customerRecord[13];
                this.sponsorLogin = customerRecord[15];
                this.commonForm.patchValue({
                    firstName: customerRecord[5],
                    secondName: customerRecord[6],
                    skype: customerRecord[14]
                });
                this.perfectForm.patchValue({
                    perfectWallet: customerRecord[10]
                });
                this.payeerForm.patchValue({
                    payeerWallet: customerRecord[9]
                });
                this.recordID = customerRecord[0];
            },
            err => { alert("Ошибка получения данных. Перезапустите аккаунт.") }
        );
        this.commonForm = this.formBuilder.group({
            firstName: [''],
            secondName: [''],
            skype: ['']
        });
        this.perfectForm = this.formBuilder.group({
            finPass: [''],
            perfectWallet: ['']
        });
        this.payeerForm = this.formBuilder.group({
            finPass: [''],
            payeerWallet: ['']
        });
        this.passwordForm = this.formBuilder.group({
            oldPass: [''],
            newPass: [''],
            repeatNewPass: ['']
        });
        this.finPassForm = this.formBuilder.group({

        });
    }

    public loadScript(url: string) {
        const body = <HTMLDivElement>document.body;
        const script = document.createElement('script');
        script.innerHTML = '';
        script.src = url;
        script.async = false;
        script.defer = true;
        body.appendChild(script);
    }

    onSaveCommonClick() {
        this.apiService.setAccountValue({
            "id": this.recordID, "fields": {
                "81613045-4bb7-4576-9752-12dc08689b7d": "superUserPass",
                "0c8db6d0-0eb2-4d3c-bacb-544bb371a092": this.commonForm.controls['firstName'].value,
                "c3d42dcd-6f04-48c3-bf69-14b90612fe10": this.commonForm.controls['secondName'].value,
                "91519ee7-c5cf-4859-8c2c-dd7693a625c5": this.commonForm.controls['skype'].value
            }
        }).subscribe(
            data => { alert("Данные были успешно сохранены.") },
            err => { alert("Ошибка сохранения данных.") }
        );
    }

    onSavePerfect() {
        this.apiService.setAccountValue({
            "id": this.recordID, "fields": {
                "81613045-4bb7-4576-9752-12dc08689b7d": "superUserPass",
                "1be6e27e-a98d-41d8-8717-95b4396bef43": this.perfectForm.controls['finPass'].value,
                "b0caea61-600a-4b24-8f9f-5f6e70dd8a8f": this.perfectForm.controls['perfectWallet'].value
            }
        }).subscribe(
            data => { alert("Данные были успешно сохранены.") },
            err => { alert("Ошибка сохранения данных.") }
        );
    }

    onSavePayeer() {
        this.apiService.setAccountValue({
            "id": this.recordID, "fields": {
                "81613045-4bb7-4576-9752-12dc08689b7d": "superUserPass",
                "1be6e27e-a98d-41d8-8717-95b4396bef43": this.payeerForm.controls['finPass'].value,
                "3ca41c65-0d98-415b-9cfa-cdbc86d223bb": this.payeerForm.controls['payeerWallet'].value
            }
        }).subscribe(
            data => { alert("Данные были успешно сохранены.") },
            err => { alert("Ошибка сохранения данных.") }
        );
    }

    onCnahgePassword() {
        this.apiService.setNewPassword({
            "oldPass": this.passwordForm.controls['oldPass'].value,
            "repeatNewPass": this.passwordForm.controls['repeatNewPass'].value,
            "newPass": this.passwordForm.controls['newPass'].value
        }).subscribe(
            data => { alert("Пароль был успешно изменен.") },
            err => { alert("Ошибка сохранения данных.") }
        );
    }

    onNewFinPassword() {
        this.apiService.newFinPassword().subscribe(
            data => { alert("Пароль отправлен на почту.") },
            err => { alert("Ошибка сохранения данных.") }
        );
    }

}
