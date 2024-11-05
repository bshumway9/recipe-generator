import json
import google.generativeai as genai
import os

key = 'AIzaSyCJymkzPwcHlFPFg793w1Vf0XD7DFFEvYw'




    
def get_recipes_exact_ingredients(ingredients):
    genai.configure(api_key=key)
    model = genai.GenerativeModel("gemini-1.5-flash", generation_config={"response_mime_type": "application/json", "temperature": 2})

    prompt = """Using the following ingredients: """ + ingredients + """
        please provide me with a list of recipes for a meal found online assuming I have any appliance needed to make it.
        In the Recipe, include the name of the meal, the ingredients (which includes the name of the ingredient as a string,
        the amount needed of the ingredient as a string, and the typical cost of the ingredient as a float number),
        the instructions as a string, the time it will take to prepare the meal in minutes as an integer.
        The ingredients do not all need to be used in the recipe.
        But do not include any additional ingredients that are not listed in the prompt.
        please also suggest side dishes as a whole Recipe type or non-alcoholic beverages as a string to pair with the meal using any additional ingredients.
        Any spices or condiments can be included as needed.
        The response will be rejected if the response is not in JSON format or if the Recipe does not include the cost or time.

        Use this JSON schema:
        
        Ingredients = {'ingredient': str, 'amount': str, 'cost': float}
        Recipe = {'name': str, 'ingredients': list[Ingredients], 'instructions': str, 'time': int}
        Return: list[{'recipe' : Recipe, 'side_dishes' : list[Recipe], 'beverages' : list[str]}]"""

    recipes = model.generate_content(prompt)
    print(json.loads(recipes.text))
    return recipes.text

def get_recipes_any_ingredients(ingredients):
    genai.configure(api_key=key)
    model = genai.GenerativeModel("gemini-1.5-flash", generation_config={"response_mime_type": "application/json", "temperature": 2})

    prompt = """Using the following ingredients: """ + ingredients + """
        please provide me with a list of recipes for a meal found online assuming I have any appliance needed to make it.
        In the Recipe, include the name of the meal, the ingredients (which includes the name of the ingredient as a string,
        the amount needed of the ingredient as a string, and the typical cost of the ingredient as a float number),
        the instructions as a string, the time it will take to prepare the meal in minutes as an integer.
        The ingredients do not all need to be used in the recipe.
        Feel free to add any additional ingredients needed to enhance the recipe or to make it a full meal.
        please also suggest side dishes as a whole Recipe type or non-alcoholic beverages as a string to pair with the meal.
        Any spices or condiments can be included as needed.
        The response will be rejected if the response is not in JSON format or if the Recipe does not include the cost or time.

        Use this JSON schema:
        
        Ingredients = {'ingredient': str, 'amount': str, 'cost': float}
        Recipe = {'name': str, 'ingredients': list[Ingredients], 'instructions': str, 'time': int}
        Return: list[{'recipe' : Recipe, 'side_dishes' : list[Recipe], 'beverages' : list[str]}]"""

    recipes = model.generate_content(prompt)
    print(json.loads(recipes.text))
    return recipes.text