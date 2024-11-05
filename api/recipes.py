import sqlite3
import json


def dict_factory(cursor, row):
 fields = []
 # Extract column names from cursor description
 for column in cursor.description:
    fields.append(column[0])

 # Create a dictionary where keys are column names and values are row values
 result_dict = {}
 for i in range(len(fields)):
    result_dict[fields[i]] = row[i]

 return result_dict

class RecipeDB:
    def __init__(self, filename):
        #connect to the DB file
        self.connection = sqlite3.connect(filename, check_same_thread=False)
        self.connection.row_factory = dict_factory
        # create a cursor instance for the connection
        self.cursor = self.connection.cursor()
        
        # create the recipes table if it does not exist
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS recipes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user INTEGER NOT NULL,
                name TEXT NOT NULL,
                ingredients json NOT NULL,
                instructions TEXT NOT NULL,
                time INTEGER NOT NULL,
                side BOOLEAN,
                rating INTEGER
            )
        ''')
        # self.cursor.execute('''
        #     CREATE TABLE IF NOT EXISTS meals (
        #     id INTEGER PRIMARY KEY AUTOINCREMENT,
        #     user INTEGER NOT NULL,
        #     name TEXT NOT NULL,
        #     main_dish json NOT NULL,
        #     side_dishes json,
        #     beverages json,
        #     rating INTEGER
        #     )
        # ''')
        self.connection.commit()

    def getAllRecipes(self):
        #fetch all messages from the DB
        self.cursor.execute("SELECT * FROM recipes")
        recipes = self.cursor.fetchall()
        # print('recipes: ', recipes)
        return recipes
    
    # def getAllMeals(self):
    #     #fetch all messages from the DB
    #     self.cursor.execute("SELECT * FROM meals")
    #     meals = self.cursor.fetchall()
    #     print('meals: ', meals)
    #     return meals
    
    def getRecipe(self, recipe_id):
        data = [recipe_id]
        #fetch recipe from the DB
        self.cursor.execute("SELECT * FROM recipes WHERE id = ?", data)
        recipe = self.cursor.fetchone()
        return recipe
    
    # def getMeal(self, meal_id):
    #     data = [meal_id]
    #     #fetch recipe from the DB
    #     self.cursor.execute("SELECT * FROM meals WHERE id = ?", data)
    #     meal = self.cursor.fetchone()
    #     return meal
    
    def updateRecipe(self, recipe_id, user, name, ingredients, instructions, time, rating = None):
        data = [user, name, ingredients, instructions, time, rating, recipe_id]
        #update the recipe in the DB
        self.cursor.execute("UPDATE recipes SET user = ?, name = ?, ingredients = ?, instructions = ?, time = ?, rating = ? WHERE id = ?", data)
        recipe_id = json.dumps(recipe_id)
        self.connection.commit()
        return recipe_id

    # def updateMeal(self, meal_id, user, name, main_dish, side_dishes, beverages, rating = None):
    #     data = [user, name, main_dish, side_dishes, beverages, rating, meal_id]
    #     #update the recipe in the DB
    #     self.cursor.execute("UPDATE meals SET user = ?, SET name = ?, main_dish = ?, side_dishes = ?, beverages = ?, rating = ? WHERE id = ?", data)
    #     meal_id = json.dumps(self.cursor.lastrowid)
    #     self.connection.commit()
    #     return meal_id
    
    def addRecipe(self, user, name, ingredients, instructions, time, rating = None):
        #add a new recipe to the db
        self.cursor.execute("INSERT INTO recipes (user, name, ingredients, instructions, time, rating) VALUES (?,?,?,?,?,?)", (user, name, ingredients, instructions, time, rating))
        recipe_id = json.dumps(self.cursor.lastrowid)
        self.connection.commit()
        return recipe_id

    # def addMeal(self, user, name, main_dish, side_dishes = None, beverages = None, rating = None):
    #     #add a new meal to the db
    #     self.cursor.execute("INSERT INTO meals (user, name, main_dish, side_dishes, beverages, rating) VALUES (?,?,?,?,?,?)", (user, name, main_dish, side_dishes, beverages, rating))
    #     meal_id = str(self.cursor.lastrowid)
    #     self.connection.commit()
    #     return meal_id

    def deleteRecipe(self, recipe_id):
        data = [recipe_id]
        #delete a recipe from the DB
        self.cursor.execute("DELETE FROM recipes WHERE id = ?", data)
        self.connection.commit()

    # def deleteMeal(self, meal_id):
    #     data = [meal_id]
    #     #delete a recipe from the DB
    #     self.cursor.execute("DELETE FROM meals WHERE id = ?", data)
    #     self.connection.commit()

    def close(self):
        #close the connection
        self.connection.close()