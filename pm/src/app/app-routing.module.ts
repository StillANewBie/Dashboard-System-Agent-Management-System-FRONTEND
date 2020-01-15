import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/components/main/main.component';
import { LoginComponent } from './login/components/login/login.component';
import { AuthGuard } from './login/auth.guard';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'main',
		pathMatch: 'full',
		canActivate: [AuthGuard]
	},
	{
		path: 'main',
		component: MainComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'login',
		component: LoginComponent
	}
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}
