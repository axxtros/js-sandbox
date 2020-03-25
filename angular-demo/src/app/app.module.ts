import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SummaryComponent } from './components/summary/summary.component';
import { StocksService } from './services/stocks.service';
import { AuthService } from './services/auth.service';
import { IdemointerfaceService } from './services/idemointerface.service';
import { AppUserItemComponent } from './app-user-item/app-user-item.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ManageComponent } from './components/manage/manage.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    AppUserItemComponent, DashboardComponent, SummaryComponent, ManageComponent
  ],
  imports: [
    BrowserModule    
    ,HttpClientModule
    ,FormsModule, AppRoutingModule
  ],
  providers: [StocksService, IdemointerfaceService, AuthService],
  bootstrap: [AppComponent]
})

export class AppModule { }
