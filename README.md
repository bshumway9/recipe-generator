# Recipe Book and Generator

## Description

This recipe generator uses generative ai to create recipes for the user based on ingredients they have available.
It uses a sqlite database to store the recipes for the user to access again whenever they want.

## Resource

**Recipe**

Attributes:

* name (string)
* ingredients (json)
* instructions (string)
* time (integer)
* rating (integer)

## Schema

```sql
CREATE TABLE recipes (
id INTEGER PRIMARY KEY AUTOINCREMENT,
user INTEGER NOT NULL,
name TEXT NOT NULL,
ingredients json NOT NULL,
instructions TEXT NOT NULL,
time INTEGER NOT NULL,
side BOOLEAN,
rating INTEGER);
```

## REST Endpoints

Name                           | Method | Path
-------------------------------|--------|------------------
Retrieve recipe collection | GET    | /recipes
Retrieve recipe member     | GET    | /recipes/*\<id\>*
Create recipe member       | POST   | /recipes
Update recipe member       | PUT    | /recipes/*\<id\>*
Delete recipe member       | DELETE | /recipes/*\<id\>*
