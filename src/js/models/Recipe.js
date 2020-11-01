import axios from 'axios';
// no config file needed

export default class Recipe{
    constructor(id){
        this.id = id;
    }

    async getRecipe(){
        try{
            const res = await axios(`https://forkify-api.herokuapp.com/api//get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        }catch(error){
            console.log(error);
            alert('OOps something went wrong ;)');
        }
    }

    calcTime(){
        // Assuming that we need 15 min for each 3 ingerdents
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng/3);
        this.time = periods*15;
    }
    calcServings(){
        this.servings =4;
    }
    // To extract the events
    parseIngredients(){ // spelling mistake of ingredient

        const unitsLong = ['tablespoons', 'tablespoon', 'onuces','ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds']; // these are the units that we get
        const unitsShort =['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound'];
        const units = [...unitsShort, 'kg', 'g'];
        const newIngredients = this.ingredients.map(el =>{

            // 1) Uniform units
            let ingredent = el.toLowerCase();
            unitsLong.forEach((unit,i) =>{ // we pass unit aka currnet element and i aks current index
                ingredent = ingredent.replace(unit, unitsShort[i]); // replaces the long unit with short units
            });

            // 2) Remove parenthesis
            ingredent = ingredent.replace(/ *\([^)]*\) */g, ' ');

            //3) Parse ingredients into count, unit and ingredents
            const arrIng = ingredent.split(' '); // split the whole ingredent array with ' '
            /*Well, includes is a brand new array method,I think it's like an ES7 or even an ES8,and it returns true if the elementwe're passing in is in the array,and it returns false, of course,if the element is not in there, okay.So what we're going to do is,for each current element, it will test,
            if that element is inside of the units array.And what I mean here is, unit short,so this array, with our final short unit,and so for each of the elements in the array,it will basically perform this test, okay.So again, this is like a loop,but in the case of find index,it will return the index of the position,
            where this test here turns out to be true, okay.So let's again use the example of ounces, for example,so it will loop over the array,and it will only return true */
            const unitIndex = arrIng.findIndex(el2 => units .includes(el2));  

            let objIng;
            if(unitIndex > -1){
                // There is a unit
                // Ex. 4 1/2 cups, arrCount is [4, 1/2]
                // EX. 4 cups, arrCount is [4]
                const arrCount = arrIng.slice(0,unitIndex);
                
                let count;
                if(arrCount.length === 1){
                    count = eval(arrIng[0].replace('-', '+'));
                }else{
                    count = eval(arrIng.slice(0,unitIndex).join('+'));
                }
                objIng ={
                    count,
                    unit: arrIng[unitIndex],
                    ingredent: arrIng.slice(unitIndex +1).join(' ')
                };

            }else if(parseInt(arrIng[0],10)){ // if there is a number it returns a number which is then coerced to true and if NaN it coerces to false
                // There is no unit , but 1st element is number
                objIng ={
                    count : parseInt(arrIng[0], 10),
                    unit :'',
                    ingredent: arrIng.slice(1).join(' ')
                }
            }else if(unitIndex === -1){
                // There is NO unit and NO number in 1st position
                objIng ={
                    count : 1,
                    unit :'',
                    ingredent
                }
            }

            return objIng;
        });
        this.ingredients = newIngredients;
    
    }
    // to update the servings
      updateServings(type) { //c we need a param type so that we can pass increase or decrease
        // servings
        const newServings = type ==='dec' ? this.servings -1 : this.servings +1;

        // ingredents
        this.ingredients.forEach(ing =>{
            ing.count *= (newServings/ this.servings);

        });
        this.servings = newServings;

      }
}


