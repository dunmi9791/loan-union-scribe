import apiService from "./lib/apiService";
import * as dataUtils from "./utils/dataUtils";

// Simple test function to verify REST API implementation
async function testRestAPI() {
  try {
    console.log("Testing REST API implementation...");
    
    // Test direct apiService calls
    console.log("\n--- Testing apiService ---");
    
    console.log("Fetching unions...");
    const unions = await apiService.unions.getAll();
    console.log(`Fetched ${unions.length} unions`);
    
    if (unions.length > 0) {
      const unionId = unions[0].id;
      console.log(`Fetching union with ID ${unionId}...`);
      const union = await apiService.unions.getById(unionId);
      console.log("Union details:", union);
      
      console.log(`Fetching members of union with ID ${unionId}...`);
      const unionMembers = await apiService.unions.getMembers(unionId);
      console.log(`Fetched ${unionMembers.length} members for union`);
      
      console.log(`Fetching collectors of union with ID ${unionId}...`);
      const unionCollectors = await apiService.unions.getCollectors(unionId);
      console.log(`Fetched ${unionCollectors.length} collectors for union`);
    }
    
    console.log("Fetching members...");
    const members = await apiService.members.getAll();
    console.log(`Fetched ${members.length} members`);
    
    if (members.length > 0) {
      const memberId = members[0].id;
      console.log(`Fetching member with ID ${memberId}...`);
      const member = await apiService.members.getById(memberId);
      console.log("Member details:", member);
      
      console.log(`Fetching loans for member with ID ${memberId}...`);
      const memberLoans = await apiService.members.getLoans(memberId);
      console.log(`Fetched ${memberLoans.length} loans for member`);
      
      console.log(`Fetching installments for member with ID ${memberId}...`);
      const memberInstallments = await apiService.members.getInstallments(memberId);
      console.log(`Fetched ${memberInstallments.length} installments for member`);
    }
    
    console.log("Fetching loans...");
    const loans = await apiService.loans.getAll();
    console.log(`Fetched ${loans.length} loans`);
    
    if (loans.length > 0) {
      const loanId = loans[0].id;
      console.log(`Fetching loan with ID ${loanId}...`);
      const loan = await apiService.loans.getById(loanId);
      console.log("Loan details:", loan);
      
      console.log(`Fetching installments for loan with ID ${loanId}...`);
      const loanInstallments = await apiService.loans.getInstallments(loanId);
      console.log(`Fetched ${loanInstallments.length} installments for loan`);
    }
    
    console.log("Fetching installments...");
    const installments = await apiService.installments.getAll();
    console.log(`Fetched ${installments.length} installments`);
    
    console.log("Fetching overdue installments...");
    const overdueInstallments = await apiService.installments.getOverdue();
    console.log(`Fetched ${overdueInstallments.length} overdue installments`);
    
    console.log("Fetching pending installments...");
    const pendingInstallments = await apiService.installments.getPending();
    console.log(`Fetched ${pendingInstallments.length} pending installments`);
    
    console.log("Fetching collectors...");
    const collectors = await apiService.collectors.getAll();
    console.log(`Fetched ${collectors.length} collectors`);
    
    if (collectors.length > 0) {
      const collectorId = collectors[0].id;
      console.log(`Fetching collector with ID ${collectorId}...`);
      const collector = await apiService.collectors.getById(collectorId);
      console.log("Collector details:", collector);
      
      console.log(`Fetching installments for collector with ID ${collectorId}...`);
      const collectorInstallments = await apiService.collectors.getInstallments(collectorId);
      console.log(`Fetched ${collectorInstallments.length} installments for collector`);
    }
    
    console.log("Fetching collection summary...");
    const summary = await apiService.summary.getCollectionSummary();
    console.log("Collection summary:", summary);
    
    // Test dataUtils functions
    console.log("\n--- Testing dataUtils with new API ---");
    
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
      
      console.log(`Getting installments for member with ID ${memberId}...`);
      const memberInstallments = await dataUtils.getMemberInstallments(memberId);
      console.log(`Got ${memberInstallments.length} installments for member`);
    }
    
    console.log("Getting all loans...");
    const allLoans = await dataUtils.getAllLoans();
    console.log(`Got ${allLoans.length} loans`);
    
    console.log("Getting all installments...");
    const allInstallments = await dataUtils.getAllInstallments();
    console.log(`Got ${allInstallments.length} installments`);
    
    console.log("Getting overdue installments...");
    const overdueInst = await dataUtils.getOverdueInstallments();
    console.log(`Got ${overdueInst.length} overdue installments`);
    
    console.log("Getting pending installments...");
    const pendingInst = await dataUtils.getPendingInstallments();
    console.log(`Got ${pendingInst.length} pending installments`);
    
    console.log("Getting collection summary...");
    const collectionSummary = await dataUtils.getCollectionSummary();
    console.log("Collection summary:", collectionSummary);
    
    console.log("\nREST API testing completed successfully!");
  } catch (error) {
    console.error("Error testing REST API:", error);
  }
}

// Run the test
testRestAPI();