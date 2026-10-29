## [Bellevue University](http://bellevue.edu "Bellevue University is a private, non-profit university located in Bellevue, Nebraska, United States.")

Address: 1000 Galvin Rd S, Bellevue, Nebraska 68005 - [Directions](https://www.google.com/maps/dir/''/Bellevue+University/@41.1509562,-95.9896355,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x8793886a86ca807f:0x838e857240d175eb!2m2!1d-95.9195956!2d41.1509774 "Google maps")

Web Development [Degree](http://www.bellevue.edu/degrees/bachelor/web-development-bs/ "Designed by developers for developers.")

# WEB 450 Mastering the MEAN Stack Bootcamp

### Course Description

This course is an immersive web development bootcamp. It is a full stack experience using the skills previously developed in languages, APIs, and frameworks. This course pulls it all together in a more difficult and highly demanding environment. Topics include UI considerations, web services, server-side scripting, and database development and use. Security and unit testing are also covered. GitHub is used to host coding projects. The course is synchronous with all students participating two nights a week for 9 consecutive weeks.

### Course Prerequisites

WEB 200, WEB 231, WEB 330, WEB 340, WEB 420, and WEB 425

### Course Objectives

Students who successfully complete this course should be able to:

- Examine the components of full stack web applications
- Defend the ue of source control environments
- Evaluate strategies for team collaboration
- Justify design choices for web projects
- Test for vulnerabilities in web applications
- Build a full stack web application

### Topic Outline

<ol type="I">
  <li>
    Full Stack Development Fundamentals
      <ol type="A">
        <li>MEAN Stack Overview</li>
        <li>Development Environment Setup</li>
        <li>Source Control with GitHub</li>
        <li>Security Best Practices</li>
      </ol>
  </li>
  <li>
    Web Application Development
    <ol type="A">
      <li>Frontend and Backend Integration</li>
      <li>API Development</li>
      <li>User Interface Design</li>
      <li>Database Management</li>
    </ol>
  </li>
  <li>
    Collaboration and Testing
    <ol type="A">
      <li>Team Collaboration Strategies</li>
      <li>Code Review Practices</li>
      <li>Pair Programming</li>
      <li>Unit Testing</li>
      <li>Deployment</li>
    </ol>
  </li>
</ol>

## Repository Overview

The courses repository consist of two directories: data-files and examples. The data-files directory contains starter projects for the course's textbook and group projects. The examples directory contains example projects that will be covered during class.

```bash
git clone https://github.com/buwebdev/web-450.git
cd web-450
```

# WEB-450 APRE Capstone Project - Assignment 2.3 (Task M-065)

## Student

- **Name:** Jennifer (Jennie) Snyder
- **Course:** WEB-450 Full-Stack Web Development (Bellevue University)

## Sprint 1 Major Task: M-065 (Sales by Product)

- **Backend API:** Implemented `GET /api/reports/sales/products` in `apre-server` using MongoDB aggregation to group sales data by product and sort alphabetically.
- **Backend Unit Tests:** Added 3 unit tests in `apre-server/test/routes/reports/sales/index.spec.js`.
- **Frontend Component:** Created `SalesByProductComponent` in `apre-client` using standalone components, `TableComponent`, and HttpClient.
- **Frontend Unit Tests:** Added 3 unit tests in `apre-client/src/app/reports/sales/sales-by-product/sales-by-product.component.spec.ts`.

## Setup & Running Instructions

1. **Start the Server:**
   ```powershell
   cd data-files/apre/apre-server
   npm install
   npm start
   ```
