import React, { useEffect, useState } from 'react';
import { useParams, Link,Navigate } from 'react-router-dom';
import RecipeService from '../Service/RecipeService';
import UserService from '../Service/UserService';

export default function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loggedIn, setLoggedIn] = useState(true);
  const [isadmin, setisadmin] = useState(true);

  // useEffect(() => {
    
  //     const userId = localStorage.getItem('userId');
  //     if (!userId) {
  //       setLoggedIn(false);
  //     } else {
  //       const userResponse = await UserService.getUserById(userId);
  //         const userData = userResponse.data;
  //         setUser(userResponse.data);
  //         if (userData.role === "admin") {
  //           setisadmin(true);
  //         }
  //       const fetchRecipeDetails = async () => {
  //     try {
  //       const recipeResponse = await RecipeService.getRecipeById(id);
  //       const recipeData = recipeResponse.data;
  //       const ingredientsResponse = await RecipeService.getIngredientsByRecipe(id);
  //       const ingredientsData = ingredientsResponse.data;
  //       const updatedRecipe = { ...recipeData, recipeIngredients: ingredientsData };
  //       setRecipe(updatedRecipe);
  //     } catch (error) {
  //       console.error('Error fetching recipe details:', error);
  //     }
  //   };
  //   fetchRecipeDetails();
  // }}, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          setLoggedIn(false);
          return;
        }

        const userResponse = await UserService.getUserById(userId);
        const userData = userResponse.data;
        if (userData.role === "user") {
          setisadmin(false);
          return;
        }
        const recipeResponse = await RecipeService.getRecipeById(id);
        const recipeData = recipeResponse.data;
        const ingredientsResponse = await RecipeService.getIngredientsByRecipe(id);
        const ingredientsData = ingredientsResponse.data;
        const updatedRecipe = { ...recipeData, recipeIngredients: ingredientsData };
        setRecipe(updatedRecipe);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  if (!loggedIn) {
    // Redirect to login if not logged in
    return <Navigate to="/login" replace />;
  }

  if (!isadmin) {
    // Redirect to login if not logged in
    return <Navigate to="/adminDashboard" replace />;
  }



  return (
    <div className="container">
      {recipe ? (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Recipe Information</h5>
            <h6 className="card-subtitle mb-2 text-muted">ID: {recipe.recipeId}</h6>
            <p className="card-text">Name: {recipe.recipeName}</p>
            <p className="card-text">Instructions: {recipe.instructions}</p>
            <p className="card-text">Cook Time: {recipe.cookTime}</p>
            <p className="card-text">Total Calories: {recipe.totalCalories}</p>
            <p className="card-text">Type: {recipe.recipeType}</p>
            <p className="card-text">Description: {recipe.recipeDescription}</p>
            {recipe.recipe_image && (
              <img src={`data:image/jpeg;base64,${recipe.recipe_image}`} alt={recipe.recipeName} />
            )}
            {recipe.recipeIngredients && (
              <div>
                <h6 className="card-subtitle mb-2 text-muted">Ingredients:</h6>
                <ul>
                  {recipe.recipeIngredients.map(ingredient => (
                    <li key={ingredient.ingredientId}>{ingredient.ingredientName}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <Link to="/userrecipes" className="btn btn-primary">Back</Link>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}