import { Routes } from '@angular/router';
import { ScenariosComponent } from './stepper/components/scenarios/scenarios.component';
import { DynamicStepperComponent } from './stepper/components/dynamic-stepper/dynamic-stepper.component';

export const routes: Routes = [
  { path: '', redirectTo: 'scenarios', pathMatch: 'full' },
  { path: 'scenarios', component: ScenariosComponent },
  { path: 'create-scenario', component: DynamicStepperComponent },
  { path: 'edit-scenario/:id', component: DynamicStepperComponent },
  { path: '**', redirectTo: 'scenarios' }
];
