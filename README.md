# 🌾 GramWatch — Rural Governance Platform

![GramWatch Thumbnail](https://images.unsplash.com/photo-1594398901394-4e34939a02e0?w=1200&h=400&fit=crop) *(Illustrative purposes)*

**GramWatch** is a community-driven rural grievance reporting platform crafted for India. It bridges the gap between citizens (villagers) and administrative authorities (Panchayats, District administrators) by providing a transparent, efficient, and traceable workflow for reporting, validating, and resolving community issues.

## 🚀 Key Features

- **Role-Based Access System**: Separate interfaces and permissions for Villagers, Panchayat Authorities, and District Authorities.
- **Hierarchical Location Modeling**: Organized precisely by State ➡️ District ➡️ Block ➡️ Panchayat ➡️ Village.
- **Community Validation Workflow**: Issues reported by individuals gain traction through community support/validations before being officially escalated.
- **Grievance Lifecycle Tracking**: Full timeline tracking of issues from `Reported` ➡ `Validated` ➡ `Panchayat Review` ➡ `Escalated to District` ➡ `Under Review` ➡ `Resolved`.
- **Categorized Reporting**: Granular grievance categories including Roads, Water, Electricity, Waste, Health, Environment, Education, and Safety.
- **Authorities Dashboard**: A dedicated panel for authorities to review incoming issues, leave remarks, update statuses, and escalate unresolved problems.
- **Responsive & Modern UI**: A clean, accessible, and fast interface built with React, Vite, and detailed vanilla CSS.

## 🛠️ Technology Stack

- **Frontend**: [React 19](https://react.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Bundler**: [Vite 8](https://vitejs.dev/)
- **Icons**: [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)
- **Styling**: Vanilla CSS (Responsive, Modern, Custom Design System)

## 📦 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (v16.0 or higher recommended).

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shek-xbhi/D2_23BCE1263_ABHISHEK.S.git
   cd D2_23BCE1263_ABHISHEK.S/Downloads/GramGrievance
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   Open your browser and navigate to `http://localhost:5173/`

## 🔐 Demo Credentials

The application uses mock data for demonstration. You can log in using any of the following pre-configured mock users:

| Role | Email |
| :--- | :--- |
| **Villager** | `ramesh@gram.in` |
| **Villager** | `priya@gram.in` |
| **Panchayat Authority** | `murugan@panchayat.gov.in` |
| **District Authority** | `lakshmi@district.gov.in` |

*(Note: Passwords are not strictly enforced in the demo. Simply use an active email from above to log in and interact with the designated role's features).*

## 🏗️ Project Structure

```text
src/
├── assets/           # Static assets, images, icons
├── components/       # Reusable UI components (Sidebar, Header, IssueCard, Layout, etc.)
├── context/          # React Context providers (AuthContext, AppContext)
├── data/             # Mock database (Users, Issues, Location hierarchy, Categories)
├── pages/            # Core application views (Dashboard, ReportIssue, AuthorityPanel, etc.)
├── styles/           # Global and modular CSS stylesheets
├── utils/            # Helper functions (Status utility constants)
├── App.jsx           # Main Application Router
└── main.jsx          # React Application Entry Point
```

## 📜 Academic Reference

This project was developed as an academic implementation under project/course referencing **23BCE1263**. It explores core Software Engineering concepts, including:
- **Architecture & SRS Documentation** (Week-1)
- **Agile Methodology** (Week-2)
- **UML Modeling**: Class & Use Case diagrams (Week-3), Activity & Sequence diagrams (Week-4)

---
*Built with passion to empower rural communities through digital governance.*
