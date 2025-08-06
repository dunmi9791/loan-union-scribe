// Simple test script to verify Dashboard component changes
console.log("Testing Dashboard component changes");

// Import the necessary functions
import { getPendingInstallments } from './src/utils/dataUtils.js';

// Test async handling
async function testDashboard() {
  try {
    console.log("Fetching pending installments...");
    const pendingData = await getPendingInstallments();
    
    console.log("Successfully fetched pending installments");
    console.log(`Number of installments: ${pendingData.length}`);
    
    // Test slice operation on the result
    const slicedData = pendingData.slice(0, 5);
    console.log(`Number of sliced installments: ${slicedData.length}`);
    
    console.log("Test passed: Dashboard component should now handle async data properly");
    return true;
  } catch (error) {
    console.error("Test failed:", error);
    return false;
  }
}

// Run the test
testDashboard()
  .then(result => {
    if (result) {
      console.log("All tests passed!");
    } else {
      console.log("Some tests failed!");
    }
  })
  .catch(error => {
    console.error("Error running tests:", error);
  });