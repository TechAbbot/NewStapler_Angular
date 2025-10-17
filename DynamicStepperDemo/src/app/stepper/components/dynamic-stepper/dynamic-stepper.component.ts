import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormControl,
  AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dynamic-stepper',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './dynamic-stepper.component.html',
  styleUrl: './dynamic-stepper.component.css'
})
export class DynamicStepperComponent implements OnInit, OnDestroy {
  @Input() formConfig: any;
  @Input() initialData: any = null;

  selectedIndex = 0;
  stepForms: FormGroup[] = [];
  formErrors: { [key: string]: string } = {};

  private destroy$ = new Subject<void>();
  selectedDriver: any;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.initializeForms();
    if (this.initialData) {
      this.patchFormData(this.initialData);
    }
    const commentsStep = this.formConfig?.stepsDetails?.find((step: any) =>
      step.fields?.some((f: any) => f.fieldType === 'comments')
    );

    if (commentsStep) {
      const commentsField = commentsStep.fields.find(
        (f: any) => f.fieldType === 'comments'
      );
      if (commentsField?.drivers?.length) {
        this.selectedDriver = commentsField.drivers[0].driverId;
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeForms() {
    // FIX: Added null safety check for formConfig.stepsDetails
    if (!this.formConfig?.stepsDetails) {
      console.warn('formConfig.stepsDetails is undefined');
      return;
    }

    this.formConfig.stepsDetails.forEach((step: any) => {
      const stepForm = this.fb.group({});

      // FIX: Added null safety for step.fields
      if (step?.fields) {
        step.fields.forEach((field: any) => {
          switch (field.fieldType) {
            case 'criteriaSelection':
              this.addCriteriaSelectionField(stepForm, field);
              break;
            case 'surveyTable':
              this.addSurveyTableField(stepForm, field);
              break;
            case 'impactDrivers':
              this.addImpactDriversField(stepForm, field);
              break;
            case 'enpsSettings':
              this.addEnpsSettingsField(stepForm, field);
              break;
            case 'comments':
              this.addCommentsField(stepForm, field);
              break;
            default:
              this.addBasicField(stepForm, field);
          }
        });
      }

      this.stepForms.push(stepForm);
    });

    // Subscribe to impact drivers changes for real-time overall score calculation
    this.setupImpactDriversCalculation();
  }

  private setupImpactDriversCalculation() {
    const impactDriversStep = this.formConfig?.stepsDetails?.find((step: any) =>
      step?.fields?.some((field: any) => field.fieldType === 'impactDrivers')
    );

    if (impactDriversStep) {
      const impactField = impactDriversStep.fields.find(
        (field: any) => field.fieldType === 'impactDrivers'
      );
      const stepIndex = this.formConfig.stepsDetails.indexOf(impactDriversStep);
      const driversGroup = this.stepForms[stepIndex]?.get(
        impactField.controlName
      ) as FormGroup;

      if (driversGroup) {
        Object.keys(driversGroup.controls).forEach((key) => {
          if (key !== 'overallScore') {
            driversGroup
              .get(key)
              ?.valueChanges.pipe(takeUntil(this.destroy$))
              .subscribe(() => {
                this.calculateOverallScore(stepIndex, impactField.controlName);
              });
          }
        });
      }
    }
  }

  private calculateOverallScore(stepIndex: number, controlName: string) {
    const driversGroup = this.stepForms[stepIndex]?.get(
      controlName
    ) as FormGroup;
    if (!driversGroup) return;

    let total = 0;
    let count = 0;

    Object.keys(driversGroup.controls).forEach((key) => {
      if (key !== 'overallScore') {
        const value = +(driversGroup.get(key)?.value || 0);
        if (!isNaN(value)) {
          total += value;
          count++;
        }
      }
    });

    const average = count > 0 ? Math.round(total / count) : 0;
    driversGroup.get('overallScore')?.setValue(average, { emitEvent: false });
  }

  private addBasicField(stepForm: FormGroup, field: any) {
    const validators = this.getValidators(field);
    stepForm.addControl(
      field.controlName,
      this.fb.control(field.value, validators)
    );
  }

  private addCriteriaSelectionField(stepForm: FormGroup, field: any) {
    const criteriaGroup = this.fb.group({});

    // FIX: Added null safety for criteriaList
    if (field?.criteriaList) {
      field.criteriaList.forEach((criteria: any) => {
        const criteriaForm: FormGroup = this.fb.group({
          isSelected: [criteria.isSelected],
        });

        const rowsArray = this.fb.array([]);
        if (criteria.subForm && criteria.subForm.fields) {
          criteria.subForm.fields.forEach((row: any) => {
            const rowGroup: any = this.fb.group({});
            row.controls.forEach((control: any) => {
              const controlValidators = this.getValidators(control);
              rowGroup.addControl(
                control.controlName,
                this.fb.control(control.value, controlValidators)
              );
            });
            rowsArray.push(rowGroup);
          });
        }

        criteriaForm.addControl('rows', rowsArray);
        criteriaGroup.addControl(criteria.criteriaId, criteriaForm);
      });
    }

    stepForm.addControl(field.controlName, criteriaGroup);
  }

  private addSurveyTableField(stepForm: FormGroup, field: any) {
    const tableArray = this.fb.array([]);
    // FIX: Added null safety for rows
    if (field?.rows) {
      field.rows.forEach((row: any) => {
        const rowGroup: any = this.fb.group({});
        field.columns.forEach((col: any) => {
          rowGroup.addControl(col.columnId, this.fb.control(row[col.columnId]));
        });
        tableArray.push(rowGroup);
      });
    }
    stepForm.addControl(field.controlName, tableArray);
  }

  private addImpactDriversField(stepForm: FormGroup, field: any) {
    const driversGroup = this.fb.group({});

    // FIX: Added null safety for drivers
    if (field?.drivers) {
      field.drivers.forEach((driver: any) => {
        const validators = this.getValidators(driver);
        driversGroup.addControl(
          driver.driverId,
          this.fb.control(driver.value, validators)
        );
      });
    }

    driversGroup.addControl(
      'overallScore',
      this.fb.control(field.overallScore)
    );
    stepForm.addControl(field.controlName, driversGroup);
  }

  private addEnpsSettingsField(stepForm: FormGroup, field: any) {
    const enpsGroup = this.fb.group({});

    // FIX: Added null safety for categories
    if (field?.categories) {
      field.categories.forEach((category: any) => {
        const validators = this.getValidators(category);
        enpsGroup.addControl(
          category.categoryId,
          this.fb.control(category.value, validators)
        );
      });
    }

    enpsGroup.addControl('total', this.fb.control(field.total));
    stepForm.addControl(field.controlName, enpsGroup);
  }

  private addCommentsField(stepForm: FormGroup, field: any) {
    const commentsGroup = this.fb.group({});

    // FIX: Added null safety for drivers
    if (field?.drivers) {
      field.drivers.forEach((driver: any) => {
        const validators = this.getValidators(field);
        commentsGroup.addControl(
          driver.driverId,
          this.fb.control('', validators)
        );
      });
    }

    stepForm.addControl(field.controlName, commentsGroup);
  }

  private getValidators(field: any) {
    const validators = [];

    if (field.validation) {
      if (field.validation.required) {
        validators.push(Validators.required);
      }
      if (field.validation.minLength) {
        validators.push(Validators.minLength(field.validation.minLength));
      }
      if (field.validation.maxLength) {
        validators.push(Validators.maxLength(field.validation.maxLength));
      }
      if (field.validation.min !== undefined) {
        validators.push(Validators.min(field.validation.min));
      }
      if (field.validation.max !== undefined) {
        validators.push(Validators.max(field.validation.max));
      }
    }

    return validators;
  }

  private patchFormData(data: any) {
    // Implement logic to patch form data based on initialData
    // This would map the data to the appropriate form controls
  }

  // Updated helper methods with minimal null safety additions
  getFormArray(form: FormGroup, controlName: string): FormArray | null {
    return (form?.get(controlName) as FormArray) || null;
  }

  getFormGroup(stepForm: FormGroup, controlName: string): FormGroup | null {
    return (stepForm?.get(controlName) as FormGroup) || null;
  }

  getCriteriaForm(
    form: FormGroup,
    fieldName: string,
    criteriaId: string
  ): FormGroup | null {
    const criteriaGroup = form?.get(fieldName) as FormGroup;
    return (criteriaGroup?.get(criteriaId) as FormGroup) || null;
  }

  getCriteriaControl(
    form: FormGroup,
    fieldName: string,
    criteriaId: string,
    controlName: string
  ): FormControl {
    const criteriaForm = this.getCriteriaForm(form, fieldName, criteriaId);
    const control = criteriaForm?.get(controlName);
    return (control as FormControl) || this.fb.control(false);
  }

  getCriteriaRows(
    form: FormGroup,
    fieldName: string,
    criteriaId: string
  ): FormArray | null {
    const criteriaForm = this.getCriteriaForm(form, fieldName, criteriaId);
    return (criteriaForm?.get('rows') as FormArray) || null;
  }

  getSelectedCriteria(form: FormGroup, fieldName: string): any[] {
    const criteriaGroup = form?.get(fieldName) as FormGroup;
    const selected: any[] = [];

    if (criteriaGroup) {
      Object.keys(criteriaGroup.controls).forEach((criteriaId) => {
        const criteriaForm = criteriaGroup.get(criteriaId) as FormGroup;
        if (criteriaForm?.get('isSelected')?.value) {
          selected.push({
            criteriaId,
            form: criteriaForm,
          });
        }
      });
    }

    return selected;
  }

  getSelectedSurveysCount(form: FormGroup, fieldName: string): number {
    const tableArray = this.getFormArray(form, fieldName);
    let count = 0;
    if (tableArray) {
      tableArray.controls.forEach((row: any) => {
        if (row.get('selected')?.value) {
          count++;
        }
      });
    }
    return count;
  }

  getCriteriaTotal(
    form: FormGroup,
    fieldName: string,
    criteriaId: string
  ): number {
    const rowsArray = this.getCriteriaRows(form, fieldName, criteriaId);
    let total = 0;
    if (rowsArray) {
      rowsArray.controls.forEach((row: any) => {
        total += +(row.get('percentage')?.value || 0);
      });
    }
    return total;
  }

  getImpactDriversTotal(form: FormGroup, fieldName: string): number {
    const driversGroup = form?.get(fieldName) as FormGroup;
    let total = 0;
    if (driversGroup) {
      Object.keys(driversGroup.controls).forEach((key) => {
        if (key !== 'overallScore' && key !== 'total') {
          total += +(driversGroup.get(key)?.value || 0);
        }
      });
    }
    return total;
  }

  getEnpsTotal(form: FormGroup, fieldName: string): number {
    const enpsGroup = form?.get(fieldName) as FormGroup;
    let total = 0;
    if (enpsGroup) {
      Object.keys(enpsGroup.controls).forEach((key) => {
        if (key !== 'total') {
          total += +(enpsGroup.get(key)?.value || 0);
        }
      });
    }
    return total;
  }

  // Criteria row management - kept exactly the same
  addCriteriaRow(
    form: FormGroup,
    fieldName: string,
    criteriaId: string,
    fieldTemplate: any
  ) {
    const rowsArray = this.getCriteriaRows(form, fieldName, criteriaId);
    if (rowsArray) {
      const newRow = this.fb.group({});

      fieldTemplate.controls.forEach((control: any) => {
        const controlValidators = this.getValidators(control);
        newRow.addControl(
          control.controlName,
          this.fb.control(
            control.controlType === 'number' ? 0 : '',
            controlValidators
          )
        );
      });

      rowsArray.push(newRow);
    }
  }

  deleteCriteriaRow(
    form: FormGroup,
    fieldName: string,
    criteriaId: string,
    index: number
  ) {
    const rowsArray = this.getCriteriaRows(form, fieldName, criteriaId);
    if (rowsArray && rowsArray.length > 1) {
      rowsArray.removeAt(index);
    }
  }
  getSelectedCriteriaItem(field: any, selected: any) {
  return field?.criteriaList?.find((c: any) => c.criteriaId === selected?.criteriaId);
}
  onCriteriaToggle(form: FormGroup, fieldName: string, criteria: any) {
    const criteriaForm = this.getCriteriaForm(
      form,
      fieldName,
      criteria.criteriaId
    );
    const isSelected = criteriaForm?.get('isSelected')?.value;

    if (!isSelected) {
      const rowsArray = this.getCriteriaRows(
        form,
        fieldName,
        criteria.criteriaId
      );
      if (rowsArray) {
        while (rowsArray.length > 1) {
          rowsArray.removeAt(rowsArray.length - 1);
        }
        if (rowsArray.length > 0) {
          const firstRow = rowsArray.at(0) as FormGroup;
          firstRow.get('percentage')?.setValue(0);
          const dropdownControl = Object.keys(firstRow.controls).find((key) =>
            key.includes('Option')
          );
          if (dropdownControl) {
            firstRow.get(dropdownControl)?.setValue('');
          }
        }
      }
    }
  }

  // Navigation - kept exactly the same
  nextStep() {
    if (this.selectedIndex < this.stepForms.length - 1) {
      this.selectedIndex++;
    }
  }

  prevStep() {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    }
  }

  submit() {
    console.log('Form submitted:', this.stepForms);

    // debugger;
    const currentData = this.stepForms.map((form) => form.value);

    // Get previously saved submissions
    const savedData = JSON.parse(localStorage.getItem('stepFormsData') || '[]');

    // Add current submission to the list
    savedData.push(currentData);

    // Save back to localStorage
    localStorage.setItem('stepFormsData', JSON.stringify(savedData));

    alert('Scenario created successfully!');
    this.router.navigate(['/scenarios']);
  }

  // Validation helper - kept exactly the same
  isFieldInvalid(form: FormGroup, controlName: string): boolean {
    const control = form?.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

rowsPerPage = 5;
currentPage = 1;

// Get total pages
getTotalPages(field: any): number {
  return Math.ceil((field.rows?.length || 0) / this.rowsPerPage);
}

// Get paginated rows
getPaginatedRows(field: any): any[] {
  const start = (this.currentPage - 1) * this.rowsPerPage;
  const end = start + this.rowsPerPage;
  return field.rows.slice(start, end);
}

// Correct form group index for reactive binding
getRowIndex(r: number): number {
  return (this.currentPage - 1) * this.rowsPerPage + r;
}

// Change page safely
changePage(page: number, field: any): void {
  const totalPages = this.getTotalPages(field);
  if (page >= 1 && page <= totalPages) {
    this.currentPage = page;
  }
}

  getFieldError(form: FormGroup, controlName: string): string {
    const control = form?.get(controlName);
    if (control && control.errors) {
      if (control.errors['required']) return 'This field is required';
      if (control.errors['minlength'])
        return `Minimum length is ${control.errors['minlength'].requiredLength}`;
      if (control.errors['maxlength'])
        return `Maximum length is ${control.errors['maxlength'].requiredLength}`;
      if (control.errors['min'])
        return `Minimum value is ${control.errors['min'].min}`;
      if (control.errors['max'])
        return `Maximum value is ${control.errors['max'].max}`;
    }
    return '';
  }

  hasDropdownFields(fields: any[]): boolean {
  return fields?.some(f => f.fieldType === 'dropdown');
}
cancel(){
this.router.navigate(['/scenarios']);
}
}
