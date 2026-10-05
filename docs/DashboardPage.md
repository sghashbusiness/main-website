# Dashboard Page Documentation

## Overview
The Dashboard Page (`/dashboard`) serves as the Executive Control Center for Owners and Super Admins. It provides a comprehensive, high-level overview of revenue, operations, logistics, stock, compliance, and staff across all branches. 


## Screen Layout & Elements

### 1. Global Context Controls (Top Bar)
This floating glassmorphic bar allows the user to filter the dashboard data globally.
- **Time Period Toggle**: A segmented control to switch the data view between:
  - **Daily** (Clock icon)
  - **Monthly** (CalendarDays icon)
  - **Yearly** (Calendar icon)
  - **Custom** (CalendarRange icon)
- **Date Range Picker**: Dynamically appears only when the "Custom" time period is selected, allowing the user to specify start and end dates.
- **Branch Filter Dropdown**: Allows filtering dashboard data for a specific branch or viewing consolidated data for "All Branches".

### 2. Revenue & Operations Section
- **Sales Analytics Panel**: Displays key performance indicators (KPIs) related to sales, revenue trends, and overall growth metrics based on the selected time period.
- **Tender Split Widget**: A breakdown chart/widget showing how payments were received (e.g., Cash, UPI, Credit Card).

### 3. Branch Performance Matrix (Conditional)
- **Multi-Branch Performance Chart**: A comparative chart displaying metrics across different store branches side-by-side.
- *Note: This section is only visible when the Branch Filter is set to "All Branches".*

### 4. Global Logistics & Stock Section
- **Consolidated Inventory Grid**: A high-level view or data grid showing current stock levels, low stock alerts, and inventory valuation.
- **Transfer Audit Queue**: Displays pending, in-transit, or recently completed inter-store stock transfers.

### 5. Compliance & Security Section
- **GST Export Control**: Tools for generating, reviewing, and exporting GST-compliant financial reports for accounting purposes.
- **Staff Directory Panel**: A quick-access list or summary of active staff members, their roles, and current status.

## Navigation & Routing
- Protected Route: This page is strictly restricted to users with the `OWNER` role.
- Navigation to other modules (Inventory, POS) is handled via the left-hand Sidebar.
