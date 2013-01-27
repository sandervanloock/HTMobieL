Sencha-Touch-2-Signature-Pad-Field
==================================

Jeff Wooden, 8/2012

The signature pad field is a Sencha Touch 2 formpanel element for drawing signatures. It is an extension of Ext.field.Text with a custom canvas component. The outputted value is a base64 encoded image (string). The extension also includes an Android work around for devices < 3.0. Specifically, the Android developers decided not to build the toDataURL function into android until version 3.0.

Utilizing the component is quite easy, it follows standard ST2 form field config options / parameters. sigWidth and sigHeight will set the dimensions of the overlay canvas object and are the only additional config items in this extension.

Learn more by reading my original blog post: http://morointeractive.com/sencha-touch-2-signature-field-with-android-todataurl-work-around/

Contact & more info at: morointeractive.com

Licensed under the MIT License

Copyright (c) 2012 Moro Interactive

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.