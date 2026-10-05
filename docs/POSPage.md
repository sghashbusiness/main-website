# POS (Point of Sale) Page Documentation

## Overview
The POS Page (`/pos`) is the Terminal Checkout interface designed for fast billing and sales processing. It provides a complete workflow from scanning items to capturing customer data, selecting payment methods, and generating invoices.


## Screen Layout & Elements

### 1. Page Header
- **Title**: "Terminal Checkout" with a Shopping Cart icon.

### 2. Main POS Grid (Left Side)
This area is dedicated to item entry and cart management.
- **Store Meta Card**: Displays details about the currently active branch where the sale is taking place.
- **IMEI Scanner Bar**: An input field/scanner interface to quickly add items to the cart by scanning or typing their IMEI or SKU. Triggers an API lookup and adds the item to the bill.
- **Billing Items Table**: A comprehensive list of all items currently in the cart.
  - Shows item details, quantity, IMEIs, base price, and applicable taxes.
  - **Update Discount Button/Field**: Allows staff to apply manual discounts to specific line items.
  - **Remove Item Button**: Removes the item from the current transaction.

### 3. POS Sidebar (Right Side)
This panel manages the checkout process and payment collection.
- **Customer Info Container**: Input fields to capture the customer's Mobile Number (required), Name, and optional GSTIN for B2B billing.
- **Invoice Delivery Toggle**: Allows selecting how the invoice will be sent (e.g., WhatsApp, Email, or Print).
- **Bill Summary Panel**: A dynamic calculation block showing:
  - Subtotal
  - Total Discounts
  - Total Taxes (CGST/SGST)
  - **Grand Total**
- **Payment Method Selector**: A tabbed or dropdown interface to select how the customer is paying.
  - **Cash**: Requires entering the "Cash Received" amount to calculate change.
  - **Split Tender**: Allows dividing the Grand Total across multiple methods (Cash, UPI, Card). The split amounts must perfectly match the Grand Total.
- **"Complete Sale" Button**: The primary action button (large PillButton with a CheckCircle icon).
  - Disabled if the cart is empty, loading, or if the form is invalid.
  - Validates customer mobile length and exact payment amounts before processing.
  - Triggers the backend checkout process and fires webhooks (e.g., WhatsApp invoice delivery).

### 4. Post-Sale Actions
- **Invoice Preview Modal**: After a successful sale, a modal pops up displaying the generated invoice preview and the official Invoice Number.
- Closing the modal resets the entire POS page (clears cart, customer info, and payment details) ready for the next customer.

## Navigation & Routing
- Accessible by all roles that handle sales (`OWNER`, `BILLING_CLERK`).
- The page restricts users to their currently assigned branch context to prevent accidental cross-branch billing.
