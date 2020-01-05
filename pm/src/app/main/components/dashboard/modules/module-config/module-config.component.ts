import { Component, OnInit } from '@angular/core';
import { ModulesService } from '../../../../services/modules.service';

@Component({
	selector: 'app-module-config',
	templateUrl: './module-config.component.html',
	styleUrls: [ './module-config.component.scss' ]
})
export class ModuleConfigComponent implements OnInit {
	selectedGroupLevel1: GroupDTO = null;
	selectedGroupLevel2: GroupDTO = null;
	selectedGroupLevel3: GroupDTO = null;
	selectedGroupLevel: number = 1;
	selectedGroup: GroupDTO;

	constructor(private ms: ModulesService) {
		this.ms.getGroups().subscribe((res: GroupDTO) => (this.selectedGroupLevel1 = res));
	}

	radioOnChange(e) {
		switch (e.value) {
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
	}

	ngOnInit() {}
}

export interface GroupDTO {
	groupId: number;
	groupName: string;
	groupLevel?: number;
	childGroup?: GroupDTO[];
}
