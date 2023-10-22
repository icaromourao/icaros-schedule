import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocsRoutingModule } from './docs-routing.module';
import { DocsComponent } from '../components/app-docs.component';

@NgModule({
  declarations: [
    DocsComponent,
  ],
  imports: [
    CommonModule,
    DocsRoutingModule,
  ],
})
export class DocsModule { }
