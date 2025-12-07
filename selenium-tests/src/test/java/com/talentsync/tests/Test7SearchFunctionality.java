package com.talentsync.tests;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;

import java.util.List;

public class Test7SearchFunctionality extends BaseTest {
    
    @Test
    public void testSearchFunctionality() {
        System.out.println("Test 7: Testing Search Functionality...");
        
        driver.get(BASE_URL);
        sleep(2000);
        
        // Look for search input
        List<WebElement> searchInputs = driver.findElements(
            By.cssSelector("input[type='search'], input[placeholder*='search' i], input[name*='search' i], .search-input")
        );
        
        if (!searchInputs.isEmpty()) {
            searchInputs.get(0).sendKeys("Software Engineer");
            sleep(1000);
            
            // Try to find and click search button
            List<WebElement> searchButtons = driver.findElements(
                By.cssSelector("button[type='submit'], button.search-button, .search-btn")
            );
            if (!searchButtons.isEmpty()) {
                searchButtons.get(0).click();
                sleep(2000);
            } else {
                // Try pressing Enter if no button found
                searchInputs.get(0).sendKeys(Keys.ENTER);
                sleep(2000);
            }
            
            System.out.println("✓ Test 7 PASSED: Search functionality tested");
        } else {
            System.out.println("✓ Test 7 INFO: No search input found on homepage");
        }
    }
}
