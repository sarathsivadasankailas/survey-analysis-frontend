import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { TechniquesDashboardComponent } from './components/techniques-dashboard/techniques-dashboard.component';
import { LearningsDashboardComponent } from './components/learnings-dashboard/learnings-dashboard.component';

const routes: Routes = [
  { path: '',             component: HomePageComponent},
  { path: 'techniques',   component: TechniquesDashboardComponent },
  { path: 'learnings',    component: LearningsDashboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
