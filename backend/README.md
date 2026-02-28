# BrainSync Backend

This is the backend API for the BrainSync translation service built with FastAPI and MongoDB.

## Project Structure

```
backend/
├── main.py              # FastAPI application entry point
├── config.py            # Configuration settings from environment variables
├── database.py          # MongoDB connection management
├── security.py          # JWT and password hashing utilities
├── requirements.txt     # Python dependencies
├── models/
│   ├── user.py          # User data model
│   └── translation.py   # Translation data model
├── routes/
│   ├── auth.py          # Authentication endpoints (signup, login, password change)
│   └── translations.py  # Translation CRUD endpoints
├── schemas/
│   ├── auth.py          # Authentication request/response schemas
│   └── translation.py   # Translation request/response schemas
└── .env.example         # Environment variables template
```

## Getting Started

### Prerequisites
- Python 3.8+
- MongoDB (local or cloud)
- pip or poetry

### Installation

1. **Clone the repository**
```bash
git clone <repo-url>
cd backend
```

2. **Create a virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your MongoDB URL and JWT secret
```

### Running the Server

```bash
python main.py
```

The server will start at `http://localhost:8000`

### API Documentation

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/change-password` - Change password

### Translations
- `POST /api/v1/translations` - Create translation
- `GET /api/v1/translations` - List user translations
- `GET /api/v1/translations/{id}` - Get translation details
- `PATCH /api/v1/translations/{id}` - Update translation
- `DELETE /api/v1/translations/{id}` - Delete translation

## Environment Variables

```
MONGODB_URL=<your MongoDB connection string>
DATABASE_NAME=brainsync
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DEBUG=false
API_PREFIX=/api/v1
USE_IN_MEMORY_DB=false      # the application now expects a real MongoDB server; set true only for temporary offline testing
FRONTEND_URL=http://localhost:5173
# Optional token for HuggingFace summarization (backend proxies to deliver to frontend)
VITE_HF_TOKEN=
```

## Database Schema

### Users Collection
- `_id`: ObjectId (primary key)
- `email`: String (unique)
- `hashed_password`: String
- `full_name`: String
- `language_preference`: String
- `is_active`: Boolean
- `created_at`: DateTime
- `updated_at`: DateTime

### Translations Collection
- `_id`: ObjectId (primary key)
- `user_id`: String (foreign key to Users)
- `source_text`: String (optional)
- `source_language`: String
- `target_language`: String
- `translated_text`: String (optional)
- `audio_file_url`: String (optional)
- `image_file_url`: String (optional)
- `braille_output`: String (optional)
- `translation_type`: String
- `created_at`: DateTime
- `updated_at`: DateTime

## Security

The API uses:
- **JWT (JSON Web Tokens)** for authentication
- **bcrypt** for password hashing
- **CORS** for cross-origin requests (configured for frontend)

## Next Steps

- [ ] Implement dependency injection for current_user
- [ ] Add token refresh mechanism
- [ ] Implement translation logic/integration
- [ ] Add file upload handling for audio and images
- [ ] Add rate limiting
- [ ] Add request validation
- [ ] Deploy to production
