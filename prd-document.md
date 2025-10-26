# 🩺 **Product Document — Home Dialysis Material Control App**

## 📘 1. Summary

A simple and intuitive mobile application to **manage the stock of consumable materials for home dialysis** (hemodialysis or peritoneal).

Designed for elderly users or caregivers without technical experience, with a **user-friendly touch interface**, large buttons, and clear messages.

The system automatically calculates the **stock duration**, indicates when to place new orders, and generates a **personalized Excel file** formatted according to the supplier’s requirements.

---

## 🎯 2. Main Objectives

- Make it easier for dialysis patients to **track their consumable materials** at home.
- Prevent running out of materials by ensuring **at least 7 sessions** of reserve stock.
- Prevent overstocking (maximum **20 sessions**).
- Simplify the **ordering process** with the supplier through an **auto-formatted Excel file**.
- Reduce errors and forgetfulness through **guided forms** and visual alerts.

---

## 👤 3. User Profile

- **Home dialysis patient** (likely elderly).
- May have mild visual or cognitive impairments.
- Uses a **mobile phone or tablet** to record and review inventory.
- Does not want to deal with spreadsheets or formulas.

---

## 🧩 5. Key Features

### 5.1. **Inventory View**

- List of all materials.
- Each item shows:
    - Name, current quantity, and unit.
    - Message: “You have enough for X sessions.”
    - Color indicator:
        - 🟢 Green: ≥ 7 sessions.
        - 🔴 Red: < 7 sessions.

### 5.2. **Item Editing**

- Each material has its own screen with:
    - Buttons “+1”, “–1”, and “Edit quantity”.
- Validations:
    - Negative quantities are not allowed.
    - Visual confirmation (vibration, alert, color change).

### 5.3. **Inventory Review**

- Checklist mode to review **the entire inventory in order**.
- One material displayed per screen:
    - Photo, name, and usage per session.
    - Field to enter the current stock.
- Upon completion:
    - A summary is displayed.
    - Automatically calculates which items need to be ordered.

### 5.4. **Order Generation**

- “Generate Order” button → automatically fills a table with:
    - Code, description, quantity, unit, and notes.
- Only items with `A_pedir_unidades > 0` are included.
- Allows:
    - Excel file download.

### 5.4. **Authentication**

- Login with Google — a dedicated Google login button.
- Keeps a record of all changes and which user made them.
- When an “inventory review mode” is launched, a log is saved to verify who performed it, which values were entered, and when.

Storage will be handled in **Supabase**.

---

### 5.5. **Technical Requirements**

- React framework
- Vite and Vitest
- Shadcn components