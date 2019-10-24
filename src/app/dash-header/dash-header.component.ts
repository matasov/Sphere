import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-dash-header',
	templateUrl: './dash-header.component.html',
	styleUrls: ['./dash-header.component.css']
})
export class DashHeaderComponent implements OnInit {

	constructor() { }

	ngOnInit() {
		this.loadScript('../../../assets/media/js/bootadmin.js');
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

}
