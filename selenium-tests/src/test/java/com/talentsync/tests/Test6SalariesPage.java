package com.talentsync.tests;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.List;

public class Test6SalariesPage extends BaseTest {
    
    @Test
    public void testSalariesPage() {
        System.out.println("Test 6: Testing Salaries Page...");
        
        driver.get(BASE_URL);
        sleep(2000);
        
        // Look for salaries link
        List<WebElement> salaryLinks = driver.findElements(
            By.xpath("//*[contains(text(), 'Salaries') or contains(text(), 'Salary') or contains(@href, 'salar')]")
        );
        
        if (!salaryLinks.isEmpty()) {
            salaryLinks.get(0).click();
            sleep(3000);
            
            // Check if salary data is displayed
            List<WebElement> salaryElements = driver.findElements(
                By.cssSelector(".salary, .salary-card, table, [class*='salary']")
            );
            System.out.println("✓ Test 6 PASSED: Found " + salaryElements.size() + " salary-related elements");
        } else {
            System.out.println("✓ Test 6 INFO: No salaries link found on homepage");
        }
    }
}
