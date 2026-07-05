# MongoDB Integration Setup

Your project is fully integrated with MongoDB. Here's what's been set up:

## Configuration

### Environment Variables Required
Add the following to your environment variables (Vars section):
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
```

You can get this from:
- **MongoDB Atlas**: Create a cluster and get the connection string from Connection > Connect > Drivers
- **Other MongoDB providers**: Check their documentation for the connection string format

## Architecture

### Database Connection (`lib/mongodb.ts`)
- Establishes and caches MongoDB connections
- Implements connection pooling for performance
- Handles connection lifecycle

### Data Models

#### 1. **Profile Model** (`lib/models/profile.ts`)
Stores user authentication and profile information.

**Fields:**
- `_id`: Unique user identifier (UUID)
- `email`: User email (unique, lowercase)
- `password_hash`: Hashed password with bcryptjs
- `full_name`, `phone`, `location`, `farm_name`: User profile data
- `created_at`, `updated_at`: Timestamps

#### 2. **Animal Model** (`lib/models/animal.ts`)
Stores animal/cattle information for each user.

**Fields:**
- `_id`: Unique animal identifier
- `user_id`: Reference to the profile owner
- `name`, `breed`, `gender`, `color`: Basic info
- `age_months`, `weight`: Health metrics
- `notes`: Additional information
- Indexed by `user_id` for fast queries

#### 3. **Diagnosis Model** (`lib/models/diagnosis.ts`)
Stores diagnosis records for animal health.

**Fields:**
- `_id`: Unique diagnosis identifier
- `user_id`: Profile owner
- `animal_id`: Associated animal
- `diagnosis_type`: 'symptoms' or 'image'
- `symptoms`: Array of symptom strings
- `disease_name`, `confidence_score`, `severity`: Diagnosis results
- `treatment_recommendations`, `prevention_tips`: Medical advice
- `status`: pending | diagnosed | treated | resolved
- Indexed by both `user_id` and `animal_id`

## API Endpoints

### Authentication
- `POST /api/auth/sign-up` - User registration with password hashing
- `POST /api/auth/sign-in` - User login with password verification

### Animals Management
- `GET /api/animals` - Fetch user's animals
- `POST /api/animals` - Add new animal
- `DELETE /api/animals/[id]` - Delete specific animal

### Diagnoses
- `GET /api/diagnoses` - Fetch user's diagnoses
- `POST /api/diagnoses` - Create new diagnosis

## Security Features

✅ **Password Hashing**: bcryptjs with 10 salt rounds
✅ **User Isolation**: Data filtered by user_id
✅ **Input Validation**: Required fields checked
✅ **Error Handling**: Secure error messages
✅ **Connection Pooling**: Efficient resource usage

## Authentication Flow

1. User signs up → Password hashed → Profile created in MongoDB
2. User signs in → Credentials verified → Session data stored locally
3. API requests → User ID from Authorization header → Data filtered by user_id
4. User logs out → Local session cleared

## Testing Your Setup

1. **Sign Up**: Create a new user account
2. **Add Animal**: Register a new animal
3. **View Animals**: Fetch the list of your animals
4. **Create Diagnosis**: Add a diagnosis for an animal

All data will be stored in MongoDB and isolated per user!
