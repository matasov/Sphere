import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-recovery',
    templateUrl: './recovery.component.html',
    styleUrls: ['./recovery.component.css']
})
export class RecoveryComponent implements OnInit {
    recoveryForm: FormGroup;
    recaptchaStr = '';

    get f() { return this.recoveryForm.controls; }

    constructor(private formBuilder: FormBuilder, private apiService: ApiService) { }

    ngOnInit() {
        this.recoveryForm = this.formBuilder.group({
            login: ['', Validators.required]
        });
    }

    onRecoveryClick(captchaRef: any): void {
        if (this.recaptchaStr) {
            captchaRef.reset();
        }
        captchaRef.execute();
    }

    resolved(captchaResponse: string): void {
        this.recaptchaStr = captchaResponse;
        if (this.recaptchaStr) {
            this.recoverySubmit(this.recaptchaStr);
        }
    }

    recoverySubmit(captchaResponse: string): void {
        this.apiService.recovery(this.recoveryForm.controls['login'].value,
            captchaResponse).subscribe(
                data => { alert("Новый пароль сформирован, и будет отправлен Вам на почту в течении часа.") },
                err => {
                    console.log(err)
                    alert("Для логина " + this.recoveryForm.controls['login'].value +
                        " пароль не отправлен обратитесь в администрацию.");
                });
    }

}
