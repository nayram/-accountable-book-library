# Book Library API

A backend system for managing a library’s collection of books, allowing users to search, reserve, and borrow titles. This API supports CRUD operations on references, books, reservations, users, and wallets, and integrates with background workers for notifications.

## Setup

### Prerequisites

- **Node.js** (v20+)
- **Yarn**
- **Docker** (for local MongoDB and Redis)

### Installation

1. **Clone the repo:**

   ```bash
   git clone https://github.com/nayram/-accountable-book-library.git
   cd book-library-api
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   ```

3. **Start Docker services:**

   ```bash
   docker compose up -d
   ```

4. **Run the API:**

   ```bash
   yarn dev
   ```

> All configuration (including environment variables) is managed via the [`/config`](./config/default.json) folder.

## Core Modules

- **References:** Manage book metadata (title, author, publisher, publication year, externalReferenceId).
- **Books:** Physical copies of references. Each has a unique barcode and status (`available`, `borrowed`, `reserved`, `purchased`).
- **Reservations:** Tracks the loan lifecycle (reserved, borrowed, returned, closed) and fees.
- **Users:** Basic user details.
- **Wallet:** Manages user balances and fees.

## Seeders

Sample data is provided in the `migrations/seeders` folder.

- **References:**  
  Place the CSV file (`books_sample_technical_challenge.csv`) in `migrations/seeders/references` and run:
  
  ```bash
  yarn run seed:import-references
  ```

- **Books:**  
  Generate 4 books per reference:
  
  ```bash
  yarn run seed:import-books
  ```

- **Users:**  
  
  ```bash
  yarn run seed:import-users
  ```

- **Reservations (for worker testing):**  
  
  ```bash
  yarn run seed:import-late-returns-and-up-coming
  ```

## API Endpoints

All endpoints are prefixed with `/api`.

### References

- **Search:** `GET /references/search`  
  Query params: `title`, `author`, `publicationYear`, `cursor`, `limit`

- **Create:** `POST /references`  
  JSON body: `title, author, externalReferenceId, publicationYear, publisher, price`

- **Get Single:** `GET /references/:id`

- **Get Books for a Reference:** `GET /references/:id/books`

- **Delete (soft):** `DELETE /references/:id`

### Books

- **Create:** `POST /books`  
  JSON body: `referenceId, status, barcode`

- **Get Single:** `GET /books/:id`

### Reservations

- **Create (Reserve):** `POST /reservations`  
  Headers: `Authorization: userId`  
  JSON body: `bookId`

- **Get Single:** `GET /reservations/:id`

- **Borrow:** `POST /reservations/:id/borrow`  
  Headers: `Authorization: userId`  
  JSON body: `dueAt`

- **Return:** `POST /reservations/:id/return`  
  Headers: `Authorization: userId`  
  JSON body: `returnedAt`

- **User History:** `GET /users/me/reservations`  
  Header: `Authorization: userId`

> **Tip:** You can test the API endpoints by importing the [Insomnia JSON document](./Insomnia_2025-03-13.json) into Insomnia.

## Workers

There are three background workers that run separately. Each worker uses Redis and BullMQ; the Email Sender Service additionally uses SendGrid.  
> **Note:** To test the Email Sender Service with valid emails, update the `emailEnv` value in `/config/default.json` to `"live"` and ensure a valid SendGrid API key is provided.

### Email Sender Service

- **Dependencies:**  
  - [Redis](https://www.npmjs.com/package/redis)  
  - [BullMQ](https://github.com/taskforcesh/bullmq)  
  - [SendGrid](https://www.npmjs.com/package/@sendgrid/mail)

- **Purpose:** Consumes email reminder jobs from a queue and sends notifications.

- **Start the service:**

  ```bash
  yarn run workers:email-sender-service
  ```

### Process Late Returns

- **Dependencies:**  
  - [Redis](https://www.npmjs.com/package/redis)  
  - [BullMQ](https://github.com/taskforcesh/bullmq)

- **Purpose:** Fetches reservations that are 7 days past due and queues email reminders for late returns.

- **Start the worker:**

  ```bash
  yarn run workers:process-late-returns
  ```

### Process Upcoming Reservations

- **Dependencies:**  
  - [Redis](https://www.npmjs.com/package/redis)  
  - [BullMQ](https://github.com/taskforcesh/bullmq)

- **Purpose:** Fetches reservations due in 2 days and queues email reminders for upcoming due dates.

- **Start the worker:**

  ```bash
  yarn run workers:process-up-coming-reservations
  ```

> To test the workers, run the seeders in the following order:
> 
> ```bash
> yarn seed:import-references
> yarn seed:import-books
> yarn seed:import-users
> yarn seed:import-late-returns-and-up-coming
> ```

## Tests

- **Test File Naming Conventions:**  
  - **Unit tests:** Files end with `.spec.ts`  
  - **Integration tests:** Files end with `.test.ts`  
  - **End-to-end tests:** Files end with `.e2e.test.ts`

- **Run Tests:**

  ```bash
  yarn test
  ```

## Linting

To check code style and enforce linting rules:

```bash
yarn lint
```

## License

MIT
