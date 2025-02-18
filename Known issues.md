# Application Issues and Requirements

## Reports
- **Implementation**: None of the reports have been implemented yet.

## User Management
- **Add User and Other Create Operations**: These operations are failing.
- **Edit User**:  
  - URL: [http://localhost:8000/src/#/users](http://localhost:8000/src/#/users)  
  - Issue: Editing does not load the employee details.

## Organizational Relationship
- **Create Org Relationship**:  
  - Implement validations such as enforcing a 1:1 mapping between an employee and their manager.

## AOP Detail
- **Navigation**:  
  - No dedicated navigation button is available.  
  - Accessible via [http://localhost:8000/src/#/aop-details](http://localhost:8000/src/#/aop-details).
- **Display Issue**: AOP details are not being shown.

## AOP Header
- **Status Management**:  
  - The "Set Status" button does not work and may need to be removed.
  - Additional validations are required.
- **Representation**:  
  - The header is represented by a name (e.g., AOP2024 or AOP2025), a total amount, and states: **draft**, **active**, and **EOL**.
  - Only one active AOP is allowed at any given time.
- **Lifecycle Management**:  
  - Users should be able to set the lifecycle of an AOP.
  - It should be possible to change a **draft** or **EOL** AOP to **active**.
  - When an AOP is set to active, ensure that the total amounts across active budgets do not exceed the total amount in the active AOP.
  - New AOPs should default to **draft** if no lifecycle is specified.

## AOP Detail Updates
- **Structure**:  
  - Each AOP detail should reference the AOP header, include a cost center, and specify an amount for that cost center.
- **Total Amount Update**:  
  - Updating an AOP detail should recalculate and update the total amount for the AOP header.
- **Modification Restrictions**:  
  - Once an AOP is active, modifications to the amounts are not allowed unless updated via a special process called **Adjusted Plan** (details to be discussed later).
- **APIs**:  
  - CRUD APIs will be provided for managing AOP.
