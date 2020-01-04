import { Component, OnInit } from '@angular/core';
import { ModulesService, CurrentAgentStateDTO } from '../../../../services/modules.service';

@Component({
  selector: 'app-agent-state',
  templateUrl: './agent-state.component.html',
  styleUrls: ['./agent-state.component.scss']
})
export class AgentStateComponent implements OnInit {

  gid: number = 1;
  data: CurrentAgentStateDTO[] = [];

  constructor(private ms: ModulesService) { }

  ngOnInit() {
    this.ms.getCurrentAgentState(this.gid).subscribe(
      (res: CurrentAgentStateDTO[]) => {
        this.data = res;
      }, error => {console.log(error)}
  )
  }

}
