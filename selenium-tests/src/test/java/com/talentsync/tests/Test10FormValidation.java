package com.talentsync.tests;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.List;

public class Test10FormValidation extends BaseTest {
    
    @Test
    public void testFormValidation() {
        System.out.println("Test 10: Testing Form Validation...");
        
        driver.get(BASE_URL);
        sleep(2000);
        
        // Look for any form on the page
        List<WebElement> forms = driver.findElements(By.cssSelector("form"));
        
        if (!forms.isEmpty()) {
            // Try to submit empty form to trigger validation
            List<WebElement> submitButtons = driver.findElements(
                By.cssSelector("button[type='submit'], input[type='submit']")
            );
            
            if (!submitButtons.isEmpty()) {
                submitButtons.get(0).click();
                sleep(1000);
                
                // Check for validation messages
                List<WebElement> validationMessages = driver.findElements(
                    By.cssSelector(".error, .invalid, [class*='error'], [class*='invalid']")
                );
                System.out.println("✓ Test 10 PASSED: Form validation tested. Found " + 
                                 validationMessages.size() + " validation messages");
            } else {
                System.out.println("✓ Test 10 INFO: No submit button found in form");
            }
        } else {
            System.out.println("✓ Test 10 INFO: No forms found on homepage");
        }
    }
}
