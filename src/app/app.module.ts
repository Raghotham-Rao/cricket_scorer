import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddPlayerComponent } from './dashboard/add_player.component';
import { AppHomeComponent } from './app-home.component';
import { UserHomeComponent } from './dashboard/user_home.component';

const routes: Routes = [
  {path: '', component: AppHomeComponent},
  {
    path: 'dashboard', 
    component: DashboardComponent,
    children: [
      {path: '', component: UserHomeComponent},
      {path: 'add_player', component: AddPlayerComponent}
    ]
  },
]


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DashboardComponent,
    AddPlayerComponent,
    AppHomeComponent,
    UserHomeComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
