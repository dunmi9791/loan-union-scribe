import odooService from "./lib/odooService";
import * as dataUtils from "./utils/dataUtils";

// Simple test function to verify API implementation
async function testAPI() {
  try {
    console.log("Testing API implementation...");
    
    // Test direct odooService calls
    console.log("\n--- Testing odooService ---");
    
    console.log("Fetching unions...");
    const unions = await odooService.fetchUnions();
    console.log(`Fetched ${unions.length} unions`);
    
    if (unions.length > 0) {
      const unionId = unions[0].id;
      console.log(`Fetching union with ID ${unionId}...`);
      const union = await odooService.fetchUnionById(unionId);
      console.log("Union details:", union);
    }
    
    console.log("Fetching members...");
    const members = await odooService.fetchMembers();
    console.log(`Fetched ${members.length} members`);
    
    console.log("Fetching loans...");
    const loans = await odooService.fetchLoans();
    console.log(`Fetched ${loans.length} loans`);
    
    console.log("Fetching installments...");
    const installments = await odooService.fetchInstallments();
    console.log(`Fetched ${installments.length} installments`);
    
    console.log("Fetching collectors...");
    const collectors = await odooService.fetchCollectors();
    console.log(`Fetched ${collectors.length} collectors`);
    
    console.log("Fetching collection summary...");
    const summary = await odooService.fetchCollectionSummary();
    console.log("Collection summary:", summary);
    
    // Test dataUtils functions
    console.log("\n--- Testing dataUtils ---");
    
    console.log("Getting all unions...");
    const allUnions = await dataUtils.getAllUnions();
    console.log(`Got ${allUnions.length} unions`);
    
    console.log("Getting all members...");
    const allMembers = await dataUtils.getAllMembers();
    console.log(`Got ${allMembers.length} members`);
    
    if (allMembers.length > 0) {
      const memberId = allMembers[0].id;
      console.log(`Getting member with ID ${memberId}...`);
      const member = await dataUtils.getMemberById(memberId);
      console.log("Member details:", member);
      
      console.log(`Getting loans for member with ID ${memberId}...`);
      const memberLoans = await dataUtils.getMemberLoans(memberId);
      console.log(`Got ${memberLoans.length} loans for member`);
    }
    
    console.log("Getting all loans...");
    const allLoans = await dataUtils.getAllLoans();
    console.log(`Got ${allLoans.length} loans`);
    
    console.log("Getting all installments...");
    const allInstallments = await dataUtils.getAllInstallments();
    console.log(`Got ${allInstallments.length} installments`);
    
    console.log("Getting collection summary...");
    const collectionSummary = await dataUtils.getCollectionSummary();
    console.log("Collection summary:", collectionSummary);
    
    console.log("\nAPI testing completed successfully!");
  } catch (error) {
    console.error("Error testing API:", error);
  }
}

// Run the test
testAPI();