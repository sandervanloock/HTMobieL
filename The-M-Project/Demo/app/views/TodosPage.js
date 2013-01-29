// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: Demo
// View: TodosPage
// ==========================================================================

m_require('app/views/TodoItemView.js');

Demo.TodosPage = M.PageView.design({

    /* Use the 'events' property to bind events like 'pageshow' */
    events: {
        pageshow: {
            target: Demo.TodoController,
            action: 'init'
        }
    },
    
    cssClass: 'TodosPage',

    childViews: 'header content footer',

    header: M.ToolbarView.design({
        anchorLocation: M.TOP,
        childViews: 'centerLabel toggleView',

        toggleView: M.ToggleView.design({
            childViews: 'button1 button2',

            anchorLocation: M.RIGHT,

            toggleOnClick: YES,

            button1: M.ButtonView.design({
                value: 'Edit',
                icon: 'gear',
                events: {
                    tap: {
                        target: Demo.TodoController,
                        action: 'edit'
                    }
                }
            }),

            button2: M.ButtonView.design({
                value: 'Save',
                icon: 'check',
                events: {
                    tap: {
                        target: Demo.TodoController,
                        action: 'edit'
                    }
                }
            })
        }),

        centerLabel: M.LabelView.design({
            value: 'Todos',
            anchorLocation: M.CENTER
        })
    }),

    content: M.ScrollView.design({
        /* order in childViews string defines render order*/
        childViews: 'counter inputField todoList',

        counter: M.LabelView.design({
            computedValue: {
                contentBinding: {
                    target: Demo.TodoController,
                    property: 'counter'
                },
                value: 0,
                operation: function(v) {
                    if(v == 1) {
                        return v + ' item left.';
                    } else {
                        return v + ' items left.';
                    }
                }
            }
        }),

        inputField: M.TextFieldView.design({
            initialText: 'Enter ToDo Item...',

            events: {
                enter: {
                    target: Demo.TodoController,
                    action: 'addTodo'
                }
            }
        }),

        todoList: M.ListView.design({
            listItemTemplateView: Demo.TodoItemView,
            contentBinding: {
                target: Demo.TodoController,
                property: 'todos'
            }
        })
    }),

    footer: M.ToolbarView.design({
        value: 'FOOTER',
        anchorLocation: M.BOTTOM
    })

});

