import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    get f() { return this.loginForm.controls; }
    recaptchaStr = '';

    constructor(private formBuilder: FormBuilder, private apiService: ApiService) { }
    public isLoggedIn = false;

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            login: ['', [Validators.required, Validators.minLength(4)]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    onLoginSubmit(captchaResponse: string): void {
        this.apiService.logIn(this.loginForm.controls['login'].value,
            this.loginForm.controls['password'].value,
            captchaResponse).subscribe(
                data => {
                    this.apiService.setToken(data);
                    window.location.href = '/account';
                },
                err => {
                    alert("Ошибка входа.");
                });
    }

    onLoginClick(captchaRef: any): void {
        if (this.recaptchaStr) {
            captchaRef.reset();
        }
        captchaRef.execute();
    }

    resolved(captchaResponse: string): void {
        this.recaptchaStr = captchaResponse;
        if (this.recaptchaStr) {
            this.onLoginSubmit(this.recaptchaStr);
        }
    }

}
