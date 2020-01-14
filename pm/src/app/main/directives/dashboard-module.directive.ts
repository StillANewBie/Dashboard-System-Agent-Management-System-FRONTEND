import { HeatmapComponent } from '../components/dashboard/modules/heatmap/heatmap.component';
import { AgentStateComponent } from '../components/dashboard/modules/agent-state/agent-state.component';
import { Directive, OnChanges, Input, ComponentRef, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { ModulesService } from '../services/modules.service';
import { IComponent } from '../services/dashboard-module.service';
import { OutcomeComponent } from '../components/dashboard/modules/outcome/outcome.component';

export const moduleComponents = {
	heatmap: HeatmapComponent,
	agentState: AgentStateComponent,
	outcomes: OutcomeComponent
};

@Directive({
	selector: '[dashboardModule]'
})
export class DashboardModuleDirective implements OnChanges {
	@Input() componentInfo: IComponent;

	component: ComponentRef<any>;

	constructor(
		private container: ViewContainerRef,
		private resolver: ComponentFactoryResolver,
		private ms: ModulesService
	) {}

	ngOnChanges(e): void {
		const component = moduleComponents[this.componentInfo.componentRef];

		if (component) {
			const factory = this.resolver.resolveComponentFactory<any>(component);
			this.component = this.container.createComponent(factory);
			if (this.componentInfo.option) {
				this.component.instance.selectedGroup = this.componentInfo.option.group;
				this.component.instance.uuid = this.componentInfo.option.uuid;
				this.component.instance.type = this.componentInfo.option.type;
			}
			// TODO config injection
		}
	}
}
