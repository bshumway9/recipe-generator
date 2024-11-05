console.log('connected');
// console.log(fetch('http://localhost:8080/rollercoasters'));
let inputArea = document.querySelector('#inputArea');
let messageFeed = document.querySelector('#messageFeed');
let messageInput = document.querySelector('#newMessage');
let messageButton = document.querySelector('#sendButton');
let getRecipesButton = document.querySelector('#recipes');
getRecipesButton.style.borderRadius = '5px';
getRecipesButton.style.padding = '7px';
getRecipesButton.style.color = 'black';
getRecipesButton.style.border = '1px solid black';
let ingredientsChoice = document.querySelector('#ingredients');
ingredientsChoice.style.borderRadius = '5px';
ingredientsChoice.style.padding = '7px';
ingredientsChoice.style.color = 'black';
ingredientsChoice.style.border = '1px solid black';
ingredientsChoice.innerHTML = 'Any';
ingredientsChoice.addEventListener('click', function() {
    if (ingredientsChoice.innerHTML === 'Exact') {
        ingredientsChoice.innerHTML = 'Any';
    }
    else {
        ingredientsChoice.innerHTML = 'Exact';
    }
});



function darkMode() {
    let element = document.body;
    element.classList.toggle("dark-mode");
}

function lightMode() {
    let element = document.body;
    element.classList.toggle("dark-mode");
}

let darkModeButton = document.querySelector('#darkMode');
let lightModeButton = document.querySelector('#lightMode');
darkModeButton.addEventListener('click', darkMode);
lightModeButton.addEventListener('click', lightMode);

// Ingredients = {'ingredient': str, 'amount': str, cost: float}
// Recipe = {'recipe_name': str, 'ingredients': list[Ingredients], 'instructions': str, 'time': str, 'rating': int}

// Meal = {'recipe' : Recipe, 'side_dishes' : list[Recipe], 'beverages' : list[str]}

function formatMessageToIngredients(message) {
    message.replace(' ', '');
    let ingredients = message.split(',');
    return ingredients;
}

async function generateRecipes() {
    unformattedIngredients = messageInput.value;
    messageInput.value = '';
    ingredients = formatMessageToIngredients(unformattedIngredients);
    // console.log(ingredients);
    let body = 'ingredients=' + encodeURIComponent(ingredients);
    link = 'http://localhost:8080/recipes/gen';
    altLink = 'http://localhost:8080/recipes/gen';
    if (ingredientsChoice.innerHTML === 'Any') {
        link = altLink;
        body += '&type=' + encodeURIComponent('any');
    } else {
        body += '&type=' + encodeURIComponent('exact');
    }
    
    let response = await fetch(link, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body
    });
    if (!response.ok) {
        console.log('Error loading data');
        return;
    }
    let data = await response.json();
    // console.log(data);
    // let recipeList = document.querySelector('#recipeList');
    // recipeList.innerHTML = '';
    // data.map((recipe) => {
    //     let recipeItem = document.createElement('li');
    //     recipeItem.innerText = recipe.name;
    //     recipeList.appendChild(recipeItem);
    displayRecipes(data, true);
    saveEditButton.style.display = 'none';
    inputArea.style.display = 'none';
    saveButton.style.display = 'block';
    }

async function getRecipes() {
    let response = await fetch('http://localhost:8080/recipes', 
    {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    });
    if (!response.ok) {
        console.log('Error loading data');
        return;
    }
    let data = await response.json();
    // console.log(data);
    data.forEach((recipe) => {
        recipe.ingredients = JSON.parse(JSON.parse(recipe.ingredients)[0]);
    });
    let recipes = data.map((recipe) => {
        return {'recipe': recipe};
    });
    displayRecipes(recipes);
}

async function updateRecipe(recipe) {
    let body = 'name=' + encodeURIComponent(recipe.name) + '&ingredients=' + encodeURIComponent(JSON.stringify(recipe.ingredients)) + '&instructions=' + encodeURIComponent(recipe.instructions) + '&time=' + encodeURIComponent(recipe.time) + '&rating=' + encodeURIComponent(recipe.rating);
    await fetch(`http://localhost:8080/recipes/${recipe.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
    }).then((response) => {
        return response.json()}).then((data) => {
            console.log('update recipe response:', data);
            return data;
        }).catch((error) => {
            console.log('error: ',error);
        console.log('Error updating recipe');
    });

    getRecipe(recipe.id);
}

function getRecipe(id) {
    fetch(`http://localhost:8080/recipes/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    }).then((response) => {
        return response.json()}).then((data) => {
            // console.log('get recipe response:', data);
            data.ingredients = JSON.parse(JSON.parse(data.ingredients)[0]);
            let recipe = {'recipe': data};
            displayRecipes([recipe]);
        }).catch((error) => {
        console.log('Error getting recipe');
    });


}


getRecipesButton.addEventListener('click', function() {
    saveButton.style.display = 'none';
    saveEditButton.style.display = 'none';
    inputArea.style.display = 'flex';
    getRecipes();
});

function displayEditRecipe(recipe) {
    let recipeList = document.querySelector('#recipeList');
    recipeList.innerHTML = '';
    let recipeItem = document.createElement('div');
    let recipeNameLabel = document.createElement('label');
    recipeNameLabel.innerText = 'Recipe Name: ';
    recipeItem.appendChild(recipeNameLabel);
    let recipeName = document.createElement('input');
    recipeName.id = 'recipeName';
    recipeName.key = recipe.recipe.id;
    recipeName.style.fontSize = '20px';
    recipeName.style.borderRadius = '5px';
    recipeName.size = 40;
    recipeName.value = recipe.recipe.name;
    recipeItem.appendChild(recipeName);
    let ingredientsLabel = document.createElement('label');
    ingredientsLabel.innerText = 'Ingredients: ';
    recipeItem.appendChild(ingredientsLabel);
    let ingredientsList = document.createElement('ul');
    recipe.recipe.ingredients.forEach((ingredient) => {
        let ingredientItem = document.createElement('li');
        let ingredientInput = document.createElement('input');
        ingredientInput.id = 'ingredient';
        ingredientInput.size = 30;
        ingredientInput.style.borderRadius = '5px';
        ingredientInput.value = ingredient.ingredient + '->' + ingredient.amount + '->' + ingredient.cost;
        ingredientItem.appendChild(ingredientInput);
        ingredientsList.appendChild(ingredientItem);
    });
    recipeItem.appendChild(ingredientsList);
    let instructionsLabel = document.createElement('label');
    instructionsLabel.innerText = 'Instructions: ';
    recipeItem.appendChild(instructionsLabel);
    let instructions = document.createElement('textarea');
    instructions.id = 'instructions';
    instructions.rows = 7;
    instructions.cols = 50;
    instructions.style.borderRadius = '5px';
    instructions.value = recipe.recipe.instructions;
    recipeItem.appendChild(instructions);
    let timeLabel = document.createElement('label');
    timeLabel.innerText = 'Time: ';
    recipeItem.appendChild(timeLabel);
    let time = document.createElement('input');
    time.id = 'time';
    time.size = 10;
    time.style.borderRadius = '5px';
    time.value = recipe.recipe.time;
    recipeItem.appendChild(time);
    recipeList.appendChild(recipeItem);
    let ratingLabel = document.createElement('label');
    ratingLabel.innerText = 'Rating: ';
    recipeItem.appendChild(ratingLabel);
    let rating = document.createElement('input');
    rating.id = 'rating';
    rating.size = 10;
    rating.style.borderRadius = '5px';
    rating.value = recipe.recipe.rating;
    recipeItem.appendChild(rating);

    saveEditButton.style.display = 'block';
    inputArea.style.display = 'none';
    
}


// Ingredients = {'ingredient': str, 'amount': str}
// Recipe = {'recipe_name': str, 'ingredients': list[Ingredients], 'instructions': str, 'cost': str, 'time': str}

function formatRecipe(meal, idx, side_dish, selector = false) {
    // let mealData = meal;
    let selectedMealData = meal;
    // console.log('meal: ', meal);
    let recipeItem = document.createElement('div');
    let recipeName = !selector && document.createElement('h3');
    if (selector) {
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = !side_dish ? JSON.stringify({'recipe': meal.recipe, 'index': idx}) : JSON.stringify({'side_dish': meal, 'index': idx});
        checkbox.checked = !side_dish ? selectedMealData.recipe.name === meal.recipe.name : selectedMealData.name === meal.name;
        let label = document.createElement('label');
        label.for = !side_dish ? meal.recipe.name : meal.name;
        label.innerText = !side_dish ? meal.recipe.name : meal.name;
        label.style.fontWeight = 'bold';
        label.style.fontSize = '20px';
        recipeItem.appendChild(label);
        recipeItem.appendChild(checkbox);
    }
    let total_cost = 0;
    // console.log('recipe: ', meal.recipe);
    if (!selector) {
        // recipeName.innerText = !side_dish ? meal.recipe.name : meal.name;
        recipeName.innerText = meal.recipe.name;
        
        let edit = document.createElement('button');
        edit.innerText = 'Edit';
        edit.style.borderRadius = '5px';
        edit.style.padding = '5px';
        edit.id = 'sendButton';
        edit.style.color = 'black';
        edit.addEventListener('click', function() {
            displayEditRecipe(meal);
        });
        recipeItem.appendChild(recipeName);
        recipeItem.appendChild(edit);
        if (meal.recipe.id) {
            recipeName.key = meal.recipe.id;
            let deleteButton = document.createElement('button');
            deleteButton.style.borderRadius = '5px';
            deleteButton.style.padding = '5px';
            deleteButton.style.marginLeft = '10px';
            deleteButton.id = 'sendButton';
            deleteButton.style.color = 'black';
            deleteButton.innerText = 'Delete';
            recipeItem.appendChild(deleteButton);
            deleteButton.addEventListener('click', function() {
                if (confirm('Are you sure you want to delete this recipe?')) {
                    deleteRecipe(meal.recipe.id);
                    getRecipes();
                } 
            });
        }
    }
    let ingredientsList = document.createElement('ul');
    (!side_dish ? meal.recipe.ingredients : meal.ingredients).forEach((ingredient) => {
        let ingredientItem = document.createElement('li');
        ingredientItem.innerText = ingredient.ingredient + ' ' + ingredient.amount;
        total_cost += ingredient.cost;
        ingredientsList.appendChild(ingredientItem);
    });
    recipeItem.appendChild(ingredientsList);
    let instructions = document.createElement('p');
    instructions.innerText = (!side_dish ? meal.recipe.instructions + '\nCost: ' + total_cost + '\nTime: ' + meal.recipe.time : meal.instructions + '\nCost: ' + total_cost + '\nTime: ' + meal.time);
    recipeItem.appendChild(instructions);
    // if (!side_dish) {
        
    //     let side_dishes = document.createElement('ul');
    //     meal.side_dishes.forEach((side_dish) => {
    //         side_dishes.appendChild(formatRecipe(side_dish, idx, true, selector ? true : false));
    //     });
    //     recipeItem.appendChild(side_dishes);
    //     let beverages = document.createElement('ul');
    //     meal.beverages.map((beverage) => {
    //         let beverageItem = document.createElement('li');
    //         if (!selector) {
    //             beverageItem.innerText = beverage;
    //         }
    //         if (selector) {
    //             let checkbox = document.createElement('input');
    //             checkbox.type = 'checkbox';
    //             checkbox.value = JSON.stringify({'beverage': beverage, 'index': idx});
    //             checkbox.checked = selectedMealData.beverages.includes(beverage);
    //             let label = document.createElement('label');
    //             label.for = beverage;
    //             label.innerText = beverage;
    //             beverageItem.appendChild(label);
    //             beverageItem.appendChild(checkbox);
    //         }
    //         beverages.appendChild(beverageItem);
    //     });
    //     recipeItem.appendChild(beverages);
    // }
    // if (side_dish) {
    //     recipeItem.style.marginLeft = '20px';
    // }
    return recipeItem;
}

function displayRecipes(data, selector = false) {
    let recipeList = document.querySelector('#recipeList');
    recipeList.innerHTML = '';
    data.map((recipe, idx) => {
        // console.log('meal: ', recipe);
        let recipeItem = formatRecipe(recipe, idx, false, selector);
        recipeList.appendChild(recipeItem);
    });
}

async function saveRecipeToDB(recipe) {
    let body = 'name=' + encodeURIComponent(recipe.name) + '&ingredients=' + encodeURIComponent(JSON.stringify(recipe.ingredients)) + '&instructions=' + encodeURIComponent(recipe.instructions) + '&time=' + encodeURIComponent(recipe.time);
    await fetch('http://localhost:8080/recipes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body
    }).then((response) => {
        return response.json()}).then((data) => {
            // console.log('save recipe response:', data);
            return data.Object;
        }).catch((error) => {
        console.log('Error saving recipe');
    });
}

// async function saveMealToDB(meal) {
//     console.log('meal:', meal);
//     let body = 'name=' + encodeURIComponent(meal.recipe.name + 'Meal') + '&recipe=' + encodeURIComponent(meal.recipe);
//     if (meal.side_dishes) {
//         body += '&side_dishes=' + encodeURIComponent(meal.side_dishes);
//     }
//     if (meal.beverages) {
//         body += '&beverages=' + encodeURIComponent(meal.beverages);
//     }
//     let result = fetch('http://localhost:8080/meals', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: body
//     }).then((response) => {
//         return response.json();});
//     if (!result.ok) {
//         console.log('Error saving meal');
//     } else {
//         let response = result;
//         console.log('meal response:', response);
//         return response;
//     }
// }

// Save button functionality
let saveButton = document.createElement('button');
saveButton.style.fontSize = '20px';
saveButton.style.borderRadius = '5px';
saveButton.id = 'sendButton';
saveButton.style.color = 'black';
saveButton.innerText = 'Save';
saveButton.style.display = 'none';
saveButton.addEventListener('click',async function() {
    let selectedRecipes = {};
    // document.querySelectorAll('input[type="checkbox"]:checked').forEach((checkbox) => {
    //     console.log(checkbox.value.index);
    // });
    document.querySelectorAll('input[type="checkbox"]:checked').forEach((checkbox) => {
        let data = JSON.parse(checkbox.value);
        if (data.recipe) {
            if (selectedRecipes[data.index]) {
                selectedRecipes[data.index].recipe = data.recipe;
            } else {
                selectedRecipes[data.index] = {'recipe': data.recipe};
            }
        }
        // if (data.side_dish) {
        //     if (selectedRecipes[data.index]) {
        //         selectedRecipes[data.index].side_dishes = selectedRecipes[data.index].side_dishes? [...selectedRecipes[data.index].side_dishes, data.side_dish] : [data.side_dish];
        //     } else {
        //         selectedRecipes[data.index] = {'side_dishes': [data.side_dish]};
        //     }
        // }
        // if (data.beverage) {
        //     if (selectedRecipes[data.index]) {
        //         selectedRecipes[data.index].beverages = selectedRecipes[data.index].beverages? [...selectedRecipes[data.index].beverages, data.beverage] : [data.beverage];
        //     } else {
        //         selectedRecipes[data.index] = {'beverages': [data.beverage]};
        //     }
        // }
    });
    // console.log('Selected Recipes:', selectedRecipes);
    Object.values(selectedRecipes).forEach(async (meal) => {
        // console.log('mealSaveData:', meal);
        let mealID;
        // let side_dish_ids = [];
        if (meal.recipe) {
            mealID = await saveRecipeToDB(meal.recipe);
            // console.log('mealID:', mealID);
        }
        // if (meal.side_dishes) {
        //     meal.side_dishes.forEach(async(side_dish) => {
        //         let side_dish_id = await saveRecipeToDB(side_dish);
        //         side_dish_ids.push(side_dish_id);
        //         console.log('side_dish_ids:', side_dish_ids);
        //     });
        // }
        // setTimeout(() => {
        //     console.log('meal: ', mealID, side_dish_ids, meal.beverages);
        // }, 1000);
        // let mealData;
        // if (side_dish_ids.length > 0 && meal.beverages && mealID) {
        //     mealData = {'recipe': mealID, 'side_dishes': side_dish_ids, 'beverages': meal.beverages};
        // } else if (mealID && meal.beverages) {
        //     mealData = {'recipe': mealID, 'beverages': meal.beverages};
        // } else if (mealID && side_dish_ids.length > 0) {
        //     mealData = {'recipe': mealID, 'side_dishes': side_dish_ids};
        // }
        // if (mealData) {
        //     saveMealToDB(mealData).then((response) => {
        //         console.log('meal response:', response);
        //     });
        // }
    })
    setTimeout(() => {
        getRecipes();
    }, 1000);
    inputArea.style.display = 'flex';
    saveButton.style.display = 'none';
});
document.body.appendChild(saveButton);

let saveEditButton = document.createElement('button');
saveEditButton.style.fontSize = '20px';
saveEditButton.style.borderRadius = '5px';
saveEditButton.style.position = 'sticky';
saveEditButton.style.bottom = 0;
saveEditButton.id = 'sendButton';
saveEditButton.style.color = 'black';
saveEditButton.innerText = 'Save Changes';
saveEditButton.style.display = 'none';
saveEditButton.addEventListener('click', function() {
    let recipe = {};
    recipe.name = document.querySelector('#recipeName').value;
    recipe.id = document.querySelector('#recipeName').key;
    recipe.ingredients = [];
    document.querySelectorAll('#ingredient').forEach((ingredient) => {
        let ingredientData = ingredient.value.split('->');
        recipe.ingredients.push({'ingredient': ingredientData[0], 'amount': ingredientData[1], 'cost': parseFloat(ingredientData[2])});
    });
    recipe.instructions = document.querySelector('#instructions').value;
    recipe.time = document.querySelector('#time').value;
    recipe.rating = document.querySelector('#rating').value;
    updateRecipe(recipe);

    saveEditButton.style.display = 'none';
    inputArea.style.display = 'flex';
});
document.body.appendChild(saveEditButton);



messageButton.addEventListener('click', generateRecipes);
messageInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        generateRecipes();
    }
})

function deleteRecipe(id) {
    fetch(`http://localhost:8080/recipes/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    }).then((response) => {
        return response}).then((data) => {
            console.log('delete recipe response:', data);
        }).catch((error) => {
        console.log('Error deleting recipe');
    });
}







function userMessage(message) {
    let newMessage = document.createElement('div');
    newMessage.setAttribute('class', 'userMessage');
    newMessage.innerText = message;
    messageFeed.appendChild(newMessage);
}

function botMessage(message) {
    let newMessage = document.createElement('div');
    newMessage.setAttribute('class', 'botMessage');
    newMessage.innerText = message;
    messageFeed.appendChild(newMessage);
}