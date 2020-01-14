import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class FrontPageService {

	constructor(private http: HttpClient) {	}

	getOutcomes(days: number): Observable<any> {
		return this.http.get(`${environment.API_URL}/front-page/outcomes/${days}`)
	}

	fetchCallAvgDataByGroupIdAndDays(gid: number, days: number): Observable<any> {
		const fd = new FormData();
		fd.append('groupId', gid.toString());
		fd.append('days', days.toString());

		return this.http.post(`${environment.API_URL}/front-page/callavgtime`, fd, {withCredentials: true})
	}

	fetchCallTotalDataByGroupIdAndDays(gid: number, days: number): Observable<any> {
		const fd = new FormData();
		fd.append('groupId', gid.toString());
		fd.append('days', days.toString());

		return this.http.post(`${environment.API_URL}/front-page/calltotaltime`, fd, {withCredentials: true})
	}
}
