import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class FrontPageService {
	meeting: string = 'meeting';

	constructor(private http: HttpClient) {}

	findMeetingsByInitiatorId(initiatorId: number): Observable<MeetingDTO[]> {
		return this.http.get<MeetingDTO[]>(`${environment.API_URL}/${this.meeting}/initiator/${initiatorId}`, {
			withCredentials: true
		});
	}

	findMeetingsByInviteeId(inviteeId: number): Observable<MeetingDTO[]> {
		return this.http.get<MeetingDTO[]>(`${environment.API_URL}/${this.meeting}/invitee/${inviteeId}`, {
			withCredentials: true
		});
	}

	findUndecidedMeetingsByInviteeId(inviteeId: number): Observable<MeetingDTO[]> {
		return this.http.get<MeetingDTO[]>(`${environment.API_URL}/${this.meeting}/invitee-un/${inviteeId}`, {
			withCredentials: true
		});
	}

	initiateMeeting(title: string, initiatorId: number, memo: string, date: string, time: string): Observable<any> {
    const fd = new FormData();
    fd.append('title', title);
    fd.append('initiatorId', initiatorId.toString());
    fd.append('memo', memo);
    fd.append('date', date);
    fd.append('time', time);
    
    return this.http.post(`${environment.API_URL}/${this.meeting}/initiate`,
    fd,    
    {
			withCredentials: true
		});
	}

	saveMeetingInvitee(meetingId: number, inviteeId: number): Observable<any> {
    const fd = new FormData();
    fd.append('meetingId', meetingId.toString());
    fd.append('inviteeId', inviteeId.toString());
    
    return this.http.post(`${environment.API_URL}/${this.meeting}/invite`,
    fd,    
    {
			withCredentials: true
		});
	}

	alterMeetingDecision(meetingInviteesId: number, decision: number): Observable<any> {
    const fd = new FormData();
    fd.append('meetingInviteesId', meetingInviteesId.toString());
    fd.append('decision', decision.toString());
    
    return this.http.post(`${environment.API_URL}/${this.meeting}/decision`,
    fd,    
    {
			withCredentials: true
		});
	}

	cancelMeeting(meetingId: number): Observable<any> {
    const fd = new FormData();
    fd.append('meetingId', meetingId.toString());
    
    return this.http.post(`${environment.API_URL}/${this.meeting}/cancel`,
    fd,    
    {
			withCredentials: true
		});
	}
}

export class MeetingDTO {
	meetingId?: number;
	meetingInviteesId?: number;
	meetingTitle?: string;
	initiatorId?: number;
	initiatorFirstName?: string;
	initiatorLastName?: string;
	initiatorEmail?: string;
	initiatorImage?: string;
	inviteeId?: number;
	inviteeFirstName?: string;
	inviteeLastName?: string;
	inviteeEmail?: string;
	inviteeImage?: string;
	meetingMemo?: string;
	date?: Date;
	time?: Date;
	meetingCancelled;
	result?: number;
}
