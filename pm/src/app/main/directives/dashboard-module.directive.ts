import { HeatmapComponent } from '../components/dashboard/modules/heatmap/heatmap.component';
import { AgentStateComponent } from '../components/dashboard/modules/agent-state/agent-state.component';
import { Directive, OnChanges, Input, ComponentRef, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { ModulesService } from '../services/modules.service';

export const moduleComponents = {
	heatmap: HeatmapComponent,
	agentState: AgentStateComponent
};

@Directive({
	selector: '[dashboardModule]'
})
export class DashboardModuleDirective implements OnChanges {
	@Input() componentRef: string;

	component: ComponentRef<any>;

    constructor(private container: ViewContainerRef, private resolver: ComponentFactoryResolver, private ms: ModulesService) {}
    
    ngOnChanges(e): void {
        const component = moduleComponents[this.componentRef];
        if (component) {
            const factory = this.resolver.resolveComponentFactory<any>(component);
            this.component = this.container.createComponent(factory);
            const moduleConfig = this.ms.moduleConfigs[this.ms.moduleConfigs.length - 1]; 
            this.component.instance.selectedGroup = moduleConfig.group;
            this.component.instance.uuid = moduleConfig.uuid;
            this.component.instance.type = moduleConfig.type;
            // TODO config injection
        }
    }
}
