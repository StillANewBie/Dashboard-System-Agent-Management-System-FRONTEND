import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserAdminDTO } from 'src/app/main/components/user-admin/user-admin.component';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class AuthenticationService {
	private currentUserSubject: BehaviorSubject<UserAdminDTO>;
	public currentUser: Observable<UserAdminDTO>;

	constructor(private http: HttpClient) {
		this.currentUserSubject = new BehaviorSubject<UserAdminDTO>(JSON.parse(localStorage.getItem('currentUser')));
		this.currentUser = this.currentUserSubject.asObservable();
	}

	public get currentUserValue(): UserAdminDTO {
		return this.currentUserSubject.value;
	}

	login(username: string, password: string) {
		return this.http.post<any>(`${environment.API_URL}/authenticate`, { username, password }).pipe(
			map((user) => {
				localStorage.setItem('currentUser', JSON.stringify(user));
				this.currentUserSubject.next(user);
				return user;
			})
		);
	}

	logout() {
		localStorage.removeItem('currentUser');
		this.currentUserSubject.next(null);
	}
}
