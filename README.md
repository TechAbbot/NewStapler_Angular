# Dynamic Stepper Application

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 15.  
It demonstrates a **Dynamic, Configurable Stepper Component** built with **Angular CDK Stepper** and **Tailwind CSS** for a SaaS-based survey management workflow.

The stepper supports full-screen UI, dynamic content rendering, step-based validation, and configurable behavior through a static JSON configuration that is applied dynamically.

---

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`.  
The application will automatically reload whenever you modify any of the source files.

---

## Project Overview

This application implements a **full-screen stepper** that dynamically loads steps and fields from a JSON configuration file.  
Each step in the form is rendered dynamically, validated using Angular’s Reactive Forms, and styled with Tailwind CSS.

Key modules used:
- **Angular CDK Stepper** – For step navigation and accessibility.
- **Reactive Forms** – For managing dynamic form data and validation.
- **Tailwind CSS** – For responsive and modern UI styling.

---

## Features

- **Dynamic Step Rendering**: Steps and fields are defined in a JSON file and loaded dynamically at runtime.  
- **Validation**: Each step supports Angular validators (required, minLength, pattern) and custom validators.  
- **Navigation Control**: Next and Previous buttons are automatically enabled or disabled based on form validity.  
- **Configurable UI**: Step titles, field types, and navigation behavior are fully configurable.  
- **Reusable Component**: The stepper is modular and can be reused across multiple workflows.  
- **Comments Layout**: Special split-screen layout for comments—labels appear on the left, and corresponding text areas appear on the right when selected.

---

## JSON Configuration Example

```json
{
  "stepsDetails": [
    {
      "title": "Basic Information",
      "fields": [
        { "type": "text", "label": "Name", "required": true },
        { "type": "email", "label": "Email", "required": true }
      ]
    },
    {
      "title": "Survey Questions",
      "fields": [
        { "type": "textarea", "label": "Feedback", "required": true },
        { "type": "radio", "label": "Satisfaction", "options": ["Good", "Average", "Poor"] }
      ]
    },
    {
      "title": "Comments",
      "fields": [
        {
          "type": "comments",
          "label": "Driver Comments",
          "drivers": [
            { "driverId": "innovation", "label": "Innovation" },
            { "driverId": "teamwork", "label": "Teamwork" }
          ]
        }
      ]
    }
  ]
}
```

---

## Building

To build the project, run:

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

---

## Running unit tests

To execute unit tests via [Karma](https://karma-runner.github.io), run:

```bash
ng test
```

---

## Running end-to-end tests

To execute end-to-end (E2E) tests, run:

```bash
ng e2e
```

Angular CLI does not include a default E2E testing framework. You can configure one (such as Cypress or Playwright) as needed.

---

## Design Choices

- **Dynamic JSON-driven rendering** allows reusability across workflows.  
- **Reactive Forms** provide form control and validation per step.  
- **Factory and Strategy design patterns** simplify dynamic field creation.  
- **Tailwind CSS** ensures a clean and maintainable UI design.  
- **Angular CDK Stepper** provides accessibility and navigation handling.

---

## Output Example

When submitted, the form emits the following JSON structure:

```json
{
  "basicInformation": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "surveyQuestions": {
    "feedback": "Great experience!",
    "satisfaction": "Good"
  },
  "comments": {
    "innovation": "Excellent creativity",
    "teamwork": "Strong collaboration"
  }
}
```

---

## License

This project is developed as part of a Frontend Technical Assessment for a SaaS application.  
You are free to use and modify this code for learning and demonstration purposes.
