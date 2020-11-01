// list of likes
export default class Likes{
    constructor(){
        this.likes = [];
    }

    // to add items in the like list
    addLike(id,title,author,img){
        const like = {id, title, author, img};
        this.likes.push(like);

        // persist data in local storage
        this.persistData();
        return like;
    }
    deleteLike(id){
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);
        // persist data in local storage
        this.persistData();
    }
    isLiked(id){
        return this.likes.findIndex(el => el.id === id) !== -1; // to check if hte like button is active of a particular recipe
    }
    getNumLikes(){
        return this.likes.length;
    }
    // save data in localstorage
    persistData(){
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }
    // to get data from local storage
    readStorage(){
      const storage = JSON.parse(localStorage.getItem('likes'));

      // restoring likes from the local storage
      if(storage) this.likes = storage;
    }
}