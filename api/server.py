import json
from flask import Flask, request
from model import get_recipes_any_ingredients as any_ingredients, get_recipes_exact_ingredients as exact_ingredients
from recipes import RecipeDB

app = Flask(__name__)

db = RecipeDB("recipes.db")
print('db: ', db.getAllRecipes())



@app.route('/recipes/<int:recipe_id>', methods=['OPTIONS'])
def handle_cors_options(recipe_id):
    return '', 204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    }

# @app.route('/meals/<int:meal_id>', methods=['OPTIONS'])
# def handle_cors_options_meal(meal_id):
#     return '', 204, {
#         "Access-Control-Allow-Origin": "*",
#         "Access-Control-Allow-Methods": "PUT, DELETE",
#         "Access-Control-Allow-Headers": "Content-Type"
#     }

@app.route('/recipes', methods=['GET'])
def retrieve_recipes():
    recipes = db.getAllRecipes()
    print('recipes: ', recipes)
    return recipes, {"Access-Control-Allow-Origin": "*"}

# @app.route('/meals', methods=['GET'])
# def retrieve_meals():
#     meals = db.getAllMeals()
#     return meals, {"Access-Control-Allow-Origin": "*"}

@app.route('/recipes', methods=['POST'])
def add_recipe():
    # user = request.form['user']
    name = request.form['name']
    ingredients = json.dumps([request.form['ingredients']])
    instructions = request.form['instructions']
    time = request.form['time']
    rating = request.form['rating'] if 'rating' in request.form else None
    if not rating:
        recipe_id = db.addRecipe(1, name, ingredients, instructions, time)
    else:
        recipe_id = db.addRecipe(1, name, ingredients, instructions, time, rating)
    print('recipe_id: ', recipe_id)
    return json.dumps(recipe_id), 201, {"Access-Control-Allow-Origin": "*"}

# @app.route('/meals', methods=['POST'])
# def add_meal():
#     name = request.form['name']
#     main_dish = request.form['main_dish']
#     side_dishes = request.form['side_dishes'] if 'side_dishes' in request.form else None
#     beverages = request.form['beverages'] if 'beverages' in request.form else None
#     rating = request.form['rating'] if 'rating' in request.form else None
#     if not rating:
#         meal_id = db.addMeal(name, main_dish, side_dishes, beverages)
#     else:
#         meal_id = db.addMeal(name, main_dish, side_dishes, beverages, rating)
#     print('meal_id: ', meal_id)
#     return meal_id, 201, {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type"}

@app.route('/recipes/gen', methods=['POST'])
def generate_recipes():
    ingredients = request.form['ingredients']
    if request.form['type'] == 'exact':
        response = exact_ingredients(ingredients)
    else:
        response = any_ingredients(ingredients)
    return response, 201, {"Access-Control-Allow-Origin": "*"}

@app.route("/recipes/<int:recipe_id>", methods=['PUT'])
def update_recipe(recipe_id):
    recipe = db.getRecipe(recipe_id)
    if recipe is None:
        return '', 404, {"Access-Control-Allow-Origin": "*"}
    if recipe:
        name = request.form['name']
        ingredients = json.dumps([request.form['ingredients']])
        instructions = request.form['instructions']
        time = request.form['time']
        rating = request.form['rating'] if 'rating' in request.form else None
        response = db.updateRecipe(recipe_id, 1, name, ingredients, instructions, time, rating)
        # print(response)
        return response, 200, {"Access-Control-Allow-Origin": "*"}
    
# @app.route("/meals/<int:meal_id>", methods=['PUT'])
# def update_meal(meal_id):
#     meal = db.getMeal(meal_id)
#     if meal is None:
#         return '', 404, {"Access-Control-Allow-Origin": "*"}
#     if meal:
#         db.updateMeal(meal_id, request.form['name'], request.form['main_dish'], request.form['side_dishes'], request.form['beverages'], request.form['rating'])
#         return '', 204, {"Access-Control-Allow-Origin": "*"}

@app.route("/recipes/<int:recipe_id>", methods=['GET'])
def get_recipe(recipe_id):
    recipe = db.getRecipe(recipe_id)
    if recipe is None:
        return '', 404, {"Access-Control-Allow-Origin": "*"}
    return recipe, 200, {"Access-Control-Allow-Origin": "*"}

# @app.route('/meals/<int:meal_id>', methods=['GET'])
# def get_meal(meal_id):
#     meal = db.getMeal(meal_id)
#     if meal is None:
#         return '', 404, {"Access-Control-Allow-Origin": "*"}
#     return meal, 200, {"Access-Control-Allow-Origin": "*"}

@app.route("/recipes/<int:recipe_id>", methods=['DELETE'])
def delete_recipe(recipe_id):
    recipe = db.getRecipe(recipe_id)
    if recipe is None:
        return '', 404, {"Access-Control-Allow-Origin": "*"}
    db.deleteRecipe(recipe_id)
    return '', 204, {"Access-Control-Allow-Origin": "*"}

# @app.route("/meals/<int:meal_id>", methods=['DELETE'])
# def delete_meal(meal_id):
#     meal = db.getMeal(meal_id)
#     if meal is None:
#         return '', 404, {"Access-Control-Allow-Origin": "*"}
#     db.deleteMeal(meal_id)
#     return '', 204, {"Access-Control-Allow-Origin": "*"}





def run():
    app.run(port=8080, host='0.0.0.0')

if __name__ == '__main__':
    run()

