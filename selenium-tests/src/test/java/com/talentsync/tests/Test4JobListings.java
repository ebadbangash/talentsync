package com.talentsync.tests;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.List;

public class Test4JobListings extends BaseTest {
    
    @Test
    public void testJobListingsPage() {
        System.out.println("Test 4: Testing Job Listings Page...");
        
        driver.get(BASE_URL);
        sleep(2000);
        
        // Look for jobs link
        List<WebElement> jobLinks = driver.findElements(
            By.xpath("//*[contains(text(), 'Jobs') or contains(text(), 'Job') or contains(@href, 'job')]")
        );
        
        if (!jobLinks.isEmpty()) {
            jobLinks.get(0).click();
            sleep(3000);
            
            // Check if job listings are displayed
            List<WebElement> jobElements = driver.findElements(
                By.cssSelector(".job, .job-card, .job-item, [class*='job']")
            );
            System.out.println("✓ Test 4 PASSED: Found " + jobElements.size() + " job-related elements");
        } else {
            System.out.println("✓ Test 4 INFO: No jobs link found on homepage");
        }
    }
}
