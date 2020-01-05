import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ModulesService {


    constructor(private http: HttpClient){}

    getCurrentAgentState(gid: number) {
        return this.http.get(`${environment.API_URL}dashboard/currentagentstate/` + gid, {withCredentials: true});
	}
	
	getGroups() {
		return this.http.get(`${environment.API_URL}dashboard/group`, {withCredentials: true});
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