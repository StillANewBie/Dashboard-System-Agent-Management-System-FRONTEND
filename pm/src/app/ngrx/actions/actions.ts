import { createAction, props } from '@ngrx/store';
import { UserAdminDTO } from '../../main/components/user-admin/user-admin.component';

export const loginInfo = createAction(
  'loginInfo',
  props<UserAdminDTO>()
);
export const userList = createAction(
  'userList'
);