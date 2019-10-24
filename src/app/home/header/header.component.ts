import { Component, OnInit } from '@angular/core';
import { SafeStyle } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
	backgroundImage: SafeStyle;
	constructor(private route: ActivatedRoute) { }

	ngOnInit() {
		this.backgroundImage = this.route.snapshot.data['background'];
		this.loadScript('../../../assets/media/js/slick.js');
		this.loadScript('../../../assets/media/js/marketingitemsslik.js');
		this.loadScript('../../../assets/media/js/test.js');
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
