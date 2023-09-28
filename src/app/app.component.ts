import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Registrar Proveedor', url: '/categoria', icon: 'apps' },
    { title: 'Registrar Producto', url: '/home', icon: 'add-circle' },
    { title: 'Gastos', url: '/proveedor', icon: 'cube' },
    { title: 'Cobrar', url: '/vender', icon: 'cart' },
    { title: 'Producto Vendido', url: '/ganancia', icon: 'cash' },
  ];
  public labels = [];
  constructor() {}

  irLogin(){
    localStorage.removeItem('LoginID');
    window.location.href = '/login';
  }
}
