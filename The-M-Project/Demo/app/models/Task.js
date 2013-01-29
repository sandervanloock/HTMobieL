// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: Demo
// Model: Task
// ==========================================================================


Demo.Task = M.Model.create({

    __name__: 'Task',

    textmessage: M.Model.attr('String', {
        isRequired:YES
    })

}, M.DataProviderLocalStorage);