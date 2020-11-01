import uniqid from 'uniqid'; // for id generation
export default class List{
    constructor(){
        this.items= []; // all the items will be stored in this array
    }

    // to add items in the list
    addItem(count, unit, ingredient){
        const item = {
            id: uniqid(), // from uniqid file of github
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }

    deleteItem(id){
        const index = this.items.findIndex(el => el.id === id);
        //[2,4,,8] splice(1,2) => returns [4,8], original array is [2] . It mutates the original array
        //[2,4,8] slice(1,2) => returns 4, original array is [2,4,8] . It doesnt mutate the  origianl array
        this.items.splice(index, 1); // to delete the item    
    }

    // to update the number of ingredients or count
    updateCount(id, newCount){
        this.items.find(el => el.id === id).count = newCount; // this updates the count
    }
}