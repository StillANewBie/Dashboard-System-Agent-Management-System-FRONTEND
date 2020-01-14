import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ModulesService {
	// moduleConfigs: ModuleConfigDTO[] = [];

    constructor(private http: HttpClient){}

    getCurrentAgentState(gid: number) {
        return this.http.get(`${environment.API_URL}/dashboard/currentagentstate/` + gid, {withCredentials: true});
	}
	
	getHeatmapData(gid: number) {
		return this.http.get(`${environment.API_URL}/dashboard/heatmap/` + gid, {withCredentials: true});
	}

	getGroups() {
		return this.http.get(`${environment.API_URL}/user-admin/group`, {withCredentials: true});
	}

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

export interface CurrentAgentStateDTO {

	callId: string;
	phoneNumber: string;
	priority: number;
	cur_date: Date;
	queueStart: string;
	queueExit: string;
	queueTime: number;
	serviceStart: string;
	serviceExit: string;
	serviceTime: number;
	outcome: string;
	firstName: string;
	lastName: string;
	profileImage: string;
	groupName: string;
	agentId?: number;
}