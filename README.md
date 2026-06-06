# VendorBridge

Procurement & Vendor Management ERP — a centralized platform to digitize and streamline procurement operations including vendor management, RFQs, quotations, approvals, purchase orders, and invoice generation.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, React Router v6, Tailwind CSS v3, JavaScript (ES6+) |
| **Backend** | Java 21, Spring Boot 3, Spring Security, Spring Data JPA |
| **Authentication** | JWT (JSON Web Tokens) |
| **Database** | MySQL 8.0+ |
| **PDF Generation** | iText 7 |
| **Email** | Spring Boot Mail (JavaMailSender) |
| **Build Tools** | Vite (frontend), Maven (backend) |

---

## Team Responsibilities

| Member | Responsibilities |
|--------|-----------------|
| **Vrushti** | Database Design + Admin Module |
| **Priyanka** | Procurement Officer + Vendor Module |
| **Nisarg** | Frontend + Manager/Approver Module |

---

## ER Diagram

```mermaid
erDiagram
    USERS ||--o{ ACTIVITY_LOGS : generates
    USERS ||--o{ RFQ : creates
    USERS ||--o{ APPROVAL : approves
    USERS ||--o{ NOTIFICATIONS : receives

    VENDORS ||--o{ VENDOR_CATEGORIES : belongs_to
    VENDORS ||--o{ RFQ_VENDORS : invited_to
    VENDORS ||--o{ QUOTATIONS : submits

    CATEGORIES }o--o{ VENDOR_CATEGORIES : maps

    RFQ ||--o{ RFQ_ITEMS : contains
    RFQ ||--o{ RFQ_VENDORS : invites
    RFQ ||--o{ QUOTATIONS : receives

    QUOTATIONS ||--o{ QUOTATION_ITEMS : contains
    QUOTATIONS ||--o{ APPROVAL : triggers

    APPROVAL ||--o| PURCHASE_ORDERS : generates

    PURCHASE_ORDERS ||--o{ PO_ITEMS : contains
    PURCHASE_ORDERS ||--o| INVOICES : generates

    INVOICES ||--o{ INVOICE_ITEMS : contains

    USERS {
        BIGINT id PK
        VARCHAR first_name
        VARCHAR last_name
        VARCHAR email UK
        VARCHAR password
        VARCHAR phone
        ENUM role "ADMIN | PROCUREMENT_OFFICER | MANAGER | VENDOR"
        VARCHAR country
        TEXT additional_info
        BOOLEAN is_active
        TIMESTAMP created_at
    }

    VENDORS {
        BIGINT id PK
        BIGINT user_id FK
        VARCHAR company_name
        VARCHAR contact_person
        VARCHAR email
        VARCHAR phone
        VARCHAR gst_number
        TEXT address
        VARCHAR city
        VARCHAR state
        VARCHAR country
        ENUM status "ACTIVE | INACTIVE | PENDING | BLOCKED"
        DECIMAL rating
        TIMESTAMP created_at
    }

    CATEGORIES {
        BIGINT id PK
        VARCHAR name UK
        TEXT description
    }

    VENDOR_CATEGORIES {
        BIGINT vendor_id FK
        BIGINT category_id FK
    }

    RFQ {
        BIGINT id PK
        VARCHAR rfq_number UK
        VARCHAR title
        TEXT description
        BIGINT category_id FK
        BIGINT created_by FK
        ENUM status "DRAFT | PUBLISHED | CLOSED | CANCELLED"
        DATE deadline
        DECIMAL budget
        TIMESTAMP created_at
    }

    RFQ_ITEMS {
        BIGINT id PK
        BIGINT rfq_id FK
        VARCHAR item_name
        TEXT description
        INT quantity
        VARCHAR unit
        DECIMAL estimated_price
    }

    RFQ_VENDORS {
        BIGINT id PK
        BIGINT rfq_id FK
        BIGINT vendor_id FK
        ENUM status "INVITED | VIEWED | QUOTED | DECLINED"
        TIMESTAMP invited_at
    }

    QUOTATIONS {
        BIGINT id PK
        BIGINT rfq_id FK
        BIGINT vendor_id FK
        VARCHAR quotation_number UK
        DECIMAL subtotal
        DECIMAL tax_percentage
        DECIMAL tax_amount
        DECIMAL discount_percentage
        DECIMAL discount_amount
        DECIMAL grand_total
        INT delivery_days
        TEXT notes
        INT validity_days
        ENUM status "DRAFT | SUBMITTED | ACCEPTED | REJECTED"
        TIMESTAMP submitted_at
        TIMESTAMP created_at
    }

    QUOTATION_ITEMS {
        BIGINT id PK
        BIGINT quotation_id FK
        BIGINT rfq_item_id FK
        VARCHAR item_name
        INT quantity
        DECIMAL unit_price
        DECIMAL total_price
    }

    APPROVAL {
        BIGINT id PK
        BIGINT rfq_id FK
        BIGINT quotation_id FK
        BIGINT requested_by FK
        BIGINT approved_by FK
        ENUM status "PENDING | APPROVED | REJECTED"
        TEXT remarks
        INT step_order
        TIMESTAMP requested_at
        TIMESTAMP resolved_at
    }

    PURCHASE_ORDERS {
        BIGINT id PK
        VARCHAR po_number UK
        BIGINT rfq_id FK
        BIGINT quotation_id FK
        BIGINT vendor_id FK
        BIGINT created_by FK
        DECIMAL subtotal
        DECIMAL tax_amount
        DECIMAL grand_total
        ENUM status "DRAFT | ISSUED | ACKNOWLEDGED | COMPLETED | CANCELLED"
        DATE po_date
        DATE delivery_date
        TIMESTAMP created_at
    }

    PO_ITEMS {
        BIGINT id PK
        BIGINT po_id FK
        VARCHAR item_name
        INT quantity
        DECIMAL unit_price
        DECIMAL total_price
    }

    INVOICES {
        BIGINT id PK
        VARCHAR invoice_number UK
        BIGINT po_id FK
        BIGINT vendor_id FK
        BIGINT created_by FK
        DECIMAL subtotal
        DECIMAL sgst
        DECIMAL cgst
        DECIMAL igst
        DECIMAL grand_total
        ENUM status "DRAFT | PENDING_PAYMENT | PAID | CANCELLED"
        DATE invoice_date
        DATE due_date
        ENUM payment_status "UNPAID | PARTIAL | PAID"
        TIMESTAMP created_at
    }

    INVOICE_ITEMS {
        BIGINT id PK
        BIGINT invoice_id FK
        VARCHAR item_name
        INT quantity
        DECIMAL unit_price
        DECIMAL total_price
    }

    ACTIVITY_LOGS {
        BIGINT id PK
        BIGINT user_id FK
        ENUM entity_type "RFQ | QUOTATION | APPROVAL | PO | INVOICE | VENDOR | USER"
        BIGINT entity_id
        VARCHAR action
        TEXT description
        TIMESTAMP created_at
    }

    NOTIFICATIONS {
        BIGINT id PK
        BIGINT user_id FK
        VARCHAR title
        TEXT message
        ENUM type "RFQ | APPROVAL | INVOICE | GENERAL"
        BOOLEAN is_read
        VARCHAR link
        TIMESTAMP created_at
    }
```
