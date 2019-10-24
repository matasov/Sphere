import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../api.service';
//insert into html <!--(ngSubmit)="openPayeerModal()" -->
@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
    login = localStorage.getItem("login");
    perfectPayment = 1;
    payeerPayment: string = "1";
    perfectDialogForm: FormGroup;
    payeerDialogForm: FormGroup;
    perfectSubmitForm: FormGroup;
    payeerSubmitForm: FormGroup;
    confirmForm: FormGroup;
    perfectID: string;
    payeerID: string;
    perfectDisplay = 'none';
    payeerDisplay = 'none';
    payeerKey: string;
    baseLogin: string;
    constructor(private formBuilder: FormBuilder, private apiService: ApiService) { }

    ngOnInit() {
        this.perfectDialogForm = this.formBuilder.group({
            PAYMENT_AMOUNT: ['1']
        });
        this.payeerDialogForm = this.formBuilder.group({
            PAYMENT_AMOUNT: ['1']
        });
        this.confirmForm = this.formBuilder.group({
            skype: [''],
            whatsapp: [''],
            textValue: ['']
        });
    }

    openPerfectModal() {
        this.perfectID = (Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)).toUpperCase();
        this.perfectPayment = this.perfectDialogForm.controls['PAYMENT_AMOUNT'].value;
        this.perfectDisplay = 'block';
    }

    closePerfectModal() {
        this.perfectDisplay = 'none';
    }
    sendPayeerPayment() {
        this.perfectDisplay = 'none';
        console.log(this.perfectSubmitForm.controls['PAYMENT_ID'].value)


    }

    openPayeerModal() {
        this.payeerID = (Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)).toUpperCase();
        this.payeerPayment = parseFloat(this.payeerDialogForm.controls['PAYMENT_AMOUNT'].value).toFixed(2);
        this.baseLogin = btoa(this.login);
        // let paymentString =
        //     'm_shop=818402412&m_orderid=' + this.payeerID + '&m_amount=' + this.payeerPayment + '&m_curr=USD&m_desc=' + this.baseLogin;
        let form = new FormData();
        form.append("m_shop", "858360702");
        form.append("m_orderid", this.payeerID);
        form.append("m_amount", this.payeerPayment);
        form.append("m_curr", "USD");
        form.append("m_desc", this.baseLogin);
        this.apiService.payeerKey(form).subscribe(
            data => {
                this.payeerDisplay = 'block';
                this.payeerKey = data['key'];
                console.log("try display" + data)
                // this.openPerfectModal();
            },
            err => { alert("Ошибка сохранения данных.") }
        );
        // this.payeerDisplay = 'block';
    }

    closePayeerModal() {
        this.payeerDisplay = 'none';
    }

    sendConfirm() {
        this.apiService.confirmPayment({
            skype: this.confirmForm.controls['skype'].value,
            whatsapp: this.confirmForm.controls['whatsapp'].value,
            textValue: this.confirmForm.controls['textValue'].value
        }).subscribe(
            data => {
                alert("Запрос был отправлен.")
            },
            err => { alert("Ошибка сохранения данных.") }
        );
    }


    //             <form ngNoForm action="https://perfectmoney.is/api/step1.asp" method="POST"
    //     class="d-flex justify-content-left align-items-end line-form">

    //     <input type="hidden" name="PAYEE_ACCOUNT" value="U1862427">
    //     <input type="hidden" name="PAYEE_NAME" value="Live Line">
    //     <input type="hidden" name="PAYMENT_ID" value="{{perfectID}}">
    //     <input type="hidden" name="PAYMENT_AMOUNT" min="1" value="{{perfectPayment}}">
    //     <input type="hidden" name="PAYMENT_UNITS" value="USD">
    //     <input type="hidden" name="STATUS_URL" value="">
    //     <input type="hidden" name="PAYMENT_URL" value="http://crm.invensio.com/perfect/payment">
    //     <input type="hidden" name="PAYMENT_URL_METHOD" value="POST">
    //     <input type="hidden" name="NOPAYMENT_URL" value="http://live-line.biz/account">
    //     <input type="hidden" name="NOPAYMENT_URL_METHOD" value="GET">
    //     <input type="hidden" name="SUGGESTED_MEMO" value="{{login}}">
    //     <div class="form-group"><input type="submit" class="btn btn-submit" name="PAYMENT_METHOD"
    //             value="Пополнить"></div>

    // </form>
}
