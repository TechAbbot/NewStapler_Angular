import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { DynamicStepperComponent } from './stepper/components/dynamic-stepper/dynamic-stepper.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DynamicStepperComponent, RouterOutlet, CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div *ngIf="isStepperPage()">
        <div class="p-4 fixed top-0 right-0 left-0 bg-white">
          <button 
            (click)="goBack()"
            class="flex items-center text-blue-600 hover:text-blue-800 font-medium mb-4 transition-colors duration-200"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Scenarios
          </button>
          <h1 class="text-2xl font-bold text-gray-900">{{ formJson.formName }}</h1>
        </div>
        <app-dynamic-stepper [formConfig]="formJson"></app-dynamic-stepper>
        
      </div>
      <router-outlet>
      </router-outlet>
    </div>
  `,
})
export class AppComponent { 
  formJson = {
    formName: 'HR Admin - Survey Distribution',
    stepsDetails: [
      {
        stepId: '1',
        label: 'Select Surveys',
        showSkipButton: false,
        showBackButton: true,
        fields: [
          {
            fieldId: 'title',
            fieldType: 'text',
            controlName: 'titleCtl',
            label: 'Title',
            placeholder: 'Enter title',
            isRequired: true,
            value: 'Scenario A',
            validation: {
              required: true,
              minLength: 2,
              maxLength: 50
            }
          },
          {
            fieldId: 'tenant',
            fieldType: 'dropdown',
            controlName: 'tenantCtl',
            label: 'Select Tenant',
            isRequired: true,
            options: [
              { key: 'Tenant A', value: 'tenantA' },
              { key: 'Tenant B', value: 'tenantB' },
              { key: 'Tenant C', value: 'tenantC' },
            ],
            value: 'tenantA',
            validation: {
              required: true
            }
          },
          {
            fieldId: 'company',
            fieldType: 'dropdown',
            controlName: 'companyCtl',
            label: 'Select Company',
            isRequired: true,
            options: [
              { key: 'Company A', value: 'companyA' },
              { key: 'Company B', value: 'companyB' },
              { key: 'Company C', value: 'companyC' },
            ],
            value: 'companyA',
            validation: {
              required: true
            }
          },
          {
            fieldId: 'company',
            fieldType: 'dropdown',
            controlName: 'companyCtl',
            label: 'Select Employee Exeperiance Product',
            isRequired: true,
            options: [
              { key: 'Company A', value: 'companyA' },
              { key: 'Company B', value: 'companyB' },
              { key: 'Company C', value: 'companyC' },
            ],
            value: 'companyA',
            validation: {
              required: true
            }
          },
          {
            fieldId: 'surveysTable',
            fieldType: 'surveyTable',
            controlName: 'surveysCtl',
            label: 'SURVEYS LIST',
            columns: [
              { columnId: 'selected', label: '', type: 'checkbox' },
              { columnId: 'name', label: 'NAME' },
              { columnId: 'creationDate', label: 'CREATION DATE' },
              { columnId: 'startDate', label: 'START DATE' },
              { columnId: 'endDate', label: 'END DATE' }
            ],
            rows: [
              { 
                name: 'Employee Engagement Survey', 
                creationDate: '15/01/2024', 
                startDate: '20/01/2024', 
                endDate: '20/02/2024',
                selected: false 
              },
              { 
                name: 'Customer Satisfaction Survey', 
                creationDate: '10/01/2024', 
                startDate: '15/01/2024', 
                endDate: '15/02/2024',
                selected: false 
              },
              { 
                name: 'Performance Review Survey', 
                creationDate: '05/01/2024', 
                startDate: '10/01/2024', 
                endDate: '25/01/2024',
                selected: false 
              },
              { 
                name: 'Performance Review Survey A', 
                creationDate: '05/01/2024', 
                startDate: '10/01/2024', 
                endDate: '25/01/2024',
                selected: false 
              },
              { 
                name: 'Performance Review Survey B', 
                creationDate: '05/01/2024', 
                startDate: '10/01/2024', 
                endDate: '25/01/2024',
                selected: false 
              },
              { 
                name: 'Performance Review Survey C', 
                creationDate: '05/01/2024', 
                startDate: '10/01/2024', 
                endDate: '25/01/2024',
                selected: false 
              },
              { 
                name: 'Training Effectiveness Survey', 
                creationDate: '01/01/2024', 
                startDate: '05/01/2024', 
                endDate: '20/01/2024',
                selected: false 
              }
            ],
            validation: {
              minSelected: 1,
              maxSelected: 10
            }
          },
        ],
      },
      {
        stepId: '2',
        label: 'Total Response',
        showSkipButton: false,
        showBackButton: true,
        fields: [
          {
            fieldId: 'totalResponse',
            fieldType: 'number',
            controlName: 'totalResponseCtl',
            label: 'Total Respondents',
            description: 'Define the total number of respondents for this scenario. This number determines the sample size for data collection and scoring distribution.',
            isRequired: true,
            value: 1000,
            validation: {
              required: true,
              min: 1,
              max: 10000
            }
          },
        ],
      },
      {
        stepId: '3',
        label: 'Select Criteria for Distribution',
        showSkipButton: false,
        showBackButton: true,
        fields: [
          {
            fieldId: 'criteriaSelection',
            fieldType: 'criteriaSelection',
            controlName: 'criteriaCtl',
            label: 'Select Criteria for Distribution',
            description: 'Choose the criteria that will be used for score distribution.',
            criteriaList: [
              {
                criteriaId: 'generation',
                label: 'Generation',
                isSelected: true,
                subForm: {
                  label: 'Generation Distribution',
                  addButtonLabel: '+ Add Generation',
                  totalField: { label: 'TOTAL DISTRIBUTION', maxTotal: 100 },
                  fields: [
                    {
                      rowId: 1,
                      controls: [
                        {
                          controlType: 'dropdown',
                          controlName: 'generationOption',
                          label: 'Option',
                          options: [
                            { key: 'Gen Z', value: 'genz' },
                            { key: 'Millennial', value: 'millennial' },
                            { key: 'Gen X', value: 'genx' },
                            { key: 'Baby Boomer', value: 'boomer' }
                          ],
                          value: 'genz',
                          validation: { required: true }
                        },
                        {
                          controlType: 'number',
                          controlName: 'percentage',
                          label: '%',
                          value: 30,
                          min: 0,
                          max: 100,
                          validation: { required: true, min: 0, max: 100 }
                        }
                      ]
                    },
                    {
                      rowId: 2,
                      controls: [
                        {
                          controlType: 'dropdown',
                          controlName: 'generationOption',
                          label: 'Option',
                          options: [
                            { key: 'Gen Z', value: 'genz' },
                            { key: 'Millennial', value: 'millennial' },
                            { key: 'Gen X', value: 'genx' },
                            { key: 'Baby Boomer', value: 'boomer' }
                          ],
                          value: 'millennial',
                          validation: { required: true }
                        },
                        {
                          controlType: 'number',
                          controlName: 'percentage',
                          label: '%',
                          value: 20,
                          min: 0,
                          max: 100,
                          validation: { required: true, min: 0, max: 100 }
                        }
                      ]
                    }
                  ]
                }
              },
              {
                criteriaId: 'ageGroup',
                label: 'Age Group',
                isSelected: true,
                subForm: {
                  label: 'Age Group Distribution',
                  addButtonLabel: '+ Add Age Group',
                  totalField: { label: 'TOTAL DISTRIBUTION', maxTotal: 100 },
                  fields: [
                    {
                      rowId: 1,
                      controls: [
                        {
                          controlType: 'dropdown',
                          controlName: 'ageOption',
                          label: 'Option',
                          options: [
                            { key: '18-25', value: '18-25' },
                            { key: '26-35', value: '26-35' },
                            { key: '36-45', value: '36-45' },
                            { key: '46-55', value: '46-55' },
                            { key: '55+', value: '55+' }
                          ],
                          value: '26-35',
                          validation: { required: true }
                        },
                        {
                          controlType: 'number',
                          controlName: 'percentage',
                          label: '%',
                          value: 50,
                          min: 0,
                          max: 100,
                          validation: { required: true, min: 0, max: 100 }
                        }
                      ]
                    }
                  ]
                }
              },
              {
                criteriaId: 'department',
                label: 'Department',
                isSelected: false,
                subForm: {
                  label: 'Department Distribution',
                  addButtonLabel: '+ Add Department',
                  totalField: { label: 'TOTAL DISTRIBUTION', maxTotal: 100 },
                  fields: [
                    {
                      rowId: 1,
                      controls: [
                        {
                          controlType: 'dropdown',
                          controlName: 'departmentOption',
                          label: 'Option',
                          options: [
                            { key: 'Engineering', value: 'engineering' },
                            { key: 'Marketing', value: 'marketing' },
                            { key: 'Sales', value: 'sales' },
                            { key: 'HR', value: 'hr' },
                            { key: 'Finance', value: 'finance' }
                          ],
                          value: '',
                          validation: { required: true }
                        },
                        {
                          controlType: 'number',
                          controlName: 'percentage',
                          label: '%',
                          value: 0,
                          min: 0,
                          max: 100,
                          validation: { required: true, min: 0, max: 100 }
                        }
                      ]
                    }
                  ]
                }
              },
              {
                criteriaId: 'gender',
                label: 'Gender',
                isSelected: false,
                subForm: {
                  label: 'Gender Distribution',
                  addButtonLabel: '+ Add Gender',
                  totalField: { label: 'TOTAL DISTRIBUTION', maxTotal: 100 },
                  fields: [
                    {
                      rowId: 1,
                      controls: [
                        {
                          controlType: 'dropdown',
                          controlName: 'genderOption',
                          label: 'Option',
                          options: [
                            { key: 'Male', value: 'male' },
                            { key: 'Female', value: 'female' },
                            { key: 'Other', value: 'other' }
                          ],
                          value: '',
                          validation: { required: true }
                        },
                        {
                          controlType: 'number',
                          controlName: 'percentage',
                          label: '%',
                          value: 0,
                          min: 0,
                          max: 100,
                          validation: { required: true, min: 0, max: 100 }
                        }
                      ]
                    }
                  ]
                }
              }
            ],
            validation: {
              minSelected: 1,
              maxTotal: 100
            }
          }
        ]
      },
      {
        stepId: '4',
        label: 'Impact Drivers',
        showSkipButton: false,
        showBackButton: true,
        fields: [
          {
            fieldId: 'impactDrivers',
            fieldType: 'impactDrivers',
            controlName: 'impactDriversCtl',
            label: 'Set the Impact Drivers',
            description: 'Distribute the weightage (in percentages) for different factors. The total should sum up to 100%.',
            drivers: [
              {
                driverId: 'innovation',
                label: 'INNOVATION',
                value: 88,
                validation: { required: true, min: 0, max: 100 }
              },
              {
                driverId: 'motivation',
                label: 'MOTIVATION',
                value: 67,
                validation: { required: true, min: 0, max: 100 }
              },
              {
                driverId: 'performance',
                label: 'PERFORMANCE',
                value: 35,
                validation: { required: true, min: 0, max: 100 }
              },
              {
                driverId: 'autonomy',
                label: 'AUTONOMY',
                value: 56,
                validation: { required: true, min: 0, max: 100 }
              },
              {
                driverId: 'connection',
                label: 'CONNECTION',
                value: 32,
                validation: { required: true, min: 0, max: 100 }
              },
              {
                driverId: 'transformationalLeadership',
                label: 'TRANSFORMATIONAL LEADERSHIP',
                value: 21,
                validation: { required: true, min: 0, max: 100 }
              }
            ],
            overallScore: 72,
            validation: {
              totalPercentage: 100
            }
          }
        ]
      },
      {
        stepId: '5',
        label: 'eNPS Settings',
        showSkipButton: false,
        showBackButton: true,
        fields: [
          {
            fieldId: 'enpsSettings',
            fieldType: 'enpsSettings',
            controlName: 'enpsSettingsCtl',
            label: 'Configure eNPS Settings',
            categories: [
              {
                categoryId: 'promoters',
                label: 'Promoters',
                value: 10,
                color: 'bg-green-500',
                validation: { required: true, min: 0, max: 100 }
              },
              {
                categoryId: 'passives',
                label: 'Passives',
                value: 15,
                color: 'bg-yellow-500',
                validation: { required: true, min: 0, max: 100 }
              },
              {
                categoryId: 'detractors',
                label: 'Detractors',
                value: 75,
                color: 'bg-red-500',
                validation: { required: true, min: 0, max: 100 }
              }
            ],
            total: 100,
            validation: {
              totalPercentage: 100
            }
          }
        ]
      },
      {
        stepId: '6',
        label: 'Comments',
        showSkipButton: false,
        showBackButton: true,
        fields: [
          {
            fieldId: 'comments',
            fieldType: 'comments',
            controlName: 'commentsCtl',
            label: 'Comments',
            description: 'Provide insights or justifications for each selected driver',
            drivers: [
              { driverId: 'innovation', label: 'Innovation' },
              { driverId: 'motivation', label: 'Motivation' },
              { driverId: 'performance', label: 'Performance' },
              { driverId: 'autonomy', label: 'Autonomy' },
              { driverId: 'connection', label: 'Connection' }
            ],
            placeholder: 'Enter your comments here...',
            validation: {
              required: false,
              maxLength: 1000
            }
          }
        ]
      }
    ]
  };

  constructor(private router: Router) {}

  isStepperPage(): boolean {
    return this.router.url.includes('create-scenario') || this.router.url.includes('edit-scenario');
  }

  goBack() {
    this.router.navigate(['/scenarios']);
  }
}