interface TodoItem {
    id: number;
    task: string;
    completed: boolean;
    dueDate: Date | null;
  }
  
  
  class TodoList {
    private todos: TodoItem[] = [];
    private nextId: number = 1;
  
    
    addTodo(task: string, dueDate: Date | null = null): void {
      const newTodo: TodoItem = {
        id: this.nextId++,
        task,
        completed: false,
        dueDate
      };
      this.todos.push(newTodo);
    }
  
    
    completeTodo(id: number): void {
      const todo = this.todos.find(todo => todo.id === id);
      if (todo) {
        todo.completed = true;
      } else {
        throw new Error(`Todo with id ${id} not found`);
      }
    }
  
    
    toggleTodo(id: number): void {
      const todo = this.todos.find(todo => todo.id === id);
      if (todo) {
        todo.completed = !todo.completed;
      } else {
        throw new Error(`Todo with id ${id} not found`);
      }
    }
  

    removeTodo(id: number): void {
      const index = this.todos.findIndex(todo => todo.id === id);
      if (index !== -1) {
        this.todos.splice(index, 1);
      } else {
        throw new Error(`Todo with id ${id} not found`);
      }
    }
  

    listTodos(): TodoItem[] {
      return [...this.todos];
    }
  
    
    filterTodos(completed: boolean): TodoItem[] {
      return this.todos.filter(todo => todo.completed === completed);
    }
  
    
    updateTodoTask(id: number, newTask: string): void {
      const todo = this.todos.find(todo => todo.id === id);
      if (todo) {
        todo.task = newTask;
      } else {
        throw new Error(`Todo with id ${id} not found`);
      }
    }
  
    
    updateTodoDueDate(id: number, newDueDate: Date | null): void {
      const todo = this.todos.find(todo => todo.id === id);
      if (todo) {
        todo.dueDate = newDueDate;
      } else {
        throw new Error(`Todo with id ${id} not found`);
      }
    }
  
    
    clearCompleted(): void {
      this.todos = this.todos.filter(todo => !todo.completed);
    }
  }
  
  
  class TodoApp {
    private todoList: TodoList;
    private currentFilter: 'all' | 'active' | 'completed' = 'all';
    
    
    private newTaskInput: HTMLInputElement;
    private dueDateInput: HTMLInputElement;
    private addButton: HTMLButtonElement;
    private todoListElement: HTMLUListElement;
    private filterAllButton: HTMLButtonElement;
    private filterActiveButton: HTMLButtonElement;
    private filterCompletedButton: HTMLButtonElement;
    private clearCompletedButton: HTMLButtonElement;
    
    constructor() {
      this.todoList = new TodoList();
      
      
      this.newTaskInput = document.getElementById('new-task') as HTMLInputElement;
      this.dueDateInput = document.getElementById('due-date') as HTMLInputElement;
      this.addButton = document.getElementById('add-button') as HTMLButtonElement;
      this.todoListElement = document.getElementById('todo-list') as HTMLUListElement;
      this.filterAllButton = document.getElementById('filter-all') as HTMLButtonElement;
      this.filterActiveButton = document.getElementById('filter-active') as HTMLButtonElement;
      this.filterCompletedButton = document.getElementById('filter-completed') as HTMLButtonElement;
      this.clearCompletedButton = document.getElementById('clear-completed') as HTMLButtonElement;
      
      this.setupEventListeners();
      this.renderTodos();
    }
    
    private setupEventListeners(): void {
    
      this.addButton.addEventListener('click', () => this.handleAddTodo());
      this.newTaskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.handleAddTodo();
        }
      });
      
      
      this.filterAllButton.addEventListener('click', () => this.setFilter('all'));
      this.filterActiveButton.addEventListener('click', () => this.setFilter('active'));
      this.filterCompletedButton.addEventListener('click', () => this.setFilter('completed'));
      
      
      this.clearCompletedButton.addEventListener('click', () => this.handleClearCompleted());
    }
    
    private handleAddTodo(): void {
      const task = this.newTaskInput.value.trim();
      if (task) {
        const dueDate = this.dueDateInput.value ? new Date(this.dueDateInput.value) : null;
        this.todoList.addTodo(task, dueDate);
        this.newTaskInput.value = '';
        this.dueDateInput.value = '';
        this.renderTodos();
      }
    }
    
    private handleToggleTodo(id: number): void {
      try {
        this.todoList.toggleTodo(id);
        this.renderTodos();
      } catch (error) {
        console.error(error);
      }
    }
    
    private handleRemoveTodo(id: number): void {
      try {
        this.todoList.removeTodo(id);
        this.renderTodos();
      } catch (error) {
        console.error(error);
      }
    }
    
    private handleEditTodo(todoItem: HTMLLIElement, todo: TodoItem): void {
      
      const editTemplate = document.getElementById('edit-template') as HTMLTemplateElement;
      const editForm = editTemplate.content.cloneNode(true) as DocumentFragment;
      
      
      todoItem.innerHTML = '';
      todoItem.appendChild(editForm);
      
      
      const editInput = todoItem.querySelector('.edit-input') as HTMLInputElement;
      const editDateInput = todoItem.querySelector('.edit-date') as HTMLInputElement;
      const saveButton = todoItem.querySelector('.save-btn') as HTMLButtonElement;
      const cancelButton = todoItem.querySelector('.cancel-btn') as HTMLButtonElement;
      
    
      editInput.value = todo.task;
      if (todo.dueDate) {
        const year = todo.dueDate.getFullYear();
        const month = String(todo.dueDate.getMonth() + 1).padStart(2, '0');
        const day = String(todo.dueDate.getDate()).padStart(2, '0');
        editDateInput.value = `${year}-${month}-${day}`;
      }
      
      
      editInput.focus();
      
      
      saveButton.addEventListener('click', () => {
        const newTask = editInput.value.trim();
        if (newTask) {
          this.todoList.updateTodoTask(todo.id, newTask);
          
          const newDueDate = editDateInput.value ? new Date(editDateInput.value) : null;
          this.todoList.updateTodoDueDate(todo.id, newDueDate);
          
          this.renderTodos();
        }
      });
      
      
      cancelButton.addEventListener('click', () => {
        this.renderTodos();
      });
    }
    
    private handleClearCompleted(): void {
      this.todoList.clearCompleted();
      this.renderTodos();
    }
    
    private setFilter(filter: 'all' | 'active' | 'completed'): void {
      this.currentFilter = filter;
      
      
      this.filterAllButton.classList.toggle('active', filter === 'all');
      this.filterActiveButton.classList.toggle('active', filter === 'active');
      this.filterCompletedButton.classList.toggle('active', filter === 'completed');
      
      this.renderTodos();
    }
    
    private renderTodos(): void {
      
      this.todoListElement.innerHTML = '';
      
      
      let todos: TodoItem[];
      switch (this.currentFilter) {
        case 'active':
          todos = this.todoList.filterTodos(false);
          break;
        case 'completed':
          todos = this.todoList.filterTodos(true);
          break;
        default:
          todos = this.todoList.listTodos();
      }
      
      
      const todoTemplate = document.getElementById('todo-template') as HTMLTemplateElement;
      
      
      todos.forEach(todo => {
        const todoNode = todoTemplate.content.cloneNode(true) as DocumentFragment;
        const todoItem = todoNode.querySelector('.todo-item') as HTMLLIElement;
        const checkbox = todoNode.querySelector('.todo-checkbox') as HTMLInputElement;
        const todoText = todoNode.querySelector('.todo-text') as HTMLSpanElement;
        const todoDate = todoNode.querySelector('.todo-date') as HTMLSpanElement;
        const editButton = todoNode.querySelector('.edit-btn') as HTMLButtonElement;
        const deleteButton = todoNode.querySelector('.delete-btn') as HTMLButtonElement;
        
    
        todoItem.dataset.id = todo.id.toString();
        if (todo.completed) {
          todoItem.classList.add('completed');
        }
        
        checkbox.checked = todo.completed;
        todoText.textContent = todo.task;
        
        if (todo.dueDate) {
          todoDate.textContent = todo.dueDate.toLocaleDateString();
        } else {
          todoDate.style.display = 'none';
        }
        
    
        checkbox.addEventListener('change', () => this.handleToggleTodo(todo.id));
        editButton.addEventListener('click', () => this.handleEditTodo(todoItem, todo));
        deleteButton.addEventListener('click', () => this.handleRemoveTodo(todo.id));
        
        this.todoListElement.appendChild(todoNode);
      });
    }
  }
  
  
  document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
  });
