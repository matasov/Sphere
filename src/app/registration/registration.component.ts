import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

    registerForm: FormGroup;
    submitted = false;
    sponsorGet: string = "admin";
    recaptchaStr = '';
    get f() { return this.registerForm.controls; }

    constructor(private formBuilder: FormBuilder, private apiService: ApiService, private route: ActivatedRoute) {
        route.queryParams.subscribe(
            (queryParam: any) => {
                this.sponsorGet = queryParam['sponsor'];
            }
        );
        if (this.sponsorGet === undefined) {
            if (sessionStorage.getItem("sponsor") == null) {
                this.sponsorGet = "admin";
            } else this.sponsorGet = sessionStorage.getItem("sponsor");
        } else {
            sessionStorage.setItem("sponsor", this.sponsorGet);
        }
    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            sponsorGet: [this.sponsorGet],
            login: ['', [Validators.required, Validators.minLength(4)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            repeatPassword: ['', Validators.required]
        });
    }

    resolved(captchaResponse: string): void {
        this.recaptchaStr = captchaResponse;
        if (this.recaptchaStr) {
            this.onRegister(this.recaptchaStr);
        }
    }

    onRegisterClick(captchaRef: any): void {
        if (this.recaptchaStr) {
            captchaRef.reset();
        }
        captchaRef.execute();
    }

    onRegister(captchaResponse: string): void {
        this.apiService.register(this.registerForm.controls['login'].value,
            this.registerForm.controls['email'].value,
            this.registerForm.controls['password'].value,
            this.registerForm.controls['repeatPassword'].value,
            this.registerForm.controls['sponsorGet'].value == '' ? "admin" : this.registerForm.controls['sponsorGet'].value,
            captchaResponse).subscribe(
                data => {
                    if (data.status != 200) {
                        alert("Ошибка: " + JSON.parse(data['context'].entity)['message'])
                    } else
                        alert("Поздравляем с регистрацией: " + this.registerForm.controls['login'].value)
                },
                err => {
                    alert("Ошибка регистрации.")
                });
    }

}
