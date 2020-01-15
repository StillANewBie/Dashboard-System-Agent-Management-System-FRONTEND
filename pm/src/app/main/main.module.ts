import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatBadgeModule, MatButtonModule, MatCheckboxModule, MatDividerModule } from '@angular/material';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { GridsterModule } from 'angular-gridster2';
import { AppRoutingModule } from '../app-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AgentStateComponent } from './components/dashboard/modules/agent-state/agent-state.component';
import { HeatmapComponent } from './components/dashboard/modules/heatmap/heatmap.component';
import { MainComponent } from './components/main/main.component';
import { DashboardModuleDirective } from './directives/dashboard-module.directive';
import { ModuleConfigComponent } from './components/dashboard/modules/module-config/module-config.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserAdminComponent } from './components/user-admin/user-admin.component';
import { UserDetailsDialogComponent } from './components/shared-components/user-details-dialog/user-details-dialog.component';
import { ImageCropComponent } from './components/shared-components/image-crop/image-crop.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ImageCropperComponent } from 'ngx-img-cropper';
import { AddUserComponent } from './components/user-admin/add-user/add-user.component';
import { OutcomeComponent } from './components/dashboard/modules/outcome/outcome.component';
import { FrontPageComponent } from './components/front-page/front-page.component';
import { JwtInterceptor } from '../login/intercepters/jwt.interceptor';
import { ErrorInterceptor } from '../login/intercepters/error.interceptor';

const routes: Routes = [
	{
		path: 'main',
		component: MainComponent,
		children: [
			{
				path: 'home',
				component: FrontPageComponent
			},
			{
				path: 'dashboard',
				component: DashboardComponent
			},
			{
				path: 'user-admin',
				component: UserAdminComponent
			}
		]
	}
];

@NgModule({
	declarations: [
		MainComponent,
		DashboardComponent,
		HeatmapComponent,
		OutcomeComponent,
		AgentStateComponent,
		DashboardModuleDirective,
		ModuleConfigComponent,
		UserAdminComponent,
		UserDetailsDialogComponent,
		ImageCropComponent,
		ImageCropperComponent,
		AddUserComponent,
		FrontPageComponent
	],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		RouterModule.forChild(routes),
		AgGridModule.withComponents([]),
		AppRoutingModule,
		CommonModule,
		HttpClientModule,
		GridsterModule,
		MatCheckboxModule,
		MatCheckboxModule,
		MatButtonModule,
		MatInputModule,
		MatAutocompleteModule,
		MatDatepickerModule,
		MatFormFieldModule,
		MatRadioModule,
		MatSelectModule,
		MatSliderModule,
		MatSlideToggleModule,
		MatMenuModule,
		MatSidenavModule,
		MatToolbarModule,
		MatListModule,
		MatGridListModule,
		MatCardModule,
		MatStepperModule,
		MatTabsModule,
		MatExpansionModule,
		MatButtonToggleModule,
		MatChipsModule,
		MatIconModule,
		MatProgressSpinnerModule,
		MatProgressBarModule,
		MatDialogModule,
		MatTooltipModule,
		MatSnackBarModule,
		MatTableModule,
		MatSortModule,
		MatPaginatorModule,
		MatBadgeModule,
		MatDividerModule,
		NgxDropzoneModule
	],
	entryComponents: [
		HeatmapComponent,
		OutcomeComponent,
		AgentStateComponent,
		ModuleConfigComponent,
		UserAdminComponent,
		UserDetailsDialogComponent,
		ImageCropComponent,
		AddUserComponent
	],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
	]
})
export class MainModule {}
