import { Component, OnInit } from '@angular/core';
import { AppState } from '../../../../ngrx/app.state';
import { Store } from '@ngrx/store';
import { UserAdminDTO } from '../../user-admin/user-admin.component';
import { UserAdminService } from '../../../services/user-admin.service';
import { USER_LIST } from '../../../../ngrx/reducers/user-list.reducer';

@Component({
  selector: 'app-organize-meeting',
  templateUrl: './organize-meeting.component.html',
  styleUrls: ['./organize-meeting.component.scss']
})
export class OrganizeMeetingComponent implements OnInit {

  userList: UserAdminDTO[];

  constructor(
    private store: Store<AppState>,
    private uas: UserAdminService
  ) {
    this.store.select(res => res.userList).subscribe(
      (res: UserAdminDTO[]) => {
        if (res) {
          this.userList = res;
        } else {
          this.uas.getAllUsers().subscribe(
            res => {
              this.userList = res;
              this.store.dispatch({
                type: USER_LIST,
                payload: res
              })
            }
          )
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  ngOnInit() {
    
  }

}
