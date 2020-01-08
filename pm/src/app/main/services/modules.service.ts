import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { ModuleConfigDTO } from '../components/dashboard/modules/module-config/module-config.component';

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