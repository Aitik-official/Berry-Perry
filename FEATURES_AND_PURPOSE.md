# Safe Health — Application Features, Functions & Purpose Guide

This document provides a clean, comprehensive operational and technical blueprint of the **Safe Health Pharma Inventory, Barcode Engine, E-Invoice/GST Billing, and Sales Person Mobile App Platform**.

---

## Table of Contents
1. [Executive Summary & System Purpose](#1-executive-summary--system-purpose)
2. [Module 1: Barcode Generation & Thermal Label Printing](#2-module-1-barcode-generation--thermal-label-printing)
3. [Module 2: Pharmaceutical Inventory Management](#3-module-2-pharmaceutical-inventory-management)
4. [Module 3: Order Receiving & Processing Channels](#4-module-3-order-receiving--processing-channels)
5. [Module 4: E-Invoice, GST Billing & AI Invoice OCR Integration](#5-module-4-e-invoice-gst-billing--ai-invoice-ocr-integration)
6. [Module 5: Sales Person Mobile App & Field Delivery Integration](#6-module-5-sales-person-mobile-app--field-delivery-integration)
7. [Module 6: Daily Runsheet & Logistics Notebook](#7-module-6-daily-runsheet--logistics-notebook)
8. [Module 7: Payment Collections & Chemist Party Ledger](#8-module-7-payment-collections--chemist-party-ledger)
9. [Module 8: User Administration & Role-Based Access Control (RBAC)](#9-module-8-user-administration--role-based-access-control-rbac)
10. [Comprehensive Page, Function & API Reference Directory](#10-comprehensive-page-function--api-reference-directory)

---

## 1. Executive Summary & System Purpose

### Business Purpose
**Safe Health Enterprises** operates as a high-volume pharmaceutical distributor and wholesale health hub. The system streamlines end-to-end pharma distribution across five core pillars:
1. **Serial-Level Barcode Tracking:** Assigning a unique Code 128 barcode per individual unit (strip/box) to guarantee batch authenticity and live stock counts.
2. **Batch & Expiry Inventory Management:** Full traceability of medicine batches, expiry dates, purchase orders, customer allocations, and return credit notes.
3. **Multi-Channel Order Receiving:** Seamless order intake via Walk-in POS scanning, Chemist B2B self-service reordering, and Wholesale orders.
4. **E-Invoice & GST Compliance:** Automated GST calculation (CGST, SGST, IGST), HSN mapping (3004/2106), drug license verification, and AI-assisted invoice bill scanning.
5. **Sales Person Mobile App:** A dedicated field-delivery interface for territory sales reps (e.g. S.Man 676 - INDOCHEM AGE) to manage morning runsheet handovers, complete on-spot chemist deliveries, and record cash/cheque collections.

---

## 2. Module 1: Barcode Generation & Thermal Label Printing

### 2.1 Purpose & Core Concept
In pharmaceutical distribution, tracking static SKUs is insufficient. Safe Health utilizes a **Serial Unit Barcode Engine**:
- Every physical unit (strip, box, or vial) receives an individual unique 12-digit numeric Code 128 barcode.
- Receiving 500 units of *INDCLAV-625* automatically creates 500 distinct serial records in the database with status `AVAILABLE`.
- Scanning an item at Dispatch or POS transitions that specific unit barcode to `SOLD` or `DISPATCHED`, updating the available warehouse stock in real time.

### 2.2 Barcode Structure & Logic
Located in [`src/lib/barcode.ts`](file:///d:/Safe-Health/barcode-inventory/src/lib/barcode.ts):
- **Internal Prefix:** `29` (identifies internal company barcodes).
- **Unique Timestamp Sequence:** 8-digit high-resolution timestamp slice + 2-digit random padding.
- **Symbology:** 12-digit numeric string formatted for Code 128 barcodes.
- **Uniqueness Check:** Validates against the `UnitBarcode` collection with automated retry safeguards.

### 2.3 Key Functions
- `generateSingleBarcodeString()`: Generates and validates an unused 12-digit barcode.
- `generateUnitBarcodesForVariant({ productVariantId, quantity, generatedBy, note })`:
  1. Finds the latest serial number for the product variant.
  2. Batch-creates serial unit barcodes in `UnitBarcode`.
  3. Automatically updates active stock in the `Inventory` table.
  4. Records an immutable `InventoryTransaction` of type `RECEIVE`.
- `buildSku()` / `ensureUniqueSku()`: Auto-generates structured SKUs from product name and packing details.

### 2.4 Thermal Label Printing Engine
Located in [`src/components/PrintLabelDialog.tsx`](file:///d:/Safe-Health/barcode-inventory/src/components/PrintLabelDialog.tsx) and [`src/lib/label-sizes.ts`](file:///d:/Safe-Health/barcode-inventory/src/lib/label-sizes.ts):
- **Thermal Label Sizing Presets:**
  - `50 × 30 mm`: **Standard Default Retail Thermal Label**.
  - `50 × 25 mm`: Small ampoule/strip tag.
  - `75 × 50 mm`: Warehouse shelf & intermediate box.
  - `100 × 50 mm`: Master carton / shipping container.
- **Reprint vs. New Barcode:** Reprints safely reuse the exact same unit barcode without altering serial numbers. Every print and reprint triggers a `PrintJob` entry and an `AuditLog` entry.

### 2.5 Verification & Lookup Engine
Located in [`src/app/api/barcodes/lookup/route.ts`](file:///d:/Safe-Health/barcode-inventory/src/app/api/barcodes/lookup/route.ts):
- Instant hardware USB scanner lookup.
- Resolves by exact unit barcode (returns unit status, serial number, batch, expiry) or variant SKU (returns the first available unit in the FIFO queue).

---

## 3. Module 2: Pharmaceutical Inventory Management

### 3.1 Purpose & Workflow
Located in [`src/app/(barcode)/inventory/`](file:///d:/Safe-Health/barcode-inventory/src/app/(barcode)/inventory/):
Provides end-to-end auditability and visibility over physical medicine stock, batch numbers, expiry dates, supplier procurements, and returns.

### 3.2 Database Models ([`prisma/schema.prisma`](file:///d:/Safe-Health/barcode-inventory/prisma/schema.prisma))
- `Product`: Master catalog entry (medicine name, brand, HSN code, MRP, offer price, GST rate, status).
- `ProductVariant`: SKU-level record holding batch numbers (e.g. `21541165`), expiry dates (e.g. `11/2026`), manufacturer (`INDOCHEM`), packing (`10 TAB`), chemical composition, and rates.
- `Inventory`: Active stock counter linked 1:1 with `ProductVariant` (`quantity` matches count of `AVAILABLE` unit barcodes).
- `InventoryTransaction`: Immutable log of every single stock movement.

### 3.3 Transaction Types
Every stock mutation logs an `InventoryTransaction`:
1. `RECEIVE`: New stock arrived via Purchase Order or manual intake (generates new serial barcodes).
2. `SALE`: Stock sold via POS counter, wholesale order, or chemist portal (marks unit `SOLD`).
3. `RETURN`: Stock returned by chemist or delivery staff.
4. `ADJUST`: Physical cycle-count reconciliation.
5. `DAMAGE`: Unit damaged in handling, leaking, or broken seal.
6. `TRANSFER`: Stock moved between warehouses or assigned to customer consignment.

### 3.4 Purchase Orders (Procurement)
Located in [`src/app/api/inventory/po/route.ts`](file:///d:/Safe-Health/barcode-inventory/src/app/api/inventory/po/route.ts):
- Generates supplier purchase orders (`PO-XXXX`) linked to a `Supplier`.
- Tracks expected delivery date, supplier GSTIN, items, quantities, and agreed purchase rates.

### 3.5 Damaged Stock & Waste Management
Located in [`src/app/api/inventory/waste/route.ts`](file:///d:/Safe-Health/barcode-inventory/src/app/api/inventory/waste/route.ts):
- Categorizes scrap units: `DAMAGED`, `EXPIRED`, `LOST`, `OTHER`.
- Automatically reduces inventory quantity and logs an audit trail.

### 3.6 Order Returns & Credit Note Ledger
Located in [`src/app/api/returns/route.ts`](file:///d:/Safe-Health/barcode-inventory/src/app/api/returns/route.ts):
- Manages client return requests (`RET-XXXXXX`) for expired or near-expiry medicines.
- Auto-generates a Credit Note (`CN-XXXXX`) with credit amount (`creditNoteAmt`).
- **Automatic Financial Sync:** If a `partyCode` is provided, the credit amount is immediately deducted from the chemist's outstanding balance (`Customer.currentOutstanding`).

---

## 4. Module 3: Order Receiving & Processing Channels

Safe Health supports three streamlined order intake pipelines:

### 4.1 Chemist B2B Self-Service Portal (Party Portal)
Located in [`src/app/(barcode)/party-portal/`](file:///d:/Safe-Health/barcode-inventory/src/app/(barcode)/party-portal/) & [`src/app/api/party-orders/route.ts`](file:///d:/Safe-Health/barcode-inventory/src/app/api/party-orders/route.ts):
- **Chemist Actions:**
  - Login or switch to Chemist account (e.g. `14083 - YUG PHARMA`).
  - View live stock of all pharma products, active rates, batch numbers, and expiry dates.
  - Place instant reorders directly into the system.
  - Check account ledger balance, credit limit, pending invoices, and credit notes.
- **Automated Order Pipeline:**
  1. Creates an `InvoiceScan` bill record.
  2. Queues a `DispatchEntry` in the warehouse queue.
  3. Creates a `PaymentCollection` entry with `PENDING` status.
  4. Updates the chemist's outstanding balance automatically.

### 4.2 POS Quick Scan Counter Checkout
Located in [`src/app/(barcode)/scan/`](file:///d:/Safe-Health/barcode-inventory/src/app/(barcode)/scan/) & [`src/app/api/scan/checkout/route.ts`](file:///d:/Safe-Health/barcode-inventory/src/app/api/scan/checkout/route.ts):
- Designed for retail counter and fast walk-in sales.
- Connects directly with USB hardware barcode scanners.
- Scanning a serial unit barcode instantly adds it to the active cart.
- On Checkout:
  - Validates that the unit is currently `AVAILABLE`.
  - Updates `UnitBarcode.status = "SOLD"`.
  - Decrements `Inventory` count.
  - Generates an instant thermal POS slip or printable A4 GST Tax Invoice.

### 4.3 Wholesale Invoicing & Orders
Located in [`src/app/(barcode)/orders/`](file:///d:/Safe-Health/barcode-inventory/src/app/(barcode)/orders/) & [`src/app/api/orders/route.ts`](file:///d:/Safe-Health/barcode-inventory/src/app/api/orders/route.ts):
- Processes wholesale bulk orders from pharmacies and clinics.
- Runs atomic transactions ensuring stock availability before confirming orders.

---

## 5. Module 4: E-Invoice, GST Billing & AI Invoice OCR Integration

### 5.1 E-Invoice & GST Compliance Architecture
Located in [`src/components/PrintShippingInvoiceDialog.tsx`](file:///d:/Safe-Health/barcode-inventory/src/components/PrintShippingInvoiceDialog.tsx):
- **Pharma HSN Code Mapping:**
  - `3004`: Medicaments consisting of mixed or unmixed products for therapeutic uses (standard 12% GST).
  - `2106`: Food supplements, vitamins, and nutraceutical preparations (standard 18% GST).
- **Tax Breakdown Engine:**
  - **Intra-State Supply:** Automatic split into equal **CGST** and **SGST** portions.
  - **Inter-State Supply:** Applied as single **IGST** component.
- **Statutory Drug License & Party Information:**
  - Customer Drug License numbers (e.g. `20B-000176, 21B-00176`, `AGA-2016`).
  - Safe Health Drug License and GSTIN (`27BJXPM9596E1Z5`).
  - Chemist GSTIN (e.g. `09AKMPG4181E1Z4`) and PAN.

### 5.2 AI Invoice OCR Scanner
Located in [`src/app/(barcode)/ocr-scan/`](file:///d:/Safe-Health/barcode-inventory/src/app/(barcode)/ocr-scan/) & [`src/app/api/ocr/route.ts`](file:///d:/Safe-Health/barcode-inventory/src/app/api/ocr/route.ts):
- Warehouse staff can take a photo or upload a PDF of incoming paper bills (e.g. Invoice `#54082`).
- The OCR extraction engine automatically parses:
  - **Invoice Header:** Invoice Number, Date, Due Date, Party Code (`14083`), Client Name (`YUG PHARMA`), GSTIN, PAN, DL Numbers.
  - **Sales Representative Code:** Automatically links S.Man Code (`676`) and Salesman Name (`INDOCHEM AGE`).
  - **Item Details:** Manufacturer (`INDOCHEM`), Description (`INDCLAV-625`), Packing (`10 TAB`), Batch Number (`21541165`), Expiry Date (`11/23`), HSN Code (`3004`), Quantity, Rate, and Tax Breakdown.

### 5.3 Warehouse Barcode Dispatch Verification
Located in [`src/app/(barcode)/dispatch/`](file:///d:/Safe-Health/barcode-inventory/src/app/(barcode)/dispatch/) & [`src/app/api/dispatch/route.ts`](file:///d:/Safe-Health/barcode-inventory/src/app/api/dispatch/route.ts):
- Outbound packages are verified before handover to delivery personnel.
- Staff scan the invoice barcode, followed by physical unit barcodes on the medicine strips/boxes.
- The system confirms:
  1. Does this barcode match the products listed on this invoice?
  2. Is this unit barcode already allocated elsewhere?
- Once verified, status updates to `DISPATCHED` and assigns the territory sales representative.

---

## 6. Module 5: Sales Person Mobile App & Field Delivery Integration

### 6.1 Purpose & Mobile-First Design
Located in [`src/app/(barcode)/sales-app/`](file:///d:/Safe-Health/barcode-inventory/src/app/(barcode)/sales-app/) & [`src/app/api/sales-app/deliver/route.ts`](file:///d:/Safe-Health/barcode-inventory/src/app/api/sales-app/deliver/route.ts):
Designed specifically for smartphones used by field sales representatives (S.Man) while visiting chemists and retail pharmacies in their territory.

```
┌────────────────────────────────────────────────────────┐
│             SALES PERSON MOBILE APP                    │
│                                                        │
│  Representative: Mohan Sir (S.Man 676)                 │
│  Territory: Agra, Fountain & Hing Ki Mandi             │
├────────────────────────────────────────────────────────┤
│  TODAY'S DELIVERIES                                    │
│  • Invoice #54082 - YUG PHARMA (₹1,56,870)             │
│    [Drop-off] [Call Chemist] [Collect Payment]         │
│                                                        │
│  FIELD ACTIONS                                         │
│  ✓ Confirm Handover & Signature                        │
│  ✓ Record Cheque / Cash / UPI Payment                  │
│  ✓ Instant Outstanding Balance Reduction               │
└────────────────────────────────────────────────────────┘
```

### 6.2 Key Features of the Sales Person App
1. **Territory & S.Man Authentication:** Automatically filters orders and invoices assigned to the active sales representative code (e.g. S.Man `676`, `102`, `412`, `508`).
2. **Chemist Route & Call Assistance:** Quick dial button for chemist phone numbers and one-tap location addresses.
3. **Delivery Confirmation:** Representative taps **Deliver**, records receiver name, phone, and optional delivery notes.
4. **On-Spot Payment Collection:**
   - Field representative collects payment immediately upon handover:
     - **Cheque:** Inputs cheque reference number, bank name, and cheque date.
     - **Cash:** Inputs cash amount collected.
     - **UPI / NEFT:** Inputs transaction reference ID.
5. **Real-Time Ledger Synchronization:**
   - When a collection is recorded in the mobile app, the backend automatically updates `DispatchEntry`, creates or updates `PaymentCollection`, and subtracts the collected amount from `Customer.currentOutstanding`.

---

## 7. Module 6: Daily Runsheet & Logistics Notebook

### 7.1 The 3-Stage Daily Workflow
Located in [`src/app/(barcode)/runsheet/`](file:///d:/Safe-Health/barcode-inventory/src/app/(barcode)/runsheet/) & [`src/app/api/runsheet/route.ts`](file:///d:/Safe-Health/barcode-inventory/src/app/api/runsheet/route.ts):
Replaces paper registers with an automated digital notebook tracking morning depot handover through evening cash settlement.

```
[1. Morning Handover] ──────► [2. In-Field Deliveries] ──────► [3. Evening Settlement]
 Scan invoices into bag         Chemist drop-off & spot          Reconcile Cash, Cheques
 with barcode verification      collection via Mobile App        & UPI; close runsheet
```

1. **Stage 1: Morning Handover (Bag Assembly)**
   - The field sales representative reports to the depot.
   - Warehouse staff scan invoice barcodes into the representative's daily bag.
   - Generates a morning handover summary detailing total assigned invoices and total handover value.
2. **Stage 2: In-Field Execution**
   - The sales representative performs deliveries using the [Sales Person Mobile App](file:///d:/Safe-Health/barcode-inventory/src/app/%28barcode%29/sales-app/page.tsx).
3. **Stage 3: Evening Settlement & Close**
   - Representative returns to the office.
   - Accounts clerk reviews:
     - Total delivered invoices vs. pending drop-offs.
     - Cash collected vs. Cheques (with bank name & cheque #) vs. UPI receipts.
   - Clicking **Settle & Close Runsheet** locks the day’s log and saves an audit entry.

---

## 8. Module 7: Payment Collections & Chemist Party Ledger

### 8.1 Payment Collections Console
Located in [`src/app/(barcode)/collections/`](file:///d:/Safe-Health/barcode-inventory/src/app/(barcode)/collections/) & [`src/app/api/collections/route.ts`](file:///d:/Safe-Health/barcode-inventory/src/app/api/collections/route.ts):
- Tracks credit term aging, payment deadlines, and overdue accounts.
- **Collection Statuses:**
  - `PENDING`: Goods delivered, payment pending.
  - `PARTIAL`: Partial installment received.
  - `COLLECTED`: Fully settled.
  - `OVERDUE`: Past agreed credit term (e.g. 7, 14, or 21 days).
- **Payment Modes:** `CHEQUE`, `CASH`, `UPI_NEFT`, `RTGS`.

### 8.2 Chemist Party Ledger
Located in [`src/app/(barcode)/partners/`](file:///d:/Safe-Health/barcode-inventory/src/app/(barcode)/partners/):
- Central directory of all retail chemists (`Customer`) and medicine manufacturers (`Supplier`).
- Stores Drug License numbers (`dlNumber`), GSTIN, Assigned Salesman (`salesmanCode`), credit limit, and current balance.
- Chronological statement of accounts: Invoices billed, payments made, goods returned, and net outstanding balance.

---

## 9. Module 8: User Administration & Role-Based Access Control (RBAC)

Located in [`src/app/(barcode)/users/`](file:///d:/Safe-Health/barcode-inventory/src/app/(barcode)/users/) & [`src/lib/permissions.ts`](file:///d:/Safe-Health/barcode-inventory/src/lib/permissions.ts):
- **System Roles:**
  - `SUPER_ADMIN`: Master privileges across all catalog, billing, and system settings.
  - `ADMIN`: Operational management (all features except user deletion).
  - `STAFF`: Inventory receiving, dispatch scanning, and barcode printing.
  - `ACCOUNTANT`: Billing, ledger, tax invoices, and collection settlement.
  - `CUSTOM`: Configurable per-user permissions.
- **Security Safeguards:**
  - 12-hour session timeout with auto-logout.
  - Real-time permission gate on every sensitive API route.
  - Full audit logging on mutations via `AuditLog`.

---

## 10. Comprehensive Page, Function & API Reference Directory

### 10.1 Web Application Pages

| URL Route | File Path | Primary Purpose |
| :--- | :--- | :--- |
| `/` | `src/app/page.tsx` | Main Executive Dashboard with high-level KPI cards, sales analytics, and quick links. |
| `/barcodes` | `src/app/(barcode)/barcodes/page.tsx` | Serial Unit Barcode manager: view all generated barcodes, filter by status, search, and launch thermal printer. |
| `/inventory` | `src/app/(barcode)/inventory/page.tsx` | Central inventory hub: active stock, transactions ledger, POs, order returns, scrap waste, and suppliers. |
| `/orders` | `src/app/(barcode)/orders/page.tsx` | Wholesale order ledger, tax invoice generation, customer quotes, and enquiries. |
| `/dispatch` | `src/app/(barcode)/dispatch/page.tsx` | Warehouse dispatch verification station: scan unit barcodes to verify and fulfill outbound deliveries. |
| `/runsheet` | `src/app/(barcode)/runsheet/page.tsx` | Daily Runsheet Notebook: Morning invoice handover, field tracking, and evening cash/cheque reconciliation. |
| `/sales-app` | `src/app/(barcode)/sales-app/page.tsx` | Mobile web portal for field sales representatives: route deliveries, chemist call list, and spot payment logging. |
| `/party-portal` | `src/app/(barcode)/party-portal/page.tsx` | Chemist self-service ordering: live catalog, instant reorders, ledger balance, and invoice archive. |
| `/ocr-scan` | `src/app/(barcode)/ocr-scan/page.tsx` | Automated invoice OCR bill scanner: extracts MANF, S.Man code (676), chemist details, batches, and tax. |
| `/collections` | `src/app/(barcode)/collections/page.tsx` | Payment recovery console: overdue alerts, cheque logging, NEFT references, and salesman targets. |
| `/scan` | `src/app/(barcode)/scan/page.tsx` | POS Counter Scan & Quick Checkout: hardware scanner support, retail sale, thermal receipt & A4 invoice. |
| `/products` | `src/app/(barcode)/products/page.tsx` | Master product catalog: manage medicines, variants, chemical composition, HSN, MRP, and rates. |
| `/partners` | `src/app/(barcode)/partners/page.tsx` | Partner ledger: retail chemist directory, supplier details, credit limits, and drug license compliance. |
| `/reports` | `src/app/(barcode)/reports/page.tsx` | Financial and audit reporting: inventory valuation, tax breakdown, and revenue statistics. |
| `/users` | `src/app/(barcode)/users/page.tsx` | User management and RBAC permissions matrix. |
| `/guide` | `src/app/(barcode)/guide/page.tsx` | In-app visual hardware and thermal printer setup documentation. |
| `/missing` | `src/app/(barcode)/missing/page.tsx` | Utility page to identify variants lacking barcodes and trigger bulk generation. |
| `/website` | `src/app/(barcode)/website/page.tsx` | Storefront preview of B2B catalog items enabled for online display. |

---

### 10.2 Backend API Routes

| Endpoint | HTTP Method | Implementation File | Purpose & Actions |
| :--- | :---: | :--- | :--- |
| `/api/barcodes/generate` | `POST` | `src/app/api/barcodes/generate/route.ts` | Generates $N$ sequential unit barcodes for a variant and syncs inventory. |
| `/api/barcodes/lookup` | `GET` | `src/app/api/barcodes/lookup/route.ts` | Resolves scanned barcode string to unit record, SKU, product, and stock. |
| `/api/barcodes/print` | `POST` | `src/app/api/barcodes/print/route.ts` | Creates a `PrintJob`, logs audit entry, and returns thermal label format parameters. |
| `/api/barcodes/bulk-generate` | `POST` | `src/app/api/barcodes/bulk-generate/route.ts` | Scans all variants missing unit barcodes and generates them in bulk. |
| `/api/inventory` | `GET`, `POST`| `src/app/api/inventory/route.ts` | Fetches stock levels or performs stock adjustments (`RECEIVE`, `DAMAGE`, `ADJUST`). |
| `/api/inventory/po` | `GET`, `POST`| `src/app/api/inventory/po/route.ts` | Manages purchase orders and supplier procurement intake. |
| `/api/inventory/waste` | `POST` | `src/app/api/inventory/waste/route.ts` | Records damaged or expired stock waste. |
| `/api/orders` | `POST` | `src/app/api/orders/route.ts` | Creates wholesale sale orders and deducts stock in an atomic transaction. |
| `/api/party-orders` | `POST` | `src/app/api/party-orders/route.ts` | Receives orders from chemist portal, creates invoice scan, dispatch, and collection records. |
| `/api/scan/checkout` | `POST` | `src/app/api/scan/checkout/route.ts` | Marks scanned unit barcodes as `SOLD`, deducts stock, and creates POS transaction. |
| `/api/dispatch` | `GET`, `POST`, `PATCH` | `src/app/api/dispatch/route.ts` | Creates dispatch records, updates delivery person, and verifies scanned barcodes. |
| `/api/runsheet` | `GET`, `POST`, `PATCH` | `src/app/api/runsheet/route.ts` | Manages daily runsheets: morning handover, bags, and evening settlement. |
| `/api/sales-app/deliver`| `POST` | `src/app/api/sales-app/deliver/route.ts` | Field sales app delivery confirmation and spot payment collection. |
| `/api/ocr` | `GET`, `POST`| `src/app/api/ocr/route.ts` | Extracts structured pharmaceutical invoice data from scanned bill images. |
| `/api/collections` | `GET`, `POST`| `src/app/api/collections/route.ts` | Lists payment collections and records cheque, cash, or UPI payments. |
| `/api/returns` | `GET`, `POST`| `src/app/api/returns/route.ts` | Handles order returns, creates credit notes, and adjusts customer balance. |
| `/api/users` | `GET`, `POST`, `PATCH` | `src/app/api/users/route.ts` | Manages staff accounts, roles, and granular permission assignments. |
| `/api/users/salesmen` | `GET` | `src/app/api/users/salesmen/route.ts` | Returns active field sales representatives (e.g. S.Man 676). |

---

### 10.3 Core Library Utilities

| Library File | Key Exported Functions | Functional Purpose |
| :--- | :--- | :--- |
| [`src/lib/barcode.ts`](file:///d:/Safe-Health/barcode-inventory/src/lib/barcode.ts) | `generateSingleBarcodeString`, `generateUnitBarcodesForVariant`, `buildSku` | Core barcode generation engine, serial numbering, and inventory sync. |
| [`src/lib/dashboardAnalytics.ts`](file:///d:/Safe-Health/barcode-inventory/src/lib/dashboardAnalytics.ts) | `getDashboardAnalytics` | Aggregates all live statistics, territory-wise S.Man breakdown, revenue, and alerts. |
| [`src/lib/label-sizes.ts`](file:///d:/Safe-Health/barcode-inventory/src/lib/label-sizes.ts) | `LABEL_SIZES`, `getLabelSize` | Defines standard thermal printer label presets (50x30mm, etc.). |
| [`src/lib/permissions.ts`](file:///d:/Safe-Health/barcode-inventory/src/lib/permissions.ts) | `ALL_PERMISSIONS`, `hasPermission`, `getDefaultPermissionsForRole` | System RBAC permission matrix and validation guards. |
| [`src/lib/audit.ts`](file:///d:/Safe-Health/barcode-inventory/src/lib/audit.ts) | `writeAudit` | Writes immutable system audit logs for critical actions. |
