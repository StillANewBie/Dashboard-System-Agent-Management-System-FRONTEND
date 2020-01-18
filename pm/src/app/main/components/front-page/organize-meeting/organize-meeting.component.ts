import { Component, OnInit, ChangeDetectionStrategy, ViewChildren, ElementRef, AfterViewChecked } from '@angular/core';
import { AppState } from '../../../../ngrx/app.state';
import { Store } from '@ngrx/store';
import { UserAdminDTO } from '../../user-admin/user-admin.component';
import { UserAdminService } from '../../../services/user-admin.service';
import { USER_LIST } from '../../../../ngrx/reducers/user-list.reducer';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material';

@Component({
	selector: 'app-organize-meeting',
	templateUrl: './organize-meeting.component.html',
  styleUrls: [ './organize-meeting.component.scss' ],
})
export class OrganizeMeetingComponent implements OnInit, AfterViewChecked {
	stateCtrl = new FormControl();
	filteredStates: Observable<UserAdminDTO[]>;
  userList: UserAdminDTO[];
  selectedUsers = [{}];
  attendeeForm = new FormGroup({
    selected: new FormControl([])
  });
  valueChange: boolean = false;

	constructor(
    private dialogRef: MatDialogRef<OrganizeMeetingComponent>,
    private store: Store<AppState>, 
    private uas: UserAdminService,
    private er: ElementRef) {
		this.store.select((res) => res.userList).subscribe(
			(res: UserAdminDTO[]) => {
				if (res && res.length >= 1) {
					this.userList = res;
          this.initFilter();
        } else {
					this.uas.getAllUsers().subscribe((res) => {
						this.userList = res;
						this.store.dispatch({
							type: USER_LIST,
							payload: res
						});
            this.initFilter();
					});
				}
			},
			(err) => {
				console.error(err);
			}
		);
	}

	private _filterStates(value: string): UserAdminDTO[] {
		const filterValue = value.toLowerCase();

		return this.userList.filter((state) => state.username.toLowerCase().indexOf(filterValue) === 0);
	}

	initFilter() {
		this.filteredStates = this.stateCtrl.valueChanges.pipe(
			startWith(''),
			map((state) => (state ? this._filterStates(state) : this.userList.slice()))
		);
  }
  
  addAttendee() {
    this.selectedUsers.push({});
    this.valueChange = true;
  }

  ngAfterViewChecked() {
    if (this.valueChange) {
      setTimeout(()=> {
        const temp = this.er.nativeElement.getElementsByClassName('attendee_input')
        temp[this.selectedUsers.length - 1].value = '';
        this.valueChange = false;
      });
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  submit() {
    console.log(this.er.nativeElement.getElementsByClassName('attendee_input')[0].value)
  }

	ngOnInit() {}
}
