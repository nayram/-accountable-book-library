# Book Library API

This is a Book Library API project that allows users to manage a collection of books. The API provides endpoints for creating, reading, updating, and deleting books.

## Setup

### Prerequisites

- Node.js (v20 or higher)
- yarn
- Docker
- MongoDB (not required if docker is installed)
- Redis (not required if docker is installed)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/nayram/-accountable-book-library.git
   cd book-library-api
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Run the docker compose:
   ```bash
   docker compose up -d
   ```

## Core Modules

- References
- Books
- Reservations
- Users
- Wallet

### References

This is the definition for a book represented by it's title, author, publisher, publicationYear and it externalReferenceId (This is mapped to the id in the CSV file). The externalReferenceId could be any alphanumeric value, eg, IBAN.

Domain Model

```js
id: ReferenceId;
externalReferenceId: ExternalReferenceId;
title: Title;
publicationYear: PublicationYear;
author: Author;
publisher: Publisher;
price: Price;
softDelete: boolean;
createdAt: Date;
updatedAt: Date;
```

### Books

A book is the physical copy of the reference. This is what a libray can loan out and user can reserve. A unique id is it's barcode

Model

```js
id: BookId;
referenceId: ReferenceId;
barcode: Barcode;
status: BookStatus('available', 'borrowed', 'reserved', 'purchased');
createdAt: Date;
updatedAt: Date;
```

### Reservations

This is representative of the borrowing and reservation functionality. It could be seen as the load facility given to users.

Domain Model

```js
id: ReservationId;
userId: UserId;
bookId: BookId;
status: ReservationStatus('reserved', 'borrowed', 'returned', 'closed');
reservationFee: Money;
lateFee: LateFee;
referenceId: ReferenceId;
reservedAt: Date;
borrowedAt: Date;
returnedAt: ReservationReturnAt;
dueAt: ReservationDueAt;
```

### Users

Domain Model

```js
id: UserId;
name: Name;
email: UserEmail;
createdAt: Date;
updatedAt: Date;
```

### Wallet

Every user has access to a wallet.

Domain Model

```js
id: WalletId;
userId: UserId;
balance: Balance;
createdAt: Date;
updatedAt: Date;
```

## Seeders

Sample data is included in the `migrations/seeders` folder for `books`, `references` and `users`

### References

To import the references withing the provided csv file,

1. Make sure the csv file is in the `migrations/seeders/references` folder.
2. Confirm that the name of the file is `books_sample_technical_challenge.csv`
3. Make the mongodb instance is running in docker
4. Open the terminal and run the command `yarn run seed:import-references`

### Books

To create data for each reference run the command `yarn run seed:import-books`. 4 books are created for each reference.

### Users

To import sample user data run the command `yarn seed:import-users`. You can view the sample user data [here](/migrations/seeders/users/users-collection.ts)

## API

To test the api, you can import the json file [here](/Insomnia_2025-03-13.json)

all endpoints are prefixed by `/api`

All environmental variables neccessary to run the API can be found in the [`/config`](/config/default.json) folder. The library [config](https://www.npmjs.com/package/config) is used to manage the environmental variables.

Use the command `yarn dev` to start the api (Make sure you mongodb running either in docker using docker-compose or on your local machine).

### References

#### `/references/search [GET]`

This endpoint allows users to find book references. It returns a paginated set of results

query:

- title (string),
- author(string),
- publicationYear(string),
- cursor (string),
- limit (number)

#### example

request

```bash
curl --request GET \
  --url 'http://localhost:3000/api/references/search?title=Alice'\''s%20Adventures'
```

response

```json
{
  "data": [
    {
      "id": "8c348eb3-9f3c-447a-a71b-8e3be19289db",
      "externalReferenceId": "460873598",
      "title": "Alice's Adventures in Wonderland and Through the Looking Glass (Everyman Paperback Classics)",
      "author": "Lewis Carroll",
      "publisher": "Everymans Library",
      "publicationYear": 1993,
      "price": 13,
      "createdAt": "2025-03-11T14:06:38.407Z",
      "updatedAt": "2025-03-11T14:06:38.407Z"
    },
    {
      "id": "b6b9e899-9f97-4e00-8672-3a22375e6741",
      "externalReferenceId": "140620869",
      "title": "Alice's Adventures in Wonderland (Penguin Popular Classics)",
      "author": "Lewis Carroll",
      "publisher": "Penguin Books Ltd",
      "publicationYear": 1994,
      "price": 22,
      "createdAt": "2025-03-11T14:06:37.783Z",
      "updatedAt": "2025-03-11T14:06:37.783Z"
    },
    {
      "id": "abc7a6f7-57ef-498a-940c-5acd50820fc5",
      "externalReferenceId": "451527747",
      "title": "Alice's Adventures in Wonderland and Through the Looking Glass",
      "author": "Lewis Carroll",
      "publisher": "Signet Classics",
      "publicationYear": 2000,
      "price": 20,
      "createdAt": "2025-03-11T14:06:37.428Z",
      "updatedAt": "2025-03-11T14:06:37.428Z"
    }
  ],
  "totalCount": 3,
  "cursor": null
}
```

### `/references [POST]`

Endpoint to create a new reference

body ( application/json')

- title
- author
- externalReferenceId
- publicationYear
- publisher
- price

#### example

```bash
curl --request POST \
  --url http://localhost:3000/api/references \
  --header 'Content-Type: application/json' \
  --data '{
	"title": "Shogun",
	"author": "James Clavel",
	"externalReferenceId": "0943534asdfs4343",
	"publicationYear": 1991,
	"publisher": "Penguin",
	"price": 30
}
'
```

#### response

```
{
	"id": "3472b9d8-0476-4bf2-8c67-9cce9029a057",
	"externalReferenceId": "0943534asdfs4343",
	"title": "Shogun",
	"author": "James Clavel",
	"publisher": "Penguin",
	"publicationYear": 1991,
	"price": 30,
	"createdAt": "2025-03-11T16:26:54.990Z",
	"updatedAt": "2025-03-11T16:26:54.990Z"
}
```

### `/references/:id [GET]`

Get a single reference

#### example

```bash
curl --request GET \
  --url http://localhost:3000/api/references/3472b9d8-0476-4bf2-8c67-9cce9029a057
```

#### response

```
{
	"id": "3472b9d8-0476-4bf2-8c67-9cce9029a057",
	"externalReferenceId": "0943534asdfs4343",
	"title": "Shogun",
	"author": "James Clavel",
	"publisher": "Penguin",
	"publicationYear": 1991,
	"price": 30,
	"createdAt": "2025-03-11T16:26:54.990Z",
	"updatedAt": "2025-03-11T16:26:54.990Z"
}
```

### `/references/:id/books [GET]`

Get all books associated to this reference

#### example

```
curl --request GET \
  --url http://localhost:3000/api/references/abc7a6f7-57ef-498a-940c-5acd50820fc5/books \
  --header 'User-Agent: insomnia/10.3.1'
```

#### response

```json
[
  {
    "id": "1726b6d4-2586-44f2-a7b1-7879ec662ce3",
    "referenceId": "abc7a6f7-57ef-498a-940c-5acd50820fc5",
    "barcode": "YIMTo6aqHrVQ",
    "status": "available",
    "createdAt": "2025-03-11T11:18:53.793Z",
    "updatedAt": "2025-03-11T11:18:53.793Z"
  },
  {
    "id": "844cd542-4ad8-4632-8da9-f2ae5e7690cd",
    "referenceId": "abc7a6f7-57ef-498a-940c-5acd50820fc5",
    "barcode": "BNCTIfozjk7h",
    "status": "available",
    "createdAt": "2025-03-11T00:37:05.373Z",
    "updatedAt": "2025-03-11T00:37:05.373Z"
  },
  {
    "id": "c8347a0e-39af-44b1-b94a-24acfff96d4d",
    "referenceId": "abc7a6f7-57ef-498a-940c-5acd50820fc5",
    "barcode": "D3NPOCAhJqpT",
    "status": "purchased",
    "createdAt": "2025-03-11T06:04:35.500Z",
    "updatedAt": "2025-03-13T14:23:13.600Z"
  },
  {
    "id": "831b29d0-f51e-482e-83e9-e923a3f52324",
    "referenceId": "abc7a6f7-57ef-498a-940c-5acd50820fc5",
    "barcode": "h4Py951pAefk",
    "status": "available",
    "createdAt": "2025-03-11T05:58:05.976Z",
    "updatedAt": "2025-03-11T05:58:05.976Z"
  }
]
```

### `/references/:id [DELETE]`

delete a single reference. This is more of a soft delete. This is to prevent losing references that might be loaned or borrowed by a user

#### example

```bash
curl --request DELETE \
  --url http://localhost:3000/api/references/abc7a6f7-57ef-498a-940c-5acd50820fc5
```

### Books

### `/books [POST]`

Endpoint to create a new book

#### body

- referenceId
- status ('available', 'reserved', 'borrowed', 'purchased')
- barcode (unique identifier of a book)

#### example

```bash
curl --request POST \
  --url http://localhost:3000/api/books \
  --header 'Content-Type: application/json' \
  --data '{
	"referenceId": "3472b9d8-0476-4bf2-8c67-9cce9029a057",
	"status": "available",
	"barcode": "9cce9029a057"
}'
```

#### response

```json
{
  "id": "5c78957e-2515-4bbd-a9e8-adcb6c58370c",
  "referenceId": "3472b9d8-0476-4bf2-8c67-9cce9029a057",
  "status": "available",
  "barcode": "9cce9029a057",
  "createdAt": "2025-03-11T16:30:06.500Z",
  "updatedAt": "2025-03-11T16:30:06.500Z"
}
```

### `/books/:id [GET]`

Get a single book

#### example

```bash
curl --request GET \
  --url http://localhost:3000/api/books/844cd542-4ad8-4632-8da9-f2ae5e7690cd \
  --header 'User-Agent: insomnia/10.3.1'
```

#### response

```json
{
  "id": "844cd542-4ad8-4632-8da9-f2ae5e7690cd",
  "referenceId": "abc7a6f7-57ef-498a-940c-5acd50820fc5",
  "barcode": "BNCTIfozjk7h",
  "status": "available",
  "createdAt": "2025-03-11T00:37:05.373Z",
  "updatedAt": "2025-03-11T00:37:05.373Z"
}
```

### Reservations

#### `/reservations [POST]`

The user id is used as the authrorization token. Make sure to run the user seeder and copy one of the ids

A book is reserved when request is made.

Reservation status is also set to Reserved.

Resevation statuses

- 'reserved'
- 'borrowed'
- 'returned'
- 'closed' (When a book status is changed to `purchased`)

#### body

- bookId

#### header

- Authorization

#### example

```bash
curl --request POST \
  --url http://localhost:3000/api/reservations/ \
  --header 'Authorization: 66ec0221-b6ae-4ede-a39f-a2917dfa78d0' \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/10.3.1' \
  --data '{
	"bookId": "844cd542-4ad8-4632-8da9-f2ae5e7690cd"
}'
```

#### response

```json
{
  "id": "5c9aa5bd-bbca-470c-a27b-cbce84c7da4b",
  "userId": "66ec0221-b6ae-4ede-a39f-a2917dfa78d0",
  "bookId": "844cd542-4ad8-4632-8da9-f2ae5e7690cd",
  "status": "reserved",
  "reservationFee": 3,
  "lateFee": 0,
  "referenceId": "abc7a6f7-57ef-498a-940c-5acd50820fc5",
  "reservedAt": "2025-03-13T15:09:23.707Z",
  "borrowedAt": null,
  "dueAt": null,
  "returnedAt": null
}
```

#### `/reservations/:id [GET]`

get a single reservation

#### example

```bash
curl --request GET \
  --url http://localhost:3000/api/reservations/d03f9eac-9f31-4833-af44-355cf31328a7 \
  --header 'User-Agent: insomnia/10.3.1'
```

#### response

```json
{
  "id": "d03f9eac-9f31-4833-af44-355cf31328a7",
  "userId": "fd7dae8e-7d41-495f-a445-2b741c97252b",
  "bookId": "5c78957e-2515-4bbd-a9e8-adcb6c58370c",
  "referenceId": "3472b9d8-0476-4bf2-8c67-9cce9029a057",
  "status": "reserved",
  "reservationFee": 3,
  "lateFee": 0,
  "returnedAt": null,
  "dueAt": null,
  "borrowedAt": null,
  "reservedAt": "2025-03-11T17:10:10.184Z"
}
```

### `/reservations/:id/borrow [POST]`

Borrow a book after reservation

The user id is used as the authrorization token. Make sure to run the user seeder and copy one of the ids

#### body

- dueAt (ISO Date example ` "2025-03-13"` )

#### header

- Authorization [`userId`]

#### example

```bash
curl --request POST \
  --url http://localhost:3000/api/reservations/5c9aa5bd-bbca-470c-a27b-cbce84c7da4b/borrow \
  --header 'Authorization: 66ec0221-b6ae-4ede-a39f-a2917dfa78d0' \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/10.3.1' \
  --data '{
	"dueAt": "2025-03-13"
}'
```

#### response

- Success
  - No Response body
  - Status Code 204
- Errors
  - Bad Request (400)
  - Not Found (404)
  - Conflict (409)

### `/reservations/:id/return [POST]`

return a borrowed book

The user id is used as the authrorization token. Make sure to run the user seeder and copy one of the ids

#### body

- returnedAt (ISO Date example ` "2025-03-13"` )

#### header

- Authorization [`userId`]

#### example

```bash
curl --request POST \
  --url http://localhost:3000/api/reservations/5c9aa5bd-bbca-470c-a27b-cbce84c7da4b/return \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/10.3.1' \
  --data '{
	"returnedAt": "2025-03-13"
}'
```

#### response

- Success
  - No Response body
  - Status Code 204
- Errors
  - Bad Request (400)
  - Not Found (404)
  - Conflict (409)

### `/users/me/reservations [GET]`

To get a history of a user's reservations

The user id is used as the authrorization token. Make sure to run the user seeder and copy one of the ids

#### header

- Authorization [`userId`]

#### example

```bash
curl --request GET \
  --url http://localhost:3000/api/users/me/reservations \
  --header 'Authorization: 66ec0221-b6ae-4ede-a39f-a2917dfa78d0' \
  --header 'User-Agent: insomnia/10.3.1'
```

#### response

```json
[
  {
    "id": "5c9aa5bd-bbca-470c-a27b-cbce84c7da4b",
    "userId": "66ec0221-b6ae-4ede-a39f-a2917dfa78d0",
    "bookId": "844cd542-4ad8-4632-8da9-f2ae5e7690cd",
    "referenceId": "abc7a6f7-57ef-498a-940c-5acd50820fc5",
    "status": "returned",
    "reservationFee": 3,
    "lateFee": 0,
    "returnedAt": "2025-03-13",
    "dueAt": "2025-03-13",
    "borrowedAt": "2025-03-13T15:10:14.914Z",
    "reservedAt": "2025-03-13T15:09:23.707Z"
  }
]
```

## Workers

There are 3 workers within this project. The workers are

- [Email Sender Service](/src/apps/workers/email-sender-service/server.ts) notify users by email
- [Process Late Returns](/src/apps/workers/process-late-returns-notification-service/run.ts) -
  processing reservations with late returns (7 days after the due date)
- [Process Upcoming Reservations](/src/apps/workers/process-up-coming-notification-service/run.ts) - processing reservations with upcoming due dates (2 days before)

### Email Sender Service

The [Email Sender Service](/src/apps/workers/email-sender-service/server.ts) is basically a server that consumes remiders from a queue and subsequently sends the email

#### Dependencies

- [Redis](https://www.npmjs.com/package/redis)
- [BullMQ](https://github.com/taskforcesh/bullmq)
- [SendGrid](https://www.npmjs.com/package/@sendgrid/mail): Currently this is deactivated. If you want to make send a valid email then update the value of the [`emailEnv`](/config/default.json) to `live`. Also make sure you add a valid sendgrid api to the [`sendGridApiKey`](/config/default.json)

To start the server run the command below

```bash
yarn run workers:email-sender-service
```

### Process Late Returns

This is a [worker](/src/apps/workers/process-late-returns-notification-service/run.ts) that should be run by a scheduler or cron job to fetch reservations that are 7 days past their due dates. These are reservations with the status `reserved`. The worker composes and publishes the reminders to the queue service to be consumed by the `email-sender-service`.

#### Dependencies

- [Redis](https://www.npmjs.com/package/redis)
- [BullMQ](https://github.com/taskforcesh/bullmq)

To run the Process Late Return Worker:

```bash
yarn run workers:process-late-returns
```

### Process Upcoming Reservations

This [worker](/src/apps/workers/process-up-coming-notification-service/run.ts) is a worker that should run by a scheduler or cron job to fetch reservations that due in 2 days. These are reservations with the status `reserved`. The worker composes and publishes the reminders to the queue service to be consumed by the `email-sender-service`

#### Dependencies

- [Redis](https://www.npmjs.com/package/redis)
- [BullMQ](https://github.com/taskforcesh/bullmq)

To run the worker

```bash
yarn run workers:process-up-coming-reservations
```

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
