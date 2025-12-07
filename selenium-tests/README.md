# TalentSync Selenium Test Suite (Java)

Automated headless Selenium tests for the TalentSync application written in Java.

## Test Cases

1. **Test1HomePage.java** - Verifies home page loads successfully
2. **Test2NavigationLinks.java** - Tests navigation links presence
3. **Test3LoginPage.java** - Tests login page navigation
4. **Test4JobListings.java** - Verifies job listings page functionality
5. **Test5CompaniesPage.java** - Tests companies page display
6. **Test6SalariesPage.java** - Verifies salaries page functionality
7. **Test7SearchFunctionality.java** - Tests search feature
8. **Test8SignupPage.java** - Tests signup/registration page
9. **Test9ResponsiveDesign.java** - Tests responsive design across screen sizes
10. **Test10FormValidation.java** - Tests form validation messages

## Prerequisites

- Java 11 or higher
- Maven 3.6 or higher

## Installation

```bash
mvn clean install
```

## Running Tests

Run all tests using TestRunner:
```bash
mvn exec:java -Dexec.mainClass="com.talentsync.tests.TestRunner"
```

Run individual test:
```bash
mvn exec:java -Dexec.mainClass="com.talentsync.tests.Test1HomePage"
```

Or compile and run directly:
```bash
mvn clean compile
java -cp target/classes;%HOMEPATH%\.m2\repository\org\seleniumhq\selenium\selenium-java\4.15.0\* com.talentsync.tests.TestRunner
```

## Configuration

All tests run in headless Chrome mode with the following options:
- `--headless` - No browser UI
- `--disable-gpu` - Disable GPU acceleration
- `--no-sandbox` - Bypass OS security model
- `--disable-dev-shm-usage` - Overcome limited resource problems
- `--window-size=1920,1080` - Default window size

WebDriverManager automatically downloads and manages ChromeDriver.

## Project Structure

```
selenium-tests/
├── pom.xml
├── src/
│   └── main/
│       └── java/
│           └── com/
│               └── talentsync/
│                   └── tests/
│                       ├── BaseTest.java
│                       ├── TestRunner.java
│                       ├── Test1HomePage.java
│                       ├── Test2NavigationLinks.java
│                       ├── Test3LoginPage.java
│                       ├── Test4JobListings.java
│                       ├── Test5CompaniesPage.java
│                       ├── Test6SalariesPage.java
│                       ├── Test7SearchFunctionality.java
│                       ├── Test8SignupPage.java
│                       ├── Test9ResponsiveDesign.java
│                       └── Test10FormValidation.java
└── README.md
```

## Test Target

Tests run against: `http://ec2-98-92-69-131.compute-1.amazonaws.com:3000`
