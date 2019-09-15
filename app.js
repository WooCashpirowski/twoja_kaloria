// Local storage controller

// Items controller
const ItemCtrl = (function() {
  // Item constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Data structure / State
  const data = {
    items: [],
    currentItem: null,
    totalCalories: 0
  };

  //   Public methods
  return {
    getItems: function() {
      return data.items;
    },

    addItem: function(name, calories) {
      let ID;
      //   stwórz ID dla dodawanych produktów
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to number
      calories = parseInt(calories);

      // Create new Item
      newItem = new Item(ID, name, calories);

      // Dodaj do itemsów[]
      data.items.push(newItem);

      return newItem;
    },

    getTotalCalories: function() {
      let total = 0;

      // Przejdź przez każdą z pozycji i dodaj kalorie
      data.items.forEach(item => {
        total += item.calories;
      });

      // Suma kalorii
      data.totalCalories = total;

      // Return total
      return data.totalCalories;
    },

    logData: function() {
      return data;
    }
  };
})();

// UI Controller
const UICtrl = (function() {
  const UISelectors = {
    itemList: "#item-list",
    addBtn: ".add-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories"
  };

  // Public methods
  return {
    populateItemList: function(items) {
      let html = "";

      items.forEach(function(item) {
        html += `
              <li class="collection-item" id="item-${item.id}">
          <strong>${item.name}</strong> <em>${item.calories} kcal</em>
          <a href="#" class="secondary-content"><i class="fa fa-pencil"></i></a>
        </li>
              `;
      });

      // Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },

    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      };
    },

    addListItem(item) {
      // Show the list
      document.querySelector(UISelectors.itemList).style.display = "block";
      // Create <li> element
      const li = document.createElement("li");
      li.classList.add("collection-item");
      li.id = `item-${item.id}`;
      li.innerHTML = `
            <strong>${item.name}</strong> <em>${item.calories} kcal</em>
          <a href="#" class="secondary-content"><i class="fa fa-pencil"></i></a>
        `;
      //   document.querySelector(UISelectors.itemList).appendChild(li);
      //   lub
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },

    clearInputs: function() {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },

    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },

    showTotalCalories: function(totalCalories) {
      document.querySelector(
        UISelectors.totalCalories
      ).textContent = totalCalories;
    },
    getSelectors: function() {
      return UISelectors;
    }
  };
})();

// App controller
const App = (function(ItemCtrl, UICtrl) {
  // Load event listeners
  const loadEventListeners = function() {
    //Pobierz UI selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);
  };

  //   Add item submit
  const itemAddSubmit = function(e) {
    // Get form input from UI controller
    const input = UICtrl.getItemInput();

    // Sprawdź czy pola są wypełnione
    if (input.name !== "" && input.calories !== "") {
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // dodaj nowy item do interfejsu użytkownika
      UICtrl.addListItem(newItem);

      // pozyskaj sumę kalorii
      const totalCalories = ItemCtrl.getTotalCalories();
      // Dodaj totalCalories do UI
      UICtrl.showTotalCalories(totalCalories);

      //   Wyczyść inputy
      UICtrl.clearInputs();
    }

    e.preventDefault();
  };

  // Public methods
  return {
    init: function() {
      // Fetch items from data structure
      const items = ItemCtrl.getItems();

      // Sprawdź czy na liście są jakieś items
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // Wypełnij listę itemsami
        UICtrl.populateItemList(items);
      }

      // pozyskaj sumę kalorii
      const totalCalories = ItemCtrl.getTotalCalories();
      // Dodaj totalCalories do UI
      UICtrl.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    }
  };
})(ItemCtrl, UICtrl);

App.init();