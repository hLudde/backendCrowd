# requirements

- [git](https://git-scm.com/)
- [node](https://nodejs.org/en/)

# How to run

first clone the repository into a folder on your local machine

edit or create a .env file and set theese variables:

```
DB_PASS=<value>
DB_USER=<value>
DB_HOST=<value>
HTTP_PORT=<value>
HTTPS_PORT=<value>
JWT_SECRET=<value>
```

open a terminal in the root folder of the project and install all the dependencies with `npm install`, after this is done you can start the application by running `npm start`

# notes

You will need to be able to connect to a MySQL instance for the application to run properly
