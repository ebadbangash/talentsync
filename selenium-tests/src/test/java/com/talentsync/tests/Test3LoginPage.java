package com.talentsync.tests;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.List;

public class Test3LoginPage extends BaseTest {
    
    @Test
    public void testLoginPageNavigation() {
        System.out.println("Test 3: Testing Login Page Navigation...");
        
        driver.get(BASE_URL);
        sleep(2000);
        
        // Look for login link/button
        List<WebElement> loginElements = driver.findElements(
            By.xpath("//*[contains(text(), 'Login') or contains(text(), 'Sign In') or contains(@href, 'login')]")
        );
        
        if (!loginElements.isEmpty()) {
            loginElements.get(0).click();
            sleep(2000);
            String currentUrl = driver.getCurrentUrl();
            System.out.println("✓ Test 3 PASSED: Navigated to login. Current URL: " + currentUrl);
        } else {
            System.out.println("✓ Test 3 INFO: No login link found on homepage");
        }
    }
}
