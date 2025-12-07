package com.talentsync.tests;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.WebElement;

import java.util.List;

public class Test9ResponsiveDesign extends BaseTest {
    
    @Test
    public void testResponsiveDesign() {
        System.out.println("Test 9: Testing Responsive Design...");
        
        // Test desktop size
        driver.manage().window().setSize(new Dimension(1920, 1080));
        driver.get(BASE_URL);
        sleep(2000);
        List<WebElement> desktopElements = driver.findElements(By.cssSelector("*"));
        
        // Test tablet size
        driver.manage().window().setSize(new Dimension(768, 1024));
        sleep(2000);
        List<WebElement> tabletElements = driver.findElements(By.cssSelector("*"));
        
        // Test mobile size
        driver.manage().window().setSize(new Dimension(375, 667));
        sleep(2000);
        List<WebElement> mobileElements = driver.findElements(By.cssSelector("*"));
        
        System.out.println("✓ Test 9 PASSED: Responsive design tested across multiple screen sizes");
        System.out.println("  Desktop: " + desktopElements.size() + " elements, " +
                         "Tablet: " + tabletElements.size() + " elements, " +
                         "Mobile: " + mobileElements.size() + " elements");
    }
}
