package com.talentsync.tests;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

public class Test2NavigationLinks extends BaseTest {
    
    @Test
    public void testNavigationLinksPresent() {
        System.out.println("Test 2: Testing Navigation Links...");
        
        driver.get(BASE_URL);
        sleep(2000);
        
        // Check for navigation elements
        List<WebElement> navLinks = driver.findElements(By.cssSelector("nav a, header a, .nav-link"));
        
        assertTrue(navLinks.size() > 0, "Should have at least one navigation link");
        System.out.println("✓ Test 2 PASSED: Found " + navLinks.size() + " navigation links");
    }
}
