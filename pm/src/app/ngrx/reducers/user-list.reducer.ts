import { UserAdminDTO } from '../../main/components/user-admin/user-admin.component';

export const USER_LIST = 'USER_LIST';

export function userListReducer(state: UserAdminDTO[] = [], action) {
  switch(action.type) {
    case USER_LIST:
      return action.payload;
    default:
      return state;
  }
}