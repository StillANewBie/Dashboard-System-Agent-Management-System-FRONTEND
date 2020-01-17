import { Component, OnInit } from '@angular/core';
import { AppState } from '../../../../ngrx/app.state';
import { Store } from '@ngrx/store';
import { UserAdminDTO } from '../../user-admin/user-admin.component';

@Component({
  selector: 'app-organize-meeting',
  templateUrl: './organize-meeting.component.html',
  styleUrls: ['./organize-meeting.component.scss']
})
export class OrganizeMeetingComponent implements OnInit {

  userList: UserAdminDTO;

  constructor(
    private store: Store<AppState>
  ) {
    this.store.subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.error(err);
      }
    );
    this.store.select(res => res.userList).subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.error(err);
      }
    );
  }

  ngOnInit() {
  }

}
