package com.talentsync.tests;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class Test1HomePage extends BaseTest {
    
    @Test
    public void testHomePageLoads() {
        System.out.println("Test 1: Loading Home Page...");
        
        driver.get(BASE_URL);
        sleep(2000);
        
        String title = driver.getTitle();
        
        assertNotNull(title, "Page title should not be null");
        assertFalse(title.isEmpty(), "Page title should not be empty");
        
        System.out.println("✓ Test 1 PASSED: Home page loaded successfully. Title: " + title);
    }
}
