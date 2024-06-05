import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { HomeComponent } from './component/home/home.component';
import { LoginComponent } from './component/login/login.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CategoryAddComponent } from './component/category-add/category-add.component';
import { CategoryListComponent } from './component/category-list/category-list.component';
import { CategoryEditComponent } from './component/category-edit/category-edit.component';
import { ProductListComponent } from './component/product-list/product-list.component';
import { ProductAddComponent } from './component/product-add/product-add.component';
import { ProductEditComponent } from './component/product-edit/product-edit.component';
import { ProductDetailComponent } from './component/product-detail/product-detail.component';
import { RegisterComponent } from './component/register/register.component';
import { UserListComponent } from './component/user-list/user-list.component';
import { UserAddComponent } from './component/user-add/user-add.component';
import { UserEditComponent } from './component/user-edit/user-edit.component';
import { AuthGuard } from './auth/auth-guard';
import { MyAccountComponent } from './component/my-account/my-account.component';
import { AdminGuard } from './auth/admin-guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'category-list', component: CategoryListComponent, canActivate: [AdminGuard] },
  { path: 'category-add', component: CategoryAddComponent, canActivate: [AdminGuard] },
  { path: 'category-edit/:id', component: CategoryEditComponent, canActivate: [AdminGuard] },
  { path: 'product-list', component: ProductListComponent, canActivate: [AdminGuard] },
  { path: 'product-add', component: ProductAddComponent, canActivate: [AdminGuard] },
  { path: 'product-edit/:id', component: ProductEditComponent, canActivate: [AdminGuard] },
  { path: 'product-detail/:id', component: ProductDetailComponent },
  { path: 'user-list', component: UserListComponent, canActivate: [AdminGuard] },
  { path: 'user-edit/:id', component: UserEditComponent, canActivate: [AdminGuard] },
  { path: 'my-account', component: MyAccountComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    CategoryListComponent,
    CategoryAddComponent,
    CategoryEditComponent,
    ProductListComponent,
    ProductAddComponent,
    ProductEditComponent,
    ProductDetailComponent,
    RegisterComponent,
    UserListComponent,
    UserAddComponent,
    UserEditComponent,
    MyAccountComponent
  ],

  imports: [
    BrowserModule,
    [RouterModule.forRoot(routes)],
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
