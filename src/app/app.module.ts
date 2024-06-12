import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { TechniquesDashboardComponent } from './components/techniques-dashboard/techniques-dashboard.component';
import { LearningsDashboardComponent } from './components/learnings-dashboard/learnings-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomePageComponent,
    TechniquesDashboardComponent,
    LearningsDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
