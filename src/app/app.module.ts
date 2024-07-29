import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { TechniquesDashboardComponent } from './components/techniques-dashboard/techniques-dashboard.component';
import { LearningsDashboardComponent } from './components/learnings-dashboard/learnings-dashboard.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ManageComponent } from './components/manage/manage.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { MessageDialogComponent } from './components/message-dialog/message-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomePageComponent,
    TechniquesDashboardComponent,
    LearningsDashboardComponent,
    LoadingComponent,
    ManageComponent,
    LoginComponent,
    ConfirmationDialogComponent,
    MessageDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
