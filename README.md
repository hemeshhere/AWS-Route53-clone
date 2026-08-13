# AWS Route 53 Clone

A full-stack web application that replicates the core functionality and user interface of Amazon Web Services (AWS) Route 53. This project allows users to manage domain name systems (DNS), create hosted zones, and configure routing policies through a secure, authenticated dashboard.

## 🚀 Features

- **Custom Authentication:** Secure JWT-based session management.
- **Hosted Zones Management:** Complete CRUD operations for public and private hosted zones.
- **DNS Records Configuration:** Support for standard DNS records (A, AAAA, CNAME, TXT) with customizable TTL and routing policies.
- **AWS-Style Dashboard:** A responsive, high-fidelity replica of the AWS console interface.
- **RESTful API:** Fully decoupled backend architecture with strict schema validation.

## 💻 Tech Stack

**Frontend:**
- Next.js (React Framework)
- Tailwind CSS (Styling)
- Lucide React (Icons)

**Backend:**
- FastAPI (Python Web Framework)
- SQLite (Relational Database)
- SQLAlchemy (ORM)
- Pydantic (Data Validation)

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [Python](https://www.python.org/downloads/) (3.10 or higher)
- [Git](https://git-scm.com/)

## ⚙️ Installation & Setup

Follow these steps to get the development environment running on your local machine.

### 1. Clone the Repository
```bash
git clone [https://github.com/hemeshhere/AWS-Route53-Clone.git](https://github.com/hemeshhere/AWS-Route53-Clone.git)
cd "AWS-Route53-Clone"



 -----For Backend Setup-----
cd Backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install the required Python packages
pip install fastapi uvicorn sqlalchemy pydantic passlib bcrypt python-jose python-multipart


----- For Frontend Setup -----
cd frontend
npm install
```

--- Running Backend ---
python -m uvicorn app.main:app --reload


--- Running Frontend ---
npm run dev



--- 💡 How to Use ---

Open your browser and navigate to http://localhost:3000.

Log in using the default seeded credentials:

Email: admin@route53.com

Password: password123

Navigate to Hosted Zones in the sidebar to start creating and managing domains and DNS records.


--- 👤 Author ---
Hemesh Raj


--- Deployed Link ---
https://aws-route53-clone-omega.vercel.app/

