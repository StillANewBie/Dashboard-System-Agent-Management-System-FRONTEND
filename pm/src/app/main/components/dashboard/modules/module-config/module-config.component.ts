import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { ModulesService } from '../../../../services/modules.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DashboardModuleService, IComponent } from '../../../../services/dashboard-module.service';
import { GroupLevelDTO } from '../../../user-admin/user-admin.component';

@Component({
	selector: 'app-module-config',
	templateUrl: './module-config.component.html',
	styleUrls: [ './module-config.component.scss' ]
})
export class ModuleConfigComponent implements OnInit {
	selectedGroupLevel1: GroupDTO = { childGroups: [] };
	selectedGroupLevel2: GroupDTO = { childGroups: [] };
	selectedGroupLevel3: GroupDTO = null;
	selectedGroupLevel: number = 1;
	selectedGroup: GroupDTO;
	result: ModuleConfigDTO;

	constructor(
		private ms: ModulesService,
		private ds: DashboardModuleService,
		private dialogRef: MatDialogRef<ModuleConfigComponent>,
		@Inject(MAT_DIALOG_DATA) public data: IComponent,
		private cdr: ChangeDetectorRef
	) {
		this.ms.getGroups().subscribe((res: GroupDTO) => {
			this.selectedGroupLevel1 = res;
			this.selectedGroupLevel2 = res.childGroups[0];
			this.selectedGroupLevel3 = this.selectedGroupLevel2.childGroups[0];
			this.cdr.detectChanges();
		});
	}

	optionOnChange(e) {
		if (e.isUserInput) {
			if (e.source.value.groupLevel == 3) {
				this.selectedGroupLevel3 = e.source.value;
			}
		}
	}

	radioOnChange(e) {
		switch (e.value) {
			case '1':
				this.selectedGroupLevel = 1;
				break;
			case '2':
				this.selectedGroupLevel = 2;
				break;
			case '3':
				this.selectedGroupLevel = 3;
				break;
		}
	}

	submit(e) {
		switch (this.selectedGroupLevel) {
			case 1:
				this.selectedGroup = this.selectedGroupLevel1;
				break;
			case 2:
				this.selectedGroup = this.selectedGroupLevel2;
				break;
			case 3:
				this.selectedGroup = this.selectedGroupLevel3;
				break;
		}

		// this.result = { group: this.selectedGroup, uuid: this.data.id };
		this.data.option = { group: this.selectedGroup, uuid: this.data.id };
		if (!Array.isArray(this.ds.components)) {
      this.ds.components = [];
    }
    this.ds.components.push(this.data);
	}

	ngOnInit() {}
}

export interface GroupDTO {
	groupId?: number;
	groupName?: string;
	groupLevel?: number;
	childGroups?: GroupDTO[];
	groupLevelInfo?: GroupLevelDTO;
}

export interface ModuleConfigDTO {
	group: GroupDTO;
	uuid: string;
	type?: any;
}
