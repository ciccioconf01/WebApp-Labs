# Films API Documentation

This document outlines the RESTful APIs for managing a film collection. The application allows users to create, read, update, and delete films, as well as filter films based on various criteria.

## Collections and Elements

- **Collection**: Films
- **Element**: Film (with properties: id, title, favorite, watchDate, rating)

## API Endpoints

### Get Film by ID

```
GET /api/films/:id
```

Retrieves a specific film by its ID.

**Sample Request:**
```
GET /api/films/1
```

**Sample Response:**
```json
[
  {
    "id": 1,
    "title": "Pulp Fiction",
    "favorite": 1,
    "watchDate": "2023-03-10",
    "rating": 5
  }
]
```

**Error Response:**
```
Status: 500 Internal Server Error
```

### Create New Film

```
POST /api/films
```

Creates a new film entry in the database.

**Sample Request:**
```
POST /api/films
Content-Type: application/json

{
  "title": "Inception",
  "favorite": true,
  "watchDate": "2023-03-15",
  "rating": 4
}
```

**Sample Response:**
```json
5
```
(Returns the ID of the newly created film)

**Error Response:**
```
Status: 500 Internal Server Error
```

### Delete Film

```
DELETE /api/films/:id
```

Deletes a film by its ID.

**Sample Request:**
```
DELETE /api/films/3
```

**Sample Response:**
```json
{
  "deletedRows": 1
}
```

**Error Response:**
```
Status: 500 Internal Server Error
```

### Update Film Favorite Status

```
PUT /api/films/:id/favorite
```

Updates the favorite status of a film.

**Sample Request:**
```
PUT /api/films/2/favorite
Content-Type: application/json

{
  "favorite": true
}
```

**Sample Response:**
```json
{
  "updatedRows": 1
}
```

**Error Response:**
```
Status: 500 Internal Server Error
```

### Update Film Rating

```
PUT /api/films/:id/score
```

Updates the rating of a film by adding/subtracting the specified value.

**Sample Request:**
```
PUT /api/films/4/score
Content-Type: application/json

{
  "score": "+1"
}
```

**Sample Response:**
```json
{
  "updatedRows": 1
}
```

**Error Response:**
```
Status: 500 Internal Server Error
```

### Get Filtered Films

```
GET /api/films?filter=[filter_type]
```

Retrieves films based on the specified filter. Available filters:
- "all" (default): all films
- "favorite": only favorite films
- "best": films with a rating of 5
- "lastmonth": films watched in the last 30 days
- "unseen": films not yet watched

**Sample Request:**
```
GET /api/films?filter=favorite
```

**Sample Response:**
```json
[
  {
    "id": 1,
    "title": "Pulp Fiction",
    "favorite": 1,
    "watchDate": "2023-03-10",
    "rating": 5
  },
  {
    "id": 4,
    "title": "The Godfather",
    "favorite": 1,
    "watchDate": "2023-02-15",
    "rating": 5
  }
]
```

**Error Response:**
```json
{
  "error": "Error message"
}
```

### Update Film Details

```
PUT /api/films/:id
```

Updates all details of a specific film.

**Sample Request:**
```
PUT /api/films/2
Content-Type: application/json

{
  "title": "Updated Title",
  "favorite": false,
  "watchDate": "2023-04-01",
  "rating": 3
}
```

**Sample Response:**
```json
{
  "message": "Film updated successfully"
}
```

**Error Responses:**
```json
{
  "message": "Film not found"
}
```
or
```json
{
  "error": "Error message"
}
```