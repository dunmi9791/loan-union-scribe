# API Migration Documentation

## Overview

This document describes the migration from the previous RPC-style Odoo API implementation to the new RESTful API implementation for the Ranchi Loanee Management system.

## Changes Made

### 1. Created New API Service

A new `apiService.ts` file was created to implement the RESTful endpoints as described in the API documentation. The service is organized by entity type:

- `apiService.auth`: Authentication endpoints
- `apiService.unions`: Union management endpoints
- `apiService.members`: Member management endpoints
- `apiService.loans`: Loan management endpoints
- `apiService.installments`: Installment management endpoints
- `apiService.collectors`: Collector management endpoints
- `apiService.summary`: Summary statistics endpoints

Each entity service provides methods for standard CRUD operations and specialized operations as defined in the API documentation.

### 2. Updated Data Utilities

The `dataUtils.ts` file was updated to use the new `apiService` instead of the previous `odooService`. The caching mechanism was preserved to avoid excessive API calls. Error handling was improved to provide better feedback when API calls fail.

### 3. Updated Authentication Hook

The `useOdooAuth.tsx` hook was updated to use the new `apiService.auth` methods for login and logout functionality.

### 4. Created Test File

A new `test-rest-api.ts` file was created to test the new RESTful API implementation. This file tests both direct `apiService` calls and the updated `dataUtils` functions.

## API Endpoints

The following RESTful endpoints are now implemented:

### Authentication

- `POST /web/session/authenticate`: User login
- `POST /web/session/destroy`: User logout

### Unions

- `GET /api/unions`: List all unions
- `GET /api/unions/{unionId}`: Retrieve a single union
- `POST /api/unions`: Create a new union
- `PUT /api/unions/{unionId}`: Update an existing union
- `DELETE /api/unions/{unionId}`: Delete a union
- `GET /api/unions/{unionId}/members`: List all members of a union
- `GET /api/unions/{unionId}/collectors`: Get collectors for a union

### Members

- `GET /api/members`: List all members
- `GET /api/members/{memberId}`: Retrieve a single member
- `POST /api/members`: Create a new member
- `PUT /api/members/{memberId}`: Update an existing member
- `DELETE /api/members/{memberId}`: Delete a member
- `GET /api/members/{memberId}/loans`: List all loans for a member
- `GET /api/members/{memberId}/installments`: List all installments for a member

### Loans

- `GET /api/loans`: List all loans
- `GET /api/loans/{loanId}`: Retrieve a single loan
- `POST /api/loans`: Create a new loan
- `PUT /api/loans/{loanId}`: Update an existing loan
- `DELETE /api/loans/{loanId}`: Delete a loan
- `GET /api/loans/{loanId}/installments`: List installments for a loan

### Installments

- `GET /api/installments`: List all installments
- `GET /api/installments/{id}`: Retrieve a single installment
- `POST /api/installments`: Create a new installment
- `PUT /api/installments/{id}`: Update an installment
- `DELETE /api/installments/{id}`: Delete an installment
- `GET /api/installments/overdue`: List all overdue installments
- `GET /api/installments/pending`: List all pending installments

### Collectors

- `GET /api/collectors`: List all collectors
- `GET /api/collectors/{collectorId}`: Retrieve a single collector
- `GET /api/collectors/{collectorId}/installments`: List installments for a collector

### Summary

- `GET /api/summary/collection`: Retrieve collection summary

## Query Parameters

All GET list endpoints support the following query parameters:

- `limit` (int): Maximum number of records to return
- `offset` (int): Number of records to skip
- `sort` (string): Field name to sort by
- `order` (`asc` | `desc`): Sort direction
- `filter` (string): Comma-separated `field=value` tokens for filtering

## Next Steps

1. Test the new API implementation thoroughly in different environments
2. Monitor performance and optimize as needed
3. Update any remaining components that might still be using the old API
4. Consider deprecating and eventually removing the old `odooService.ts` file