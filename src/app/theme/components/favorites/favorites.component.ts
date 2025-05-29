import { Component, Input, OnInit } from '@angular/core';
import { MenuService } from '../menu/menu.service';

@Component({
standalone: false,
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  toppings;
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  @Input('menuItemsHori') menuItemsHori;
  
  public menuItems;
  public favorites; 
  constructor(public menuService:MenuService) { }

  ngOnInit() {
    this.menuItems = this.menuItemsHori.filter(menu => (menu.routerLink != null || menu.href !=null) && !menu.hasSubMenu);
  }

}
