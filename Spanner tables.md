-- # Spanner Database Schema for Budget Management Application

-- **Spanner Instance ID:** budget-management
-- **Database Name:** budget-db

-- Create the CostCenters table
CREATE TABLE CostCenters (
    cost_center_code STRING(10) NOT NULL,
    cost_center_name STRING(255) NOT NULL,
) PRIMARY KEY (cost_center_code);

-- Create the Users table (formerly Employees)
CREATE TABLE Users (
    ldap STRING(255) NOT NULL,
    first_name STRING(255) NOT NULL,
    last_name STRING(255) NOT NULL,
    email STRING(255) NOT NULL,
    level STRING(50),
    cost_center_code STRING(10),
    CONSTRAINT FK_Users_CostCenters FOREIGN KEY (cost_center_code) REFERENCES CostCenters (cost_center_code)
) PRIMARY KEY (ldap);

-- Create the AOPHeaders table
CREATE TABLE AOPHeaders (
    aop_id INT64 NOT NULL,
    name STRING(255) NOT NULL,
    total_amount FLOAT64 NOT NULL,
    state STRING(10) NOT NULL,
    CONSTRAINT CHK_AOPHeaders_state CHECK (state IN ('draft', 'active', 'EOL'))
) PRIMARY KEY (aop_id);

-- Create the AOPDetails table
CREATE TABLE AOPDetails (
    aop_id INT64 NOT NULL,
    aop_detail_id INT64 NOT NULL,
    cost_center_code STRING(10) NOT NULL,
    amount FLOAT64 NOT NULL,
    CONSTRAINT FK_AOPDetails_AOPHeaders FOREIGN KEY (aop_id) REFERENCES AOPHeaders (aop_id),
    CONSTRAINT FK_AOPDetails_CostCenters FOREIGN KEY (cost_center_code) REFERENCES CostCenters (cost_center_code)
) PRIMARY KEY (aop_id, aop_detail_id),
  INTERLEAVE IN PARENT AOPHeaders ON DELETE NO ACTION;

-- Create the Budgets table
CREATE TABLE Budgets (
    aop_id INT64 NOT NULL,
    budget_id INT64 NOT NULL,
    project STRING(255) NOT NULL,
    description STRING(1024),
    amount FLOAT64 NOT NULL,
    ldap STRING(255) NOT NULL,
    CONSTRAINT FK_Budgets_Users FOREIGN KEY (ldap) REFERENCES Users (ldap),
    CONSTRAINT FK_Budgets_AOPHeaders FOREIGN KEY (aop_id) REFERENCES AOPHeaders (aop_id)
) PRIMARY KEY (budget_id),
INTERLEAVE IN PARENT AOPHeaders ON DELETE NO ACTION;

CREATE UNIQUE INDEX unique_budget_entry ON Budgets (aop_id, project, description, ldap, amount);

-- Create ManagerUserRelationships table (For Org Hierarchy)
CREATE TABLE ManagerUserRelationships (
    relationship_id INT64 NOT NULL,
    employee_ldap STRING(255) NOT NULL,
    manager_ldap STRING(255) NOT NULL,
    CONSTRAINT FK_Relationships_Employee FOREIGN KEY (employee_ldap) REFERENCES Users (ldap),
    CONSTRAINT FK_Relationships_Manager FOREIGN KEY (manager_ldap) REFERENCES Users (ldap),
    CONSTRAINT CK_Relationships_NotSelf CHECK (employee_ldap != manager_ldap)
) PRIMARY KEY (relationship_id);

-- Create the PurchaseOrders table
CREATE TABLE PurchaseOrders (
    po_id  INT64 NOT NULL,
    po_number STRING(255) NOT NULL,
    po_line_number INT64 NOT NULL,
    requestor_ldap STRING(255) NOT NULL,
    budget_id INT64 NOT NULL,
    purchase_item STRING(255) NOT NULL,
    amount FLOAT64 NOT NULL,
    po_date DATE NOT NULL,
    CONSTRAINT FK_PurchaseOrders_Users FOREIGN KEY (requestor_ldap) REFERENCES Users (ldap),
    CONSTRAINT FK_PurchaseOrders_Budgets FOREIGN KEY (budget_id) REFERENCES Budgets (budget_id)
) PRIMARY KEY (po_id);


----

Sample entries

-- CostCenters
INSERT INTO CostCenters (cost_center_code, cost_center_name) VALUES
('CC100', 'Marketing'),
('CC200', 'Sales'),
('CC300', 'Engineering'),
('CC400', 'Finance'),
('CC500', 'Operations');

-- Users
INSERT INTO Users (ldap, first_name, last_name, email, level, cost_center_code) VALUES
('jdoe', 'John', 'Doe', 'john.doe@example.com', 'Manager', 'CC100'),
('asmith', 'Alice', 'Smith', 'alice.smith@example.com', 'Staff', 'CC100'),
('bjones', 'Bob', 'Jones', 'bob.jones@example.com', 'Manager', 'CC200'),
('clee', 'Charlie', 'Lee', 'charlie.lee@example.com', 'Staff', 'CC300'),
('ddavis', 'Diana', 'Davis', 'diana.davis@example.com', 'Staff', 'CC200');

-- AOPHeaders
INSERT INTO AOPHeaders (aop_id, name, total_amount, state) VALUES
(1, 'AOP2023', 100000.00, 'EOL'),
(2, 'AOP2024', 150000.00, 'active'),
(3, 'AOP2025', 200000.00, 'draft'),
(4, 'SpecialProjectAOP', 50000.00, 'draft'),
(5, 'ContingencyAOP', 10000.00, 'draft');

-- AOPDetails
INSERT INTO AOPDetails (aop_id, aop_detail_id, cost_center_code, amount) VALUES
(2, 1, 'CC100', 40000.00),
(2, 2, 'CC200', 50000.00),
(2, 3, 'CC300', 30000.00),
(2, 4, 'CC400', 20000.00),
(2, 5, 'CC500', 10000.00);

-- Budgets
INSERT INTO Budgets (budget_id, aop_id, project, description, amount, ldap) VALUES
(1, 2, 'Website Redesign', 'New website design and development', 15000.00, 'jdoe'),
(2, 2, 'Marketing Campaign Q1', 'Marketing campaign for Q1 2024', 25000.00, 'jdoe'),
(3, 2, 'Sales Training', 'Sales team training program', 10000.00, 'bjones'),
(4, 2, 'New Product Development', 'R&D for new product', 20000.00, 'clee'),
(5, 2, 'Office Supplies', 'Purchase of office supplies', 5000.00, 'ddavis');

-- ManagerUserRelationships
INSERT INTO ManagerUserRelationships (relationship_id, employee_ldap, manager_ldap) VALUES
(1, 'asmith', 'jdoe'),  -- Alice Smith reports to John Doe
(2, 'ddavis', 'bjones'), -- Diana Davis reports to Bob Jones
(3, 'clee', 'jdoe'),   -- Charlie Lee reports to John Doe
(4, 'bjones', 'jdoe');   -- Bob Jones reports to John Doe.


-- PurchaseOrders
INSERT INTO PurchaseOrders (po_id, po_number, po_line_number, requestor_ldap, budget_id, purchase_item, amount, po_date) VALUES
(1, 'PO1001', 1, 'jdoe', 1, 'Website Design Mockups', 5000.00, '2024-01-15'),
(2, 'PO1002', 1, 'jdoe', 2, 'Social Media Ads', 10000.00, '2024-02-01'),
(3, 'PO1003', 1, 'bjones', 3, 'Sales Training Materials', 2000.00, '2024-02-10'),
(4, 'PO1004', 1, 'clee', 4, 'Software Licenses', 8000.00, '2024-02-20'),
(5, 'PO1005', 1, 'ddavis', 5, 'Printer Paper', 500.00, '2024-03-01');