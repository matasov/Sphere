import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { RegisterDTO } from './registration/RegisterDTO';
import { Router } from '@angular/router';

@Injectable()
export class ApiService {

    constructor(private http: HttpClient, private cookieService: CookieService, private router: Router) { }

    // requestUrl: string = 'http://localhost:8080';
    requestUrl: string = 'https://crm.happyticket.net';
    basicToken: string = 'YWYwOWVhMTctZDQ3Yy00NTJkLTkzZGUtMmM4OTE1N2I5ZDViOjlkYTczMTMzLTg3ZjQtNDE5ZS04MjVkLTcyOTMxNzI3NWYyMw==';
    requestOptions = {
        headers: new HttpHeaders({
            'X-Requested-With': 'XMLHttpRequest',
            'Content-type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token, Authorization, Access-Control-Allow-Methods, Access-Control-Allow-Origin',
            'Authorization': 'Basic ' + this.basicToken
        }),
        withCredentials: false
    };

    decoratorLogin(login: string, password: string, gcaptcha: string) {

        this.logIn(login, password, gcaptcha).subscribe(
            data => {
                this.setToken(data);
            },
            err => { window.location.href = this.requestUrl + '/login'; }
        )
    }

    logIn(login: string, password: string, gcaptcha: string): Observable<HttpResponse<any>> {
        localStorage.setItem('login', login);

        const body = new HttpParams()
            .set('sitepage', 'liteconstruct.com')
            .set('g-recaptcha-response', gcaptcha)
            .set('username', login)
            .set('password', password)
            .set('grant_type', 'password');

        return this.http.post<any>(this.requestUrl + '/oauth/token', body, this.requestOptions);
    }

    recovery(extLogin: string, gcaptcha: string): Observable<HttpResponse<any>> {
        const body = new HttpParams()
            .set('g-recaptcha-response', gcaptcha)
            .set('data', JSON.stringify({ login: extLogin }));
        return this.http.post<any>(this.requestUrl + '/recovery', body, {
            headers: new HttpHeaders({
                'Content-type': 'application/json',
            }),
            withCredentials: false
        });
    }

    register(extLogin: string, extEmail: string, extPassword: string, extRepeatPassword: string, extSponsor: string,
        extGcaptcha: string): Observable<HttpResponse<any>> {
        let extCompanyContactExtraData = {
            "ad3bfe4c-1ee0-478c-9689-4a95dd23db8f": extSponsor,
            "9941fd7b-8272-4913-9731-8d5f90368791": extEmail
        };

        let registerModel: RegisterDTO = {
            id: null,
            login: extLogin,
            password: extPassword,
            repeatPassword: extRepeatPassword,
            companyContactExtraData: {
                "ad3bfe4c-1ee0-478c-9689-4a95dd23db8f": extSponsor,
                "9941fd7b-8272-4913-9731-8d5f90368791": extEmail
            }
        };

        const body = new HttpParams()
            .set('data', JSON.stringify(registerModel))
            .set('g-recaptcha-response', extGcaptcha);

        return this.http.post<any>(this.requestUrl + '/auth/signupsponsor', body, {
            headers: new HttpHeaders({
                'Content-type': 'application/json',
            }),
            withCredentials: false
        });
    }

    logOut() {
        localStorage.removeItem('refresh_token');
        this.cookieService.delete('access_token');
        this.router.navigate(["/login"]);
    }

    setToken(token) {
        localStorage.setItem('refresh_token', token.refresh_token);
        let expireDate = new Date().getTime() + (1000 * token.expires_in);
        this.cookieService.set("access_token", token.access_token, expireDate);
    }

    updateRefreshToken(): string {

        const body = new HttpParams()
            .set('refresh_token', this.cookieService.get("refresh_token"))
            .set('grant_type', 'refresh_token');

        this.http.post(this.requestUrl + '/oauth/token', body, this.requestOptions)
            .subscribe(
                data => this.setToken(data),
                err => { console.log('error refresh token'); });
        return this.getAccessToken();
    }

    refreshDecorator(): string {
        if (!this.isLoggedId()) {
            return null;
        }
        this.singleRefreshToken().subscribe(
            data => { this.setToken(data); },
            err => {
                this.logOut();
                this.router.navigate(["/login"]);
            })
        return this.getAccessToken();
    }

    singleRefreshToken(): Observable<HttpResponse<any>> {

        const body = new HttpParams()
            .set('refresh_token', localStorage.getItem('refresh_token'))
            .set('grant_type', 'refresh_token');

        return this.http.post<any>(this.requestUrl + '/oauth/token', body, this.requestOptions);
    }

    refreshExampleToken(): Observable<any> {
        return this.singleRefreshToken()
            .pipe(
                map(data => {
                    this.setToken(data);
                    return <any>data;
                }, err => {
                    return <any>err;
                }));
    }

    getAccessToken(): string {
        return this.cookieService.get('access_token');
    }

    getRefreshToken(): string {
        return localStorage.getItem('refresh_token');
    }

    resolveAfterSecond() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(this.updateRefreshToken());
            }, 1000);
        });
    }

    // listQuery() {
    // this.http.post(this.requestUrl + '/manager/classes/list', null)
    // .subscribe(
    // data => { console.log(data) },
    // err => { console.log('error in listQuery') }
    // );
    // }

    isLoggedId(): boolean {
        return this.cookieService.check('access_token');
    }

    getCommonData(): Observable<HttpResponse<any>> {
        return this.http.get<any>(this.requestUrl + '/customer');
    }

    setAccountValue(record: Object): Observable<HttpResponse<any>> {
        return this.http.put<any>(this.requestUrl + '/account/setaccountdata',
            { "cclass": "7a38bfb3-7874-4eb4-b981-b38e5ade2df8", "record": record });
    }

    setNewPassword(record: Object): Observable<HttpResponse<any>> {
        return this.http.put<any>(this.requestUrl + '/account/newpassword', record);
    }

    newFinPassword(): Observable<HttpResponse<any>> {
        return this.http.put<any>(this.requestUrl + '/account/finpassword', {});
    }

    //manager
    getAllMatrix(): Observable<HttpResponse<any>> {
        return this.http.put<any>(this.requestUrl + '/manager/classes/allmatrix', {});
    }

    getAllStatistic(): Observable<HttpResponse<any>> {
        return this.http.put<any>(this.requestUrl + '/manager/classes/allstatistic', {});
    }

    setNextUser(): Observable<HttpResponse<any>> {
        return this.http.put<any>(this.requestUrl + '/manager/classes/nextuser', {});
    }

    //payment
    payeerKey(record: FormData): Observable<HttpResponse<any>> {
        // return this.http.post<any>("http://localhost:8080/payeer/key", record);
        return this.http.post<any>(this.requestUrl + "/payeer/key", record);
    }

    //business
    getSelfMatrixes(level) {
        return this.http.post<any>(this.requestUrl + "/account/levels", {"level":level});
    }

    sendBuyRequest(level) {
        return this.http.put<any>(this.requestUrl + "/account/matrix", {"matrix":{"level":level}});
    }

    getFilledUsers() {
        return this.http.post<any>(this.requestUrl + "/account/refall", { all: false });
    }

    getStatistic() {
        return this.http.post<any>(this.requestUrl + "/account/statistic", {});
    }

    getReffs() {
        return this.http.post<any>(this.requestUrl + "/account/refall", { all: true });
    }

    //payout
    payOut(record: Object): Observable<HttpResponse<any>> {
        return this.http.put<any>(this.requestUrl + '/account/payout',
            { "cclass": "7a38bfb3-7874-4eb4-b981-b38e5ade2df8", "record": record });
    }

    //transfer
    transfer(record: Object): Observable<HttpResponse<any>> {
        return this.http.put<any>(this.requestUrl + '/account/transfer',
            record);
    }

    //customer classes structure
    customerStructure(classID: string) {
        return this.http.post<any>(this.requestUrl + "/admin/anystructure", { cclass: classID });
    }

    customerData(classID: string, filters: Array<Object>, sorting: Array<Object>) {
        return this.http.post<any>(this.requestUrl + "/admin/anydata", { cclass: classID, filter: filters, sort: sorting });
    }

    adminClassSave(classID: string, record: Array<Object>): Observable<HttpResponse<any>> {
        return this.http.put<any>(this.requestUrl + '/setvalue',
            { "cclass": classID, "records": record });
    }

    //send confirmation mail: 
    confirmPayment(data: Object) {
        return this.http.post<any>(this.requestUrl + "/account/confirm", { data: data });
    }

    //get referral matrix: 
    getRefMatrix(matrixId: string) {
        return this.http.post<any>(this.requestUrl + "/account/refmatrix", { matrix: matrixId });
    }
}


