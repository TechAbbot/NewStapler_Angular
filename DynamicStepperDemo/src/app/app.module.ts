import { NgModule } from '@angular/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CdkStepperModule } from '@angular/cdk/stepper';

bootstrapApplication(AppComponent).catch((err) => console.error(err));

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    CdkStepperModule,
  ],
  providers: [],
})
export class AppModule {}
