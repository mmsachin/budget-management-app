Okay, let's break down the design of the BM application, focusing on the screen flow and user interface.  I'll describe the screens, their components, navigation, and how they relate to the requirements.  Since I can't *draw* diagrams here, I'll use a detailed text-based representation, which you can easily translate into a visual mockup (e.g., using Figma, Balsamiq, or even drawing by hand).

**Overall Application Structure and Navigation**

*   **Single-Page Application (SPA) Concept:** The Angular application will operate as an SPA.  This means that the user stays on a single page, and content areas are dynamically updated as they interact with the application.  This provides a smoother, more responsive user experience.
*   **Main Navigation Bar:** A persistent navigation bar will be present at the top of every screen. This bar will contain:
    *   **Application Logo/Title:** "BM - Budget Management" (or a shorter name if preferred).
    *   **Navigation Links:**
        *   **Home (Dashboard):**  Leads to the main dashboard screen.
        *   **Users:**  Leads to the User Management section.
        *   **Org Hierarchy:** Leads to the Organization Hierarchy Management section.
        *   **AOP:**  Leads to a sub-menu:
            *   **AOP Header:** Leads to AOP Header Management.
            *   **AOP Detail:** Leads to AOP Detail Management.
        *   **Budgets:** Leads to the Budget Management section.
        *   **Purchase Orders:** Leads to the Purchase Order Management section.
        *   **Reports:** Leads to a sub-menu:
            *   **My Organization:**  Runs the organization hierarchy report.
            *   **My Budget:** Runs the budget summary report.
        *    **Login/Authentication indicator**: Shows that the user is logged in or not
    *   **User Context (After Login):**  Displays the logged-in user's LDAP (or a shortened version, e.g., first initial + last name).  This serves as a visual confirmation of successful authentication.

*   **Consistent Styling:**  A consistent visual style (colors, fonts, spacing) will be used throughout the application to maintain a professional and cohesive look.

**Screen Flow and Screen Designs**

1.  **Login Screen**

    *   **Purpose:** Authenticates the user (using the hardcoded "IKnowYou241202" password).
    *   **Elements:**
        *   Application Logo/Title.
        *   Input Field: Labeled "Enter Access Code".  This is a *password* input type (so the input is masked).
        *   Submit Button: Labeled "Login".
        *   Error Message Area: Initially hidden.  Displays "Invalid Access Code.  You are not authenticated." if the login fails.
    *   **Flow:**
        *   User enters the access code.
        *   User clicks "Login".
        *   **Success:**  The application redirects to the Home (Dashboard) screen.  The navigation bar updates to show the user context.
        *   **Failure:**  The error message is displayed. The user remains on the Login screen.

2.  **Home (Dashboard) Screen**

    *   **Purpose:** Provides an overview and quick access to key areas of the application.
    *   **Elements:**
        *   Welcome Message: "Welcome, [User's LDAP]"
        *   Cards/Widgets:
            *   **Active AOP:**  Displays the currently active AOP's name and total amount.  If no AOP is active, displays "No Active AOP".  Clicking this card navigates to the AOP Header Management screen.
            *   **My Pending Budget Requests:** (If applicable - see discussion below).  Shows the number of budget requests created by the user that are awaiting approval (if a workflow is implemented).
            *   **Recent Purchase Orders:** Shows the last few purchase orders entered, with key details (PO number, date, amount, budget ID).  Clicking a row navigates to the Purchase Order details.
            *   **Quick Links:** Buttons to quickly navigate to commonly used sections (e.g., "Create New Budget Request", "View My Organization").
        * **Navigation bar**
    *   **Flow:**
        *   Serves as the central hub for the application.  Users can navigate to other sections from here.

3.  **User Management Screen**

    *   **Purpose:** CRUD operations for Users.
    *   **Elements:**
        *   Table: Displays a list of all users. Columns include:
            *   LDAP
            *   First Name
            *   Last Name
            *   Email
            *   Level
            *   Cost Center Code
            *   Actions (Edit, Delete buttons)
        *   "Add User" Button: Opens a modal (pop-up window) for creating a new user.
        *   Search/Filter: Allows users to search for users by name, LDAP, or other criteria.
        * **Navigation Bar**
    *   **Add/Edit User Modal:**
        *   Form Fields:
            *   LDAP (text input)
            *   First Name (text input)
            *   Last Name (text input)
            *   Email (email input)
            *   Level (dropdown, values 1-12)
            *   Cost Center Code (dropdown, populated from the Cost Center master list)
        *   "Save" Button
        *   "Cancel" Button
    *   **Flow:**
        *   User can view the list of users.
        *   Clicking "Add User" opens the modal.  The user fills in the form and clicks "Save".  The new user is added to the database, and the table updates.
        *   Clicking "Edit" on a user row opens the same modal, pre-populated with the user's data.
        *   Clicking "Delete" prompts a confirmation ("Are you sure you want to delete this user?").

4.  **Organization Hierarchy Management Screen**

    *   **Purpose:** CRUD operations for the Manager-Employee relationships.
    *   **Elements:**
        *   **Option 1: Tree View:**  A hierarchical tree view visually represents the organization structure.  Users can expand/collapse branches.  Clicking on a node (employee) could open a modal to edit the relationship (change the manager).
        *   **Option 2: Table View (with Parent/Child Relationship):**
            *   Table: Columns include:
                *   Employee LDAP (dropdown, populated from the User list)
                *   Employee Name (read-only, based on selected LDAP)
                *   Manager LDAP (dropdown, populated from the User list)
                *   Manager Name (read-only)
                *   Actions (Edit, Delete)
            *   "Add Relationship" Button: Opens a modal for creating a new manager-employee relationship.
        *   Search/Filter: To quickly find employees.
        * **Navigation Bar**
    *   **Add/Edit Relationship Modal:**
        *   Form Fields:
            *   Employee (dropdown, populated from the User list)
            *   Manager (dropdown, populated from the User list)
        *   "Save" Button
        *   "Cancel" Button
    *   **Flow:**
        *   The user can view the organization hierarchy (either as a tree or a table).
        *   The user can add new relationships or edit existing ones using the modal.
        *   Deleting a relationship would prompt for confirmation.

5.  **AOP Header Management Screen**

    *   **Purpose:** CRUD operations for AOP Headers.
    *   **Elements:**
        *   Table: Displays a list of AOP Headers. Columns include:
            *   AOP Name
            *   Total Amount
            *   Status (Draft, Active, EOL)
            *   Actions (Edit, Delete, Set Status buttons)
        *   "Add AOP Header" Button: Opens a modal for creating a new AOP Header.
        * **Navigation Bar**
    *   **Add/Edit AOP Header Modal:**
        *   Form Fields:
            *   AOP Name (text input)
            *   Total Amount (number input)
            *   Status (dropdown, values: Draft, Active, EOL) - Default to Draft.
        *   "Save" Button
        *   "Cancel" Button
    *   **Set Status Buttons (in the table row):**
        *   "Set to Active":  Sets the AOP status to Active.  Includes validation to ensure only one AOP is active and total budget amount constraints.
        *   "Set to EOL": Sets the AOP status to EOL.
    *   **Flow:**
        *   Users can view the list of AOP Headers.
        *   Add/Edit operations are handled through the modal.
        *   Status changes are made via the buttons in the table, with appropriate validation and error handling.

6.  **AOP Detail Management Screen**

    *   **Purpose:** CRUD operations for AOP Details (Cost Center allocations).
    *   **Elements:**
        *   **AOP Selector:** A dropdown to select the AOP Header for which details are being managed.
        *   Table: Displays the AOP Details for the selected AOP Header. Columns include:
            *   Cost Center Code (read-only)
            *   Cost Center Name (read-only)
            *   Amount
            *   Actions (Edit, Delete)
        *   "Add AOP Detail" Button: Opens a modal for adding a new cost center allocation.
        * **Navigation Bar**
        *   **Displayed Total:** Shows the *calculated* total amount for the AOP Details, updated dynamically as details are added/edited/deleted.
    *   **Add/Edit AOP Detail Modal:**
        *   Form Fields:
            *   Cost Center (dropdown, populated from the Cost Center master list)
            *   Amount (number input)
        *   "Save" Button
        *   "Cancel" Button
    *   **Flow:**
        *   The user selects an AOP Header.  The table displays the details for that AOP.
        *   Add/Edit operations are handled through the modal.
        *   The displayed total is updated in real-time.
        *   Validation ensures that the total AOP Detail amount does not exceed the AOP Header's total amount (when active).

7.  **Budget Management Screen**

    *   **Purpose:** CRUD operations for Budget lines.
    *   **Elements:**
        *   Table: Displays a list of Budget lines. Columns include:
            *   Budget ID (auto-generated)
            *   AOP (read-only, based on selection)
            *   Employee LDAP (read-only, based on selection)
            *   Cost Center (read-only, derived from Employee)
            *   Project
            *   Description
            *   Amount
            *   Budget Spent (calculated from Purchase Orders)
            *   Remaining Budget (calculated)
            *   Actions (Edit, Delete)
        *   "Add Budget" Button: Opens a modal for creating a new budget line.
        *   **AOP Filter:** A dropdown allows filtering the table by AOP.
        * **Navigation Bar**
    *   **Add/Edit Budget Modal:**
        *   Form Fields:
            *   AOP (dropdown, populated from AOP Headers)
            *   Employee (dropdown, populated from the User list, with filtering based on organization hierarchy)
            *   Project (text input)
            *   Description (text input)
            *   Amount (number input)
        *   "Save" Button
        *   "Cancel" Button
    *   **Flow:**
        *   Users can view the list of budget lines.
        *   Add/Edit operations use the modal.
        *   Validation: The total budget amount for an AOP cannot exceed the AOP Header's total amount (if active).  Budget Spent and Remaining Budget are updated automatically.

8.  **Purchase Order Management Screen**

    *   **Purpose:** CRUD operations for Purchase Orders.
    *   **Elements:**
        *   Table: Displays a list of Purchase Orders. Columns include:
            *   PO Number
            *   PO Line Number
            *   Requestor LDAP
            *   Budget ID
            *   Purchase Item
            *   Amount
            *   Date
            *   Actions (Edit, Delete)
        *   "Add Purchase Order" Button: Opens a modal for creating a new PO.
        *   **Budget ID Filter:** Allows filtering the table by Budget ID.
        * **Navigation Bar**
    *   **Add/Edit Purchase Order Modal:**
        *   Form Fields:
            *   PO Number (text input)
            *   PO Line Number (number input)
            *   Requestor LDAP (dropdown, populated from User list)
            *   Budget ID (dropdown, populated from existing Budget lines)
            *   Purchase Item (text input)
            *   Amount (number input)
            *   Date (date picker)
        *   "Save" Button
        *   "Cancel" Button
    *   **Flow:**
        *   Users can view the list of Purchase Orders.
        *   Add/Edit operations are handled through the modal.
        *   Validation: The total PO amount for a Budget ID cannot exceed the Budget line's amount.  The Budget Management screen's "Budget Spent" is updated automatically.

9.  **Reports: "My Organization"**

    *   **Purpose:** Displays the organization hierarchy for the logged-in user.
    *   **Elements:**
        *   **Tree View (preferred):**  A hierarchical tree view, starting with the logged-in user as the root.  Expand/collapse functionality.
        *   **Table View (alternative):**  A table showing the reporting relationships, similar to the Organization Hierarchy Management screen, but filtered to the logged-in user's hierarchy.
        * **Navigation Bar**
    *   **Flow:**
        *   The report is generated dynamically based on the logged-in user and the organization hierarchy data.

10. **Reports: "My Budget"**

    *   **Purpose:** Displays the budget totals for the logged-in user and their direct and indirect reports.
    *   **Elements:**
        *   Table:
            *   Employee LDAP
            *   Employee Name
            *   Total Budget Amount (sum of all budget lines for that employee)
            *   Total Budget Spent (sum of all POs for that employee)
            *   Remaining Budget
        *   **AOP Filter**
        * **Navigation Bar**
    *   **Flow:**
        *   The report aggregates budget and PO data for the logged-in user and their entire reporting hierarchy.

**Key Considerations and Design Principles**

*   **Error Handling:**  Clear and user-friendly error messages are displayed for all validation failures (e.g., exceeding budget limits, invalid input).
*   **Data Validation:**  Input fields have appropriate validation (e.g., number inputs for amounts, date pickers for dates).
*   **Confirmation Dialogs:**  "Are you sure?" confirmations are used for destructive actions (e.g., deleting records).
*   **Loading Indicators:**  Spinners or progress bars are displayed during data loading to indicate that the application is working.
*   **Responsive Design:**  The application layout should adapt to different screen sizes (desktop, tablet, mobile).
*   **Accessibility:**  Follow accessibility guidelines (e.g., sufficient color contrast, keyboard navigation) to make the application usable for people with disabilities.
*  **Cost Center Management:** Implement the CRUD APIs for Cost Centers. Add a screen similar in design to the user management, but for maintaining cost centers.
* **Adjusted Plan:** This will need a dedicated screen and workflow. It should allow authorized users to modify AOP details even when the AOP is active. This might involve a separate "Adjusted Plan" table linked to the AOP Detail, with its own approval process. Due to complexity, I am leaving it out of the initial UI flow, but it's a *crucial* requirement.
* **No Approval Workflows (Initially):** Based on the 10-user count and $50 budget, I'm *not* including complex approval workflows (e.g., for budget requests) in this initial design. This significantly simplifies the application. If workflows are truly needed, they would add substantial complexity (and likely cost).
* **GCP Services and Cost:** The use of Cloud Spanner, while robust, is likely overkill for 10 users and 1000 budget lines. A more cost-effective solution, and one that stays well under $50, would be:
     *   **Compute Engine:** A small, f1-micro or g1-small instance for the Python backend.
     *   **Cloud Storage:** Host the Angular application's static files.
     *   **Cloud SQL (PostgreSQL or MySQL):** A small, db-f1-micro instance for the database. This will be significantly cheaper than Spanner.
     *   **Cloud Run (Alternative to Compute Engine):** Deploy the Python backend as a containerized application on Cloud Run. This can be very cost-effective for low-traffic applications.

This detailed screen flow and UI description provide a solid foundation for building the BM application. It addresses all the stated requirements, prioritizes usability, and considers cost-effectiveness. Remember to iterate on this design based on user feedback and testing.
