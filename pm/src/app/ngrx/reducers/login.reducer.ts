import { Action } from '@ngrx/store';
import { UserAdminDTO } from '../../main/components/user-admin/user-admin.component';
import { state } from '@angular/animations';

export const LOGIN_INFO = 'LOGIN_INFO';

export function loginInfoReducer(status: UserAdminDTO = new UserAdminDTO(), action) {
  switch(action.type) {
    case LOGIN_INFO: 
      return action.payload;
    default:
      return state;
  }
}