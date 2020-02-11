import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//components
import { LoginComponent } from './login/login.component';
import { AddCustomerComponent } from './customer/add-customer/add-customer.component';
import { ListCustomersComponent } from './customer/list-customers/list-customers.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ListproductComponent } from './products/listproduct/listproduct.component';
import { AddstockComponent } from './products/addstock/addstock.component';
const routes: Routes = [
  {path: 'login', component: LoginComponent },
  {path:'welcome',component:WelcomeComponent},
  {path:'addcustomer',component:AddCustomerComponent},
  {path:'listcustomer',component:ListCustomersComponent},
  {path:'listproduct',component:ListproductComponent},
  {path:'addstock',component:AddstockComponent},
  {path:'',redirectTo:'welcome',pathMatch:'full'},
  {path:'**',redirectTo:'welcome',pathMatch:'full'}
];

export const routingComponents = [LoginComponent, AddCustomerComponent, ListCustomersComponent, WelcomeComponent,ListproductComponent,AddstockComponent];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
