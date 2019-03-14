# SLP Student Tracker Server

## Table of Contents
- [Introduction](#introduction)
- [Tech Stack](#tech-stack)
- [Server Structure](#app-structure)
- [Data Models](#data-models)
  - [User Schema](#user-schema)
  - [Account Schema](#account-schema)
  - [Income Schema](#income-schema)
- [API Endpoints](#api-endpoints)
  - [Users](#users)
  - [Authentication](#authentication)
  - [Students](#students)
  - [Notes](#notes)

## Introduction
This is the server documentation for [SLP Student Tracker](https://slpst.herokuapp.com/), a student tracking app complete with note taking capabilities and graphical representation of your studnts progress.

## Tech Stack
SLP Student Tracker server is powered by the following,
* Node
* Express
* MongoDB
* Mongoose
* Morgan
* Passport
* BCryptJS
* JSONWebToken
* Moment
* dotEnv
* Mocha
* Chai

## App Structure
SLP Student Tracker follows Node's convention of processing codes from top to bottom and left to right. The most-used routes will be placed at top, followed by lesser-used routes.

Route hierarchy is as follows,
```
Users
Authentication
Students
Notes

```

Application data is persisted via MongoDB. Document mapping is handled by Mongoose. RESTful API architecture is also used for data creation and retrieval.

## Data Models
SLP Student Tracker employs Mongoose document schema to construct its data models: users, students, and notes. User documents dictates the existence of other sub-documents such as students and notes.

### User Schema
```
  username: {type: String, required: true,unique: true},
  password: {type: String, required: true},
  firstName: {type: String, default: ''},
  lastName: {type: String, default: ''},
  students: [StudentSchema]
```

### Students Schema
```
  name: {type: String, required: true},
  goals: {type: String, },
  notes: [NoteSchema]
```

### Notes Schema
```
  subjective: {type: String},
  objective: {type: String, required: true},
  assessment: {type: String},
  plan: {type: String, },
```

## API Endpoints
All requests and responses are in JSON format.

Action | Path |
--- | --- |
Users | https://sdd-student-tracker.herokuapp.com//api/users |
Authentication | https://sdd-student-tracker.herokuapp.com/api/auth |
Students | https://sdd-student-tracker.herokuapp.com/students |
Notes | https://sdd-student-tracker.herokuapp.com/api/notes |

### Users
`POST` request to endpoint `/` is for creating user documents. It accepts the following request body,
```
{
  username,
  password,
  firstName, // optional
  lastName // optional
}
```
`username` will be rejected if it is not unique. Once a user document is successfully created, this will be the server's response.
```
{
  id,
  username,
  firstName,
  lastName,
}
```

### Authentication
`POST` to `/login` endpoint for creation of JWT. It accepts the following request body,
```
{
  username,
  password
}
```
This endpoint takes in the username and verifies the password. When validated, the server will respond with a token,
```
{
  authToken
}
```

`POST` to `/refresh` will send back another token with a newer expiriation. No request body is necessary as an existing and valid JWT must be provided to access this endpoint.

### Students
`POST` to `/:userId` will create a student sub-document. Analogous to a vendor account, this document contains a name, next due date, amount, and billing history. It accepts the following request body,
```
{
  studentName,
  goals
}
```

`GET` request to `/:userId` will return an array of all students sub-documents belonging to a user, respectively, with `:userId` being the users's ID.


`DELETE` request to `/:userId` will delete an student sub-document within the same ID. The server will respond with status 204 whether or not the account exists.It accepts the following request body,
```
{
 studentId
}
```

### Ntes
`POST` request to `/:userId/:studentId` will create a sub-document. It accepts the following request body,
```
{
  subjective,
  objective,
  assesment,
  plan,
}
```

`GET` request to `/:userId/:studentId` will return one note sub-documet data belonging to a user's student.
