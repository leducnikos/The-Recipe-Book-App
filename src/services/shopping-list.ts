import { Ingredient } from "../modals/ingredient";
import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { AuthService } from "./auth";
import 'rxjs/Rx';

@Injectable()
export class ShoppingListService {
    
 private ingredients: Ingredient [] = [];

 constructor(private http: Http, private authService: AuthService){}

    addItem(name: string, amount: number){
        this.ingredients.push(new Ingredient(name, amount));
    }

    addItems(items: Ingredient []){
        this.ingredients.push(...items);
        console.log(this.ingredients);
    }

    getItems(){
       return this.ingredients.slice();
    }

    removeItem(index: number){
        this.ingredients.splice(index, 1);
    }

    storeList(token: string){
        const userId = this.authService.getActiveUser().uid;
        return this.http
            .put('https://the-recipe-book-app.firebaseio.com/' + userId + '/shopping-list.json?auth='+token,
             this.ingredients)
            .map((response: Response) => {
                return response.json();
            });
    }

    fetchList(token: string){
        const userId = this.authService.getActiveUser().uid;

        return this.http
        .get('https://the-recipe-book-app.firebaseio.com/' + userId + '/shopping-list.json')
        .map((response: Response) => {
            return response.json();
        })
        .do((ingredients: Ingredient []) => {
            if(ingredients){
                this.ingredients = ingredients
            } else {
                this.ingredients = [];
            }
        });
    }
 


}