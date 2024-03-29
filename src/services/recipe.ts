import { Recipe } from "../modals/recipe";
import { Ingredient } from "../modals/ingredient";
import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/Http";
import 'rxjs/Rx';
import { AuthService } from "./auth";

@Injectable()
export class recipeService {
    private recipes: Recipe []= [];

    constructor(private http: Http, private authService: AuthService){}

    addRecipe(title: string, description: string, difficulty: string, ingredients: Ingredient[]){
        this.recipes.push(new Recipe(title, description, difficulty, ingredients));
        console.log(this.recipes);
    }

    getRecipes(){
        return this.recipes.slice();
    }

    updateRecipe(index: number, title: string, description: string, difficulty: string, ingredients: Ingredient[]){
        this.recipes[index] = new Recipe(title, description, difficulty, ingredients);
        
    }
    removeRecipe(index: number){
        this.recipes.splice(index, 1);
    }

    storeList(token: string){
        const userId = this.authService.getActiveUser().uid;
        return this.http
        .put('https://the-recipe-book-app.firebaseio.com/' + userId + '/recipes.json?auth='+ token, this.recipes)
        .map((response: Response) => {
            return response.json();
        });
    }

    fetchList(token: string){
        const userId = this.authService.getActiveUser().uid;
        return this.http
        .get('https://the-recipe-book-app.firebaseio.com/' + userId + '/recipes.json?auth='+ token)
        .map((response: Response) => {
            const recipes: Recipe [] = response.json() ? response.json(): [];
            for(let item of recipes){
                if(!item.hasOwnProperty('ingredients')){
                    item.ingredients = [];
                }
            }
            return recipes;
        })
        .do((recipes: Recipe[]) => {
            if(recipes){
                this.recipes = recipes;
            } else {
                this.recipes = [];
            }

        });



    }

}