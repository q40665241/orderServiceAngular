import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ProductsComponent } from './components/products/products.component';
import { OrderComponent } from './components/order/order.component';
import { PlaceOrderComponent } from './components/place-order/place-order.component';

const routes: Routes = [
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'order', component: OrderComponent },
  {path:'placeorder',component:PlaceOrderComponent},
  { path: '', redirectTo: '/products', pathMatch: 'full' } // Default route
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
