# ChatPDF

ChatPDF is a full-stack application for uploading PDF documents and asking questions about their contents. Uploaded PDFs are parsed into text chunks, embedded with OpenAI, stored in PostgreSQL with pgvector, and queried with retrieval-augmented generation (RAG).

## Features

- Email and password sign-up and login
- HTTP-only JWT session cookies
- PDF upload and text extraction
- PDF storage in Supabase Storage
- Embedding generation with OpenAI `text-embedding-3-small`
- Similarity search over document chunks with PostgreSQL/pgvector
- Chat answers generated with OpenAI `gpt-4o-mini`
- Source page numbers returned with answers
- In-browser PDF viewer alongside the chat
- Responsive React interface with dark styling

## Stack

### Client

- React 19
- Vite
- React Router
- Tailwind CSS 4
- `react-pdf`
- Axios
- `react-markdown`

### Server

- Node.js with Express 5
- PostgreSQL and `pg`
- pgvector for embedding similarity search
- Supabase Storage for uploaded PDFs
- OpenAI embeddings and chat completions
- JWT, bcrypt, cookie-parser, and Multer

## Project Structure

```text
.
├── client/                 React/Vite frontend
│   └── src/
│       ├── components/     UI, chat, document, and layout components
│       ├── pages/          Login, signup, document home, and chat pages
│       ├── services/       Axios API clients
│       └── App.jsx         Client routes and protected-route handling
└── server/                 Express backend
    └── src/
        ├── controllers/   Authentication, PDF, and chat handlers
        ├── db/            PostgreSQL and Supabase clients
        ├── middleware/    JWT authentication middleware
        ├── routes/        Auth, PDF, and chat routes
        ├── services/      PDF processing, embeddings, and RAG
        ├── uploads/       Temporary local upload directory
        └── utils/         PDF chunking helpers
```

## Requirements

- Node.js 18+
- pnpm
- PostgreSQL with the `vector` extension
- An OpenAI API key
- A Supabase project with a Storage bucket named `pdfs`

## Configuration

The client and server use separate environment files. Create them from the examples:

```powershell
Copy-Item client/.env.example client/.env
Copy-Item server/.env.example server/.env
```

### Client environment

`client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Server environment

`server/.env`:

```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/chat_with_pdf"
OPENAI_API_KEY="your_openai_api_key"
JWT_SECRET="use-a-long-random-secret"
FRONTEND_URL="http://localhost:5173"
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SECRET_KEY="your-supabase-service-role-key"
```

`FRONTEND_URL` must match the URL serving the Vite client. Vite uses port `5173` by default. The server's default port is `5000`; set both `PORT` and `VITE_API_URL` consistently if you choose another port.

Do not commit `.env` files or expose `SUPABASE_SECRET_KEY` to the client.

## Database Setup

The repository currently does not include migrations or a schema file. The server expects these tables and relationships:

- `users`: `id`, `email`, `password_hash`
- `documents`: `id`, `user_id`, `filename`, `file_url`, `created_at`
- `chunks`: `id`, `document_id`, `content`, `embedding`, `page_numbers`
- `chats`: `id`, `user_id`, `document_id`, `created_at`
- `messages`: `id`, `chat_id`, `role`, `content`, `created_at`

Enable pgvector and define `chunks.embedding` with the dimensionality returned by `text-embedding-3-small` (`1536`). Add foreign keys between users/documents/chats/messages and documents/chunks/chats as appropriate. The application queries `embedding <=> vector` for nearest-neighbor search.

In Supabase Storage, create a bucket named `pdfs`. The server uploads files under a user-specific path and stores the resulting public URL in `documents.file_url`.

## Installation

Install dependencies in both packages:

```powershell
pnpm --dir client install
pnpm --dir server install
```

## Running Locally

Start the API server in one terminal:

```powershell
pnpm --dir server dev
```

Start the Vite client in another terminal:

```powershell
pnpm --dir client dev
```

Open the URL printed by Vite, usually [http://localhost:5173](http://localhost:5173). The API health check is available at [http://localhost:5000/api/health](http://localhost:5000/api/health).

## API Overview

All application endpoints are mounted under `/api`. Protected endpoints require the JWT cookie created during login or signup.

| Method | Endpoint                | Purpose                                           |
| ------ | ----------------------- | ------------------------------------------------- |
| `GET`  | `/api/health`           | Check server availability                         |
| `POST` | `/api/auth/signup`      | Create an account                                 |
| `POST` | `/api/auth/login`       | Start a session                                   |
| `POST` | `/api/auth/logout`      | Clear the session cookie                          |
| `GET`  | `/api/auth/me`          | Get the current user                              |
| `GET`  | `/api/pdf`              | List the signed-in user's documents               |
| `GET`  | `/api/pdf/:documentId`  | Get one user's document                           |
| `POST` | `/api/pdf/upload`       | Upload and process a PDF as multipart field `pdf` |
| `GET`  | `/api/chat`             | List the user's chats                             |
| `POST` | `/api/chat`             | Create a chat for a document                      |
| `GET`  | `/api/chat/:chatId`     | Get chat messages                                 |
| `POST` | `/api/chat/:chatId/ask` | Ask a question with JSON `{ "question": "..." }`  |

## Client Routes

- `/login` - Sign in
- `/signup` - Create an account
- `/app` - Document workspace
- `/app/chat/:chatId` - PDF viewer and chat
- `/app/document/:documentId` - Document route

Unauthenticated users are redirected to `/login`. The root route redirects to `/app`.

## Scripts

### Client

```powershell
pnpm --dir client dev       # Start Vite development server
pnpm --dir client build     # Create a production build
pnpm --dir client lint      # Run ESLint
pnpm --dir client preview   # Preview the production build
```

### Server

```powershell
pnpm --dir server dev       # Start Express with Node's watch mode
```

## Processing Flow

1. A signed-in user uploads a PDF through the client.
2. Multer stores it temporarily in `server/src/uploads`.
3. The server extracts page text with `pdf-parse` and creates overlapping chunks.
4. The PDF is uploaded to the Supabase `pdfs` bucket.
5. Each chunk receives an OpenAI embedding and is stored in PostgreSQL.
6. A chat question is embedded and matched against the document's chunks.
7. The top three matching chunks are sent to `gpt-4o-mini` as context.
8. The answer and source page numbers are returned and the messages are persisted.
