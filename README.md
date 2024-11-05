# Recipe Book and Generator

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