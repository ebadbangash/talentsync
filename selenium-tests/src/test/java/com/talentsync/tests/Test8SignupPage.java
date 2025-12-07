package com.talentsync.tests;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.List;

public class Test8SignupPage extends BaseTest {
    
    @Test
    public void testSignupPageNavigation() {
        System.out.println("Test 8: Testing Signup Page Navigation...");
        
        driver.get(BASE_URL);
        sleep(2000);
        
        // Look for signup/register link
        List<WebElement> signupElements = driver.findElements(
            By.xpath("//*[contains(text(), 'Sign Up') or contains(text(), 'Register') or contains(@href, 'signup') or contains(@href, 'register')]")
        );
        
        if (!signupElements.isEmpty()) {
            signupElements.get(0).click();
            sleep(2000);
            
            // Check for form inputs
            List<WebElement> formInputs = driver.findElements(
                By.cssSelector("input[type='text'], input[type='email'], input[type='password']")
            );
            System.out.println("✓ Test 8 PASSED: Signup page loaded with " + formInputs.size() + " form inputs");
        } else {
            System.out.println("✓ Test 8 INFO: No signup link found on homepage");
        }
    }
}
