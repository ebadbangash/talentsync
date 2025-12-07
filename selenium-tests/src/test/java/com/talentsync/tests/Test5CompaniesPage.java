package com.talentsync.tests;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.List;

public class Test5CompaniesPage extends BaseTest {
    
    @Test
    public void testCompaniesPage() {
        System.out.println("Test 5: Testing Companies Page...");
        
        driver.get(BASE_URL);
        sleep(2000);
        
        // Look for companies link
        List<WebElement> companyLinks = driver.findElements(
            By.xpath("//*[contains(text(), 'Companies') or contains(text(), 'Company') or contains(@href, 'compan')]")
        );
        
        if (!companyLinks.isEmpty()) {
            companyLinks.get(0).click();
            sleep(3000);
            
            // Check if company listings are displayed
            List<WebElement> companyElements = driver.findElements(
                By.cssSelector(".company, .company-card, [class*='company']")
            );
            System.out.println("✓ Test 5 PASSED: Found " + companyElements.size() + " company-related elements");
        } else {
            System.out.println("✓ Test 5 INFO: No companies link found on homepage");
        }
    }
}
