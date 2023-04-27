import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home/:myid',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'settings',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'cart-modal',
    loadChildren: () => import('./pages/cart-modal/cart-modal.module').then( m => m.CartModalPageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: 'bill',
    loadChildren: () => import('./pages/bill/bill.module').then( m => m.BillPageModule)
  },
  {
    path: 'payment-menu',
    loadChildren: () => import('./payment-menu/payment-menu.module').then( m => m.PaymentMenuPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'report-modal',
    loadChildren: () => import('./pages/report-modal/report-modal.module').then( m => m.ReportModalPageModule)
  },
  {
    path: 'alert-message',
    loadChildren: () => import('./pages/alert-message/alert-message.module').then( m => m.AlertMessagePageModule)
  },
  {
    path: 'eatin-message',
    loadChildren: () => import('./pages/eatin-message/eatin-message.module').then( m => m.EatinMessagePageModule)
  },
  {
    path: 'coupon-home',
    loadChildren: () => import('./pages/coupon/coupon-home/coupon-home.module').then( m => m.CouponHomePageModule)
  },
  {
    path: 'coupon-menu',
    loadChildren: () => import('./pages/coupon/coupon-menu/coupon-menu.module').then( m => m.CouponMenuPageModule)
  },
  {
    path: 'mug-message',
    loadChildren: () => import('./pages/mug-message/mug-message.module').then( m => m.MugMessagePageModule)
  },
  {
    path: 'cart-check',
    loadChildren: () => import('./pages/cart-check/cart-check.module').then( m => m.CartCheckPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
