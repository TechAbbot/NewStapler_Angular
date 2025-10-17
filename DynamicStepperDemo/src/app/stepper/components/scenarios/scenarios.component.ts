import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-scenarios',
  standalone: true,
  imports: [CommonModule,
    FormsModule
  ],
  template: `
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
    />
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
      body {
        font-family: 'Inter', sans-serif;
      }
    </style>
    <div class="container mx-auto px-4 py-6">
      <!-- Header Section -->
      <div class="p-4 border-b border-gray-200 stepper-container bg-white">
        <div class="flex items-center flex items-center fixed top-0 py-2">
          <!-- Dummy Logo -->
          <div
            class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3"
          >
            <span class="text-white font-bold text-lg">Z</span>
          </div>
          <h1 class="text-3xl font-bold text-gray-900">Semulation</h1>
        </div>
      </div>

      <!-- Search and Scenarios Section -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-4">
          <!-- Left side: Heading -->
          <h2 class="text-xl font-semibold text-gray-800">Scenarios</h2>

          <!-- Right side: Button -->
          <button
            (click)="addNewScenario()"
            class="bg-blue-500 rounded-lg border border-gray-300 hover:border-blue-500 transition-all 
            duration-300 cursor-pointer flex items-center justify-center px-6 py-3 mt-2"
          >
            <i class="fas fa-plus text-white mr-2"></i>
            <span class="text-white font-medium">New Scenario</span>
          </button>
        </div>
        <!-- Search Bar -->
        <div class="flex items-center w-full max-w-3xl mb-6 gap-4">
          <!-- Search Input -->
          <div class="relative flex-1">
            <input
              type="text"
              placeholder="Type to search..."
              [(ngModel)]="searchTerm"
              (input)="filterScenarios()"
              class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div class="absolute right-3 top-2.5">
              <i class="fas fa-search text-gray-400"></i>
            </div>
          </div>
        </div>

        <!-- Scenarios Table -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="overflow-x-auto">
            <div
              class="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              <!-- Header -->
              <div
                class="grid grid-cols-4 gap-4 px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <div>Scenario Name</div>
                <div>Number of Respondents</div>
                <div>Score Range</div>
                <div class="text-right">Actions</div>
              </div>

              <!-- Dynamic Rows -->
              <div
                *ngFor="let scenario of filteredScenarios"
                class="grid grid-cols-4 gap-4 px-6 py-4 border-t border-gray-200 items-center hover:bg-gray-50 transition-colors duration-200"
              >
                <div class="text-sm font-medium text-gray-900">
                  {{ scenario.name }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ scenario.respondents }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ scenario.scoreRange }}
                </div>
                <div class="text-right">
                  <i class="fas fa-ellipsis-v text-gray-400 cursor-pointer"></i>
                  <!-- Optional: Add edit/delete buttons -->
                  <!--
        <button (click)="editScenario(scenario)" class="text-blue-600 hover:text-blue-800 ml-2 text-sm">Edit</button>
        <button (click)="deleteScenario(scenario)" class="text-red-600 hover:text-red-800 ml-2 text-sm">Delete</button>
        -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ScenariosComponent {
  scenarios = [];
  filteredScenarios = [...this.scenarios];
  searchTerm = '';

  constructor(private router: Router) {
    // Convert each saved object back to a FormGroup
    const allSubmissions = JSON.parse(
      localStorage.getItem('stepFormsData') || '[]'
    );
    console.log(allSubmissions);
    this.scenarios = allSubmissions.map((formArray: any[], index: number) => {
      const form = formArray[0]; // Assuming one form per submission
      const totalresponse = formArray[1];
      const enpsSettings = formArray[4];
      return {
        id: index + 1, // Assign a unique id
        name: form.titleCtl || `Scenario ${index + 1}`,
        respondents: totalresponse.totalResponseCtl || 0,
        scoreRange: enpsSettings.enpsSettingsCtl.total || '0-100',
        // status: form.status || 'Draft',
        createdDate: form.createdDate || new Date().toISOString().split('T')[0],
      };
    });
    this.filteredScenarios = this.scenarios;

  }

  filterScenarios() {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredScenarios = this.scenarios.filter((scenario) =>
      Object.values(scenario).some((value) =>
        value.toString().toLowerCase().includes(term)
      )
    );
  }

  addNewScenario() {
    // Navigate to the dynamic stepper with empty form
    this.router.navigate(['/create-scenario']);
  }

  editScenario(scenario: any) {
    // Navigate to edit scenario with pre-filled data
    this.router.navigate(['/edit-scenario', scenario.id]);
  }

  deleteScenario(scenario: any) {
    if (confirm(`Are you sure you want to delete "${scenario.name}"?`)) {
      this.scenarios = this.scenarios.filter((s) => s.id !== scenario.id);
    }
  }
}
