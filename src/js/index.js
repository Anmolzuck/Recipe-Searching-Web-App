import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import {elements,renderLoader,clearLoader} from './views/base';

/** Global state of the app
 * - Search object
 * - Current list object
 * -Shopping list object
 * -Liked recipes
 */
const state = {};
window.state = state;

/** 
 * Search controller
 **/
const controlSearch = async() =>{

    // 1) Get quey from view
     const  query = searchView.getInput(); //document.querySelector('.search__field').value;
    //console.log(query);

    if(query){
        // 2) Now search object and add to state
        state.search =new Search(query);

        // 3) Prepare UI for the results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try{
                    //4) Search for recipies
        await state.search.getResults();

        //5) Render results on UI
        //console.log(state.search.result);
        clearLoader();
        searchView.renderResults(state.search.result);
        }catch(err){
            alert('Something wrongs with the search...');
        }
    }
};


elements.searchForm.addEventListener('submit', e=>{
    e.preventDefault();
    controlSearch();
});

// adding event to buuton of prev and next using event delegation
elements.searchResPages.addEventListener('click', e=> {

    const btn = e.target.closest('.btn-inline'); // use of .closest() method read mdn for more
    if(btn){
        const goToPage = parseInt(btn.dataset.goto,10); //whenever we prefix an attribute with data, then this variable here gets stored in a data set dot go to here in this case.
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
        console.log(goToPage);
    }
});

/** 
 * Recipe controller
 **/

const controlRecipe = async () =>{
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if(id){
        // Prepare UI for the design
        recipeView.clearRecipe();
        renderLoader(elements.recipe); // we allways need to pass  in the parent so that loader knows to dispaly itself
        
        // Highlight UI for changes
        if(state.search) searchView.highLightSelected(id);
        
        // Create new recipe object
        state.recipe = new Recipe(id); // store the recipe object in the state
        
        // testing
     //   window.r = state.recipe;
        try{ 

        // Get recipe data and parse ingredents
        await state.recipe.getRecipe();
      //  console.log(state.recipe.ingredients);
        state.recipe.parseIngredients();

        // Calculate servings and time
        state.recipe.calcTime();
        state.recipe.calcServings();

        // Render recipe
        clearLoader();
        recipeView.renderRecipe(
            state.recipe,
            state.likes.isLiked(id)
            );
        //console.log(state.recipe);
        }catch(error){
            console.log(error); 
            alert('Error processing recipe!');
        }
    }
};

/**
 * Shopping list controller
 */
const controlList = () =>{
    // create a new list If there is none yet
    if(!state.list) state.list = new List();

    //add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el =>{
        const item = state.list.addItem(el.count, el.unit, el.ingredent);
      //  console.log(item);
        listView.renderItem(item);
    });
}
    // Handle delete and update list item events using event delegation
    elements.shopping.addEventListener('click', e =>{
        const id = e.target.closest('.shopping__item').dataset.itemid; // stoes id of the nearest shopping item        
     //   console.log(id);
        // handle the delete button
        if(e.target.matches('.shopping__delete, .shopping__delete *')){
            // delete from state
            state.list.deleteItem(id);

            // delete from UI
            listView.deleteItem(id);
        // handle the count update            
        }else if (e.target.matches('.shopping__count-value')){
            const val = parseFloat(e.target.value, 10);
         if(val >0)   state.list.updateCount(id, val);
        }
    });
/**
 * Like controller
 */
const controlLike = () =>{
    if(!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // User has NOT yet liked current recipe
    if(!state.likes.isLiked(currentID)){
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // Toggle the like button
            likesView.toggleLikeBtn(true);
        // Add like to UI list
        likesView.renderLike(newLike);
       // console.log(state.likes);
    }else{ // User HAS liked current recipe

        // Remove like from the state
        state.likes.deleteLike(currentID);
        //Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove like from UI list
        likesView.deleteLike(currentID);
        //console.log(state.likes);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};
// restore liked recipe on page load
window.addEventListener('load', () =>{
    state.likes = new Likes();

    // restore likes
    state.likes.readStorage();
    // toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    // render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe); // to save the data of that page

// to add same event listner to multiple events as above
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// Handling recipe button clicks and all events in the recipe search
elements.recipe.addEventListener('click', e=>{
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        // decrease button is clicked
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe); // pass value to recipeView
        }
    } else if(e.target.matches('.btn-increase, .btn-increase *')){
        // increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }else if (e.target.matches('.recipe__btn-add, .recipe__btn-add *')){
       // Add ingredients to shopping list
        controlList();
    }else if (e.target.matches('.recipe__love, .recipe__love *')){
        // Like controller
        controlLike();
    }
   // console.log(state.recipe);
});

window.l = new List();