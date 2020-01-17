import { UserAdminDTO } from '../main/components/user-admin/user-admin.component';
export interface AppState {
  readonly loginInfo: UserAdminDTO;
  readonly userList: UserAdminDTO[];
}