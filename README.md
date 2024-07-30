# Scheduler Service
A NestJS API to manage schedule and tasks.

## Running the service using docker-compose
The easiest way to get this service up and running is by using docker and docker-compose.

### Requirements
- Docker (4.21.1)
- Docker Compose (2.19.1)

### Step-by-step
1. **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/scheduler-service.git
    cd scheduler-service
    ```

2. **Run the services using docker-compose:**

    The following command will instatiate a postgres database and setup the migrations and connections
    for running the api using docker and docker-compose. Make sure the ports 5432 and 3000 are available on your host machine.

    ```bash
    docker-compose up -d  # Daemon mode
    ```
    **Note:** You may need to run it twice in case the API service starts before the database service is up and ready.


3. **Access the API documentation at http://localhost:3000/api**

    Once the servers are up and running, you may access the swagger documentation of the project at http://localhost:3000/api


## Running the service locally
### Requirements
- Node (tested on 20.13.1)
### Step-by-step
1. **Clone the repository and navigate to its folder:**

    ```bash
    git clone https://github.com/yourusername/scheduler-service.git
    cd scheduler-service
    ```
2. **Make sure to have a postgres up and running locally.**
    
    You can easily setup a postgres in a docker container using the following command:
    ```
    docker run --name scheduler-service-db -p<port>:<port> -e POSTGRES_USER=<user> -e POSTGRES_PASSWORD=<password> -e POSTGRES_DATABASE=<database> -d postgres
    ```
3. **Setup an .env file on the root folder with the following:**
    ```
    DATABASE_URL="postgresql://<user>:<password>@localhost:<port>/<database>?schema=public"
    ```
4. **Install project dependencies**
    ```
    npm install .
    ```
5. **Run prisma migrations and start the application**
    ```
    npx prisma migrate dev
    npm start
    ```
6. **Access the API documentation at http://localhost:3000/api**

    With the project up and running, you may access the swagger documentation of the project at http://localhost:3000/api

7. **(Optional) You might want to run tests using the following:**
    ```
    npm run test
    ```

# API Overview

### Schedules
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/schedules | Create a new schedule |
| GET | /api/v1/schedules | List all schedules |
| GET | /api/v1/schedules/{id} | Read a schedule by id |
| PUT | /api/v1/schedules/{id} | Update a schedule by id |
| DELETE |  /api/v1/schedules/{id} | Delete a schedule by id |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
POST | /api/v1/tasks | Create a new task
GET | /api/v1/tasks | List all tasks
GET | /api/v1/tasks/{id} | Read a task by id
PUT | /api/v1/tasks/{id} | Update a task by id
DELETE |  /api/v1/tasks/{id} | Delete a task by id

# Footnotes
1. I decided not to update the start_time and end_time of schedules within a task update, as this was not specified in the requirements and to keep the project simple. Depending on the requirements I would dispatch an event whenever a task is created or updated, allowing the schedule controller/service to handle it.

2. I did not add createdAt and updatedAt timestamps to the entities since this was not specified in the requirements.

3. In a team setting I would clarify the duration of a task (is it in seconds?). This would also be necessary to update the schedule timestamps.

4. In a production environment, I would not expose the database settings in the docker-compose file. This is for "educational" purposes only. :D (contains humor)

# License
The MIT License (MIT)

Copyright (c) 2016 Márcio Oliveira

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.