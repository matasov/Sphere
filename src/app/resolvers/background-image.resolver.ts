import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { map } from 'rxjs/operators';

@Injectable()
export class BackgroundImageResolver implements Resolve<any> {
	constructor(
		private http: HttpClient,
		private sanitizer: DomSanitizer
	) { }

	resolve = (): Observable<any> =>
		this.http.get('assets/media/images/main-bg.svg', { responseType: 'blob' }).pipe(
			map(image => {
				const blob: Blob = new Blob([image], { type: 'image/svg+xml' });
				const imageStyle = `url(${window.URL.createObjectURL(blob)})`;
				return this.sanitizer.bypassSecurityTrustStyle(imageStyle);
			})
		)
}