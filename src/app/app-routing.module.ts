import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//components
import { LoginComponent } from './login/login.component';
import { AddCustomerComponent } from './customer/add-customer/add-customer.component';
import { ListCustomersComponent } from './customer/list-customers/list-customers.component';
import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent },
  {path:'welcome',component:WelcomeComponent},
  {path:'addcustomer',component:AddCustomerComponent},
  {path:'',redirectTo:'welcome',pathMatch:'full'},
  {path:'**',redirectTo:'welcome',pathMatch:'full'}
];

export const routingComponents = [LoginComponent, AddCustomerComponent, ListCustomersComponent, WelcomeComponent];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }