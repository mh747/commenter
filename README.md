# Commenter
Vice Test - Simple Commenting API in Node.js

This REST API is built with the Express framework. I don't like directly modifying database tables and structure, so I used the db-migrate package to implement any database setup or changes.

### Cloning This Repository
To download this code and run the API locally, these steps can be followed:
* These steps assume that you already have node, npm, mysql, and redis installed on your computer.

1. Clone this repository:  
  ` % git clone https://github.com/mh747/commenter.git `  
  ` % cd commenter `

2. Install dependencies defined in package.json  
  ` % npm install `

3. Create a new database
  ```
    % mysql -u <user> -p <password>
    > CREATE DATABASE <database_name>
    > quit;
  ```  
4. This code will depend on a few different environment variables being set, so they should be defined now:  
  a. PORT - will specify which port the API should run on  
  b. DBHOST - the host where the mysql database is located  
  c. DBUSER - the Mysql username  
  d. DBPASSWORD - the Mysql password  
  e. DBNAME - the database created in step 3  
  
5. Once those are defined, you can run the database migration file I've included in this repository to configure the database.
  ` % ./node_modules/db-migrate/bin/db-migrate up 20170718150756-dbconfig.js -e dev `
  
6. The last step should have created two tables in your database: comments, and migrations. Now that those are created, the node server can be started by running:  
  ` % npm start `
  
### Using This API

#### Creating a Comment
To create a new comment, you can send a ` POST ` request to ` /comments `, with a json request body. The json should look like the following:  
```
  {
    "comment": "this is the comment text"
   }
```

If successful, this will respond with a json representation of the comment you've just created. This will include the id (primary key), comment text, and the 'created' field, which is the timestamp of when it was created.

#### Listing All Comments
To list all comments, you can send a ` GET ` request to ` /comments `. The response will be simply an array of all of the comments contained in the database.

#### Selecting a Specific Comment
To get a single comment, you can send a ` GET ` request to ` /comments/{id} `. The response will be the json representation of the comment requested.

### Note On Redis Cache Layer
This app uses Redis to cache results. When instantiating the Redis client connection, this server will set the ` maxmemory-policy ` config setting in Redis to 'allkeys-lru'. I went with this method because when dealing with comments, it stands to reason that comments that were accessed recently will likely be accessed again, until there are newer comments that have taken over. This API does not cache based on the API URI being accessed, it caches based on the id of the comment. At this time, it also only caches the record when a single comment is looked up, or if a single comment is created. 
