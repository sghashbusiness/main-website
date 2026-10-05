# Inventory Page Documentation

## Overview
The Inventory Page (`/inventory`) is the dedicated Stock Operations Module. It is used to manage stock ingestion, inter-store transfers, and global stock searching. This module is restricted to Inventory Managers and Owners.


## Screen Layout & Elements

### 1. Page Header
- **Title**: "Stock Operations".
- **Active Context Display**: Shows the currently selected branch (e.g., "All Branches" or a specific store name) based on the global state.
- **Navigation Tabs (Segmented Toggle)**: A pill-shaped segmented control to switch between the three main inventory sub-modules:
  - **Global Search**
  - **Stock Ingestion**
  - **Inter-Store Logistics**

### 2. Tab Contents (Dynamic Area)

#### A. Global Search Tab
- The default view when entering the Inventory page.
- Provides search functionality to locate specific SKUs, products, or IMEI numbers across the selected branch or all branches.

#### B. Stock Ingestion Tab
- A dedicated workspace for adding new stock into the system.
- Includes forms and scanners for receiving purchase orders, mapping IMEIs to SKUs, and updating stock quantities.

#### C. Inter-Store Logistics Tab
- A management interface for handling branch-to-branch stock transfers.
- Allows users to initiate new transfers, receive incoming stock from other branches, and track in-transit logistics.

## Navigation & Routing
- Protected Route: Restricted to `OWNER` and `INVENTORY_MANAGER` roles.
- The active tab state determines which component is rendered in the main content area.
- Context is inherited from the global Branch context, which can be modified if the user has appropriate permissions.
