import { UserAdminDTO } from '../../main/components/user-admin/user-admin.component';

export const LOGIN_INFO = 'LOGIN_INFO';

export function loginInfoReducer(state: UserAdminDTO = new UserAdminDTO(), action) {
  switch(action.type) {
    case LOGIN_INFO: 
      return action.payload;
    default:
      return state;
  }
}