// Local storage controller
const StorageCtrl = (function() {
  // Public methods
  return {
    storeItem: function(item) {
      let items;
      // Czy są tu jakieś pozycje w local storage?
      if (localStorage.getItem("items") === null) {
        items = [];
        // Dodaj nową pozycję
        items.push(item);
        // Ustaw local storage
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        // Pozyskaj to co jużjest w local storage
        items = JSON.parse(localStorage.getItem("items"));
        // dodaj nową pozycję
        items.push(item);
        // zresetuj local storage
        localStorage.setItem("items", JSON.stringify(items));
      }
    },
    getItemsFromStorage: function() {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    }
  };
})();

// Items controller (Data structure)
const ItemCtrl = (function() {
  // Item constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Data structure / State
  const data = {
    items: StorageCtrl.getItemsFromStorage(),
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

    getItemById: function(id) {
      let found = null;
      data.items.forEach(item => {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },

    updateItem: function(name, calories) {
      // Calories na number
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(item => {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },

    deleteItem: function(id) {
      // Pozyskaj id przez metodę MAP
      const ids = data.items.map(item => {
        return item.id;
      });
      // Uzyskaj index
      const index = ids.indexOf(id);

      // Usuń pozycję ze struktury danych
      data.items.splice(index, 1);
    },

    clearAllItems: function() {
      data.items = [];
    },

    setCurrentItem: function(item) {
      data.currentItem = item;
    },

    getCurrentItem: function() {
      return data.currentItem;
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
    listItems: "#item-list li",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    clearBtn: ".clear-btn",
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
          <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
        `;
      //   document.querySelector(UISelectors.itemList).appendChild(li);
      //   lub
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },

    updateListItem(item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Zamień nodelistę na tablicę
      listItems = Array.from(listItems);

      listItems.forEach(listItem => {
        const itemID = listItem.getAttribute("id");

        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `
            <strong>${item.name}</strong> <em>${item.calories} kcal</em>
          <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
          `;
        }
      });
    },

    deleteListItem: function(id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);

      item.remove();
    },

    clearList: function() {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      listItems = Array.from(listItems);
      listItems.forEach(item => {
        item.remove();
      });
    },

    clearInputs: function() {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },

    addItemToForm: function() {
      document.querySelector(
        UISelectors.itemNameInput
      ).value = ItemCtrl.getCurrentItem().name;

      document.querySelector(
        UISelectors.itemCaloriesInput
      ).value = ItemCtrl.getCurrentItem().calories;

      UICtrl.showEditState();
    },

    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },

    showEditState: function() {
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },

    showTotalCalories: function(totalCalories) {
      document.querySelector(
        UISelectors.totalCalories
      ).textContent = totalCalories;
    },

    clearEditState: function() {
      UICtrl.clearInputs();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },

    getSelectors: function() {
      return UISelectors;
    }
  };
})();

// App controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
  // Load event listeners
  const loadEventListeners = function() {
    //Pobierz UI selectors
    const UISelectors = UICtrl.getSelectors();

    // Dodaj pozycję
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    // Zdarzenie po kliknięciu na edit button
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemEditClick);

    // Zdarzenie po kliknięciu w przycisk "Zmień"
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", itemUpdateSubmit);

    // Zdarzenie po kliknięciu "Powrót"
    document.querySelector(UISelectors.backBtn).addEventListener("click", e => {
      UICtrl.clearEditState();
      e.preventDefault();
    });

    // Zdarzenie po kliknięciu w przycisk "Usuń"
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", itemDeleteSubmit);

    // Zdarzenie po kliknięciu w przycisk "Wyczyść"
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", clearAllItemsClick);
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

      // Wrzuć do local storage
      StorageCtrl.storeItem(newItem);

      //   Wyczyść inputy
      UICtrl.clearInputs();
    }

    e.preventDefault();
  };

  // Po kliknięciu przejdź do edycji wybranego elementu
  const itemEditClick = function(e) {
    if (e.target.classList.contains("edit-item")) {
      // Pozyskaj ID z list item
      const listID = e.target.parentNode.parentNode.id;
      // Lecz najpierw zamień na tablicę
      const listIdArr = listID.split("-");
      // A następnie pozyskaj numer ID
      const id = parseInt(listIdArr[1]);

      // Get item
      const itemToEdit = ItemCtrl.getItemById(id);

      // Ustaw aktualny item
      ItemCtrl.setCurrentItem(itemToEdit);

      // Dodaj do formularza (UI)
      UICtrl.addItemToForm();

      // Dezaktywuj submit po wciśnięciu entera
      document.addEventListener("keypress", e => {
        if (e.keyCode === 13 || e.which === 13) {
          e.preventDefault();
          return false;
        }
      });
    }
    e.preventDefault();
  };

  const itemUpdateSubmit = function(e) {
    // Pozyskaj input
    const input = UICtrl.getItemInput();

    // Zaktualizuj pozycję
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // Zaktualizuj UI
    UICtrl.updateListItem(updatedItem);

    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();

    e.preventDefault();
  };

  const itemDeleteSubmit = function(e) {
    // pozyskaj obecnie edytowaną pozycję
    const currentItem = ItemCtrl.getCurrentItem();

    // Usuń ze struktury danych
    ItemCtrl.deleteItem(currentItem.id);

    // Usuń z UI
    UICtrl.deleteListItem(currentItem.id);

    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();

    e.preventDefault();
  };

  const clearAllItemsClick = function(e) {
    // Usuń wszystkie pozycje ze struktury danych
    ItemCtrl.clearAllItems();
    // Usuń pozycje z UI

    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);
    UICtrl.clearEditState();
    UICtrl.hideList();
    UICtrl.clearList();
    e.preventDefault();
  };

  // Public methods
  return {
    init: function() {
      // Ustaw stan początkowy
      UICtrl.clearEditState();

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
})(ItemCtrl, StorageCtrl, UICtrl);

App.init();
