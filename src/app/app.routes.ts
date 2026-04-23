import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { LayoutComponent } from './layout/layout';
import { HomeComponent } from './home/home';
import { UsuariosComponent } from './usuarios/usuarios';
import { ClientesComponent } from './clientes/clientes';
import { InventarioComponent } from './inventario/inventario';
import { PedidosComponent } from './pedidos/pedidos';
import { PagosComponent } from './pagos/pagos';
import { ReportesComponent } from './reportes/reportes';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: '', 
    component: LayoutComponent,
    children: [
        { path: '', redirectTo: 'home', pathMatch: 'full' },
        { path: 'home', component: HomeComponent },
        { path: 'usuarios', component: UsuariosComponent },
        { path: 'clientes', component: ClientesComponent },
        { path: 'inventario', component: InventarioComponent },
        { path: 'pedidos', component: PedidosComponent },
        { path: 'pagos', component: PagosComponent },
        { path: 'reportes', component: ReportesComponent }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
