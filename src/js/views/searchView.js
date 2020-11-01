import {elements} from './base';

export const getInput = () => elements.searchInput.value;

// to clear the input fields
export const clearInput = () =>{
    elements.searchInput.value = '';
};
// to clear the results
export const clearResults = () =>{
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML ='';
};
// to highlight selected recipe 
export const highLightSelected = id =>{
    // to remove the class from old selected recipes
    const resultArr = Array.from(document.querySelectorAll('.results__link'));
    resultArr.forEach(el =>{
        el.classList.remove('results__link--active');
    });
 document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active'); // using css selector . can not use . in classList becaues we add  a class
};

/**Well, the best strategy that I came up with
is to split the title into its words
and then you use the reduce method on the resulting array
which then allows us to have an accumulator.
And that accumulator is just like a variable
that we can add to in each iteration of the loop.
And what we're then gonna do in each iteration of the loop
is to test if the current titling plus
the next word is still under the maximum length.
 */

// To reduce the length of the title
/* 
Pasta with tomato and spinach
acc:0 / acc + cur.length = 5 / newTitle = ["Pasta"]
acc:5 / acc + cur.length = 9 / newTitle = ["Pasta", "with"]
acc:9 / acc + cur.length = 15 / newTitle = ["Pasta", "with","tomato"]
acc:15 / acc + cur.length = 18 / newTitle = ["Pasta", "with", "toamto"] and will not be pushed
acc:18/ acc + cur.length = 24 / newTitle = ["Pasta", "with", "toamto"] spianch will not be pushed
*/
export const limitRecipeTitle = (title, limit=17) =>{
    const newTitle = [];
if(title.length > limit){
    title.split(' ').reduce((acc, cur)=>{
        if(acc+ cur.length <=limit){
            newTitle.push(cur);
        }
        return acc + cur.length; // update the value of acc
    },0);
  // return the result
  return `${newTitle.join(' ')}...`;
}
return title;
};
// function to print the recipe and make the site dynamic
const renderRecipe = recipe => { // recipe is the value we put in this func

    const markUp = `
    <li>
    <a class="results__link" href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
     </a>
    </li>    
    `;
    // to print on page
    elements.searchResList.insertAdjacentHTML('beforeend', markUp);

};
// to create button . we give num of page and type of button
const createButton = (page, type) => `
                    
        <button class="btn-inline results__btn--${type}" data-goto =${type ==='prev' ? page-1 : page +1} >
        <span>Page ${type ==='prev' ? page-1 : page +1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type ==='prev' ? 'left' : 'right'}"></use>
        </svg>
        </button>
 `;


// to dispaly prev and next button on the page
const renderButtons = (page, numResults, resPerPage) =>{
    const pages = Math.ceil(numResults / resPerPage); // to calculate num of pages ex- 30/10 =3
    let button;
    if(page ===1 && pages>1){
        // only button to go to next page
        button = createButton(page, 'next');
    }else if(page < pages) {// middle page 
        // both buttons
        button = `
            ${createButton(page,'prev')}
            ${createButton(page,'next')}
        `
    }
    else if(page === pages && pages >1) {// last page
        // only button to go to prev page
     button = createButton(page, 'prev');    
     }
     elements.searchResPages.insertAdjacentHTML('afterbegin', button);
}




// function to extract all the recipe and 10 results per page
export const renderResults = (recipes, page =1, resPerPage =10) =>{
    // render results of current page
    const start = (page-1)*resPerPage; // to decide the start value of page
    const end = page*resPerPage; // to decide the end value of page

    recipes.slice(start,end).forEach(renderRecipe); // slice(start,end) returns an array with 10 results

    // render pagination buttons
    renderButtons(page,recipes.length,resPerPage);
 };