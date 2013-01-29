// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: Demo
// Controller: TodoController
// ==========================================================================

Demo.TodoController = M.Controller.extend({

    todos: null,

    counter: 0,

    init: function() {
        this.set('todos', Demo.Task.find());
        this.calculateCounter();
    },

    addTodo: function() {
        var textmessage = M.ViewManager.getView('todosPage', 'inputField').value;
        if(!textmessage) {
            return;
        }

        Demo.Task.createRecord({
            textmessage: textmessage
        }).save();

        this.set('todos', Demo.Task.records());

        this.calculateCounter();

        M.ViewManager.getView('todosPage', 'inputField').setValue('');
    },

    removeTodo: function(domId, modelId) {
        var doDelete = confirm('Do you really want to delete this item?');
        if(doDelete) {
            var record = Demo.Task.recordManager.getRecordById(modelId);
            record.del();
            this.set('todos', Demo.Task.records());
            this.calculateCounter();
        }
    },

    calculateCounter: function() {
        this.set('counter', this.todos.length);
    },

    edit: function() {
        M.ViewManager.getView('todosPage', 'todoList').toggleRemove({
            target: this,
            action: 'removeTodo'
        });
    }
});