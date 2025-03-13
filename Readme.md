# Book Library API

This is a Book Library API project that allows users to manage a collection of books. The API provides endpoints for creating, reading, updating, and deleting books.

## Setup

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/book-library-api.git
    cd book-library-api
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add the following environment variables:
    ```env
    MONGODB_URI=mongodb://localhost:27017/booklibrary
    PORT=3000
    ```

4. Start the MongoDB server:
    ```bash
    mongod
    ```

5. Run the application:
    ```bash
    npm start
    ```

## Workers

### Book Worker

The Book Worker is responsible for processing book-related tasks such as adding new books, updating book information, and deleting books.

To run the Book Worker:
```bash
npm run worker:book
```

### Notification Worker

The Notification Worker handles sending notifications to users about their book activities.

To run the Notification Worker:
```bash
npm run worker:notification
```

## Seeders

Seeders are used to populate the database with initial data.

### Running Seeders

To run the seeders and populate the database with initial data:
```bash
npm run seed
```

## API Endpoints

- `GET /books` - Retrieve a list of all books
- `POST /books` - Add a new book
- `GET /books/:id` - Retrieve a specific book by ID
- `PUT /books/:id` - Update a specific book by ID
- `DELETE /books/:id` - Delete a specific book by ID

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Contact

For any questions or inquiries, please contact [yourname@example.com](mailto:yourname@example.com).