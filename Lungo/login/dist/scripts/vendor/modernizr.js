/*!
 * Modernizr v2.6.2
 * www.modernizr.com
 *
 * Copyright (c) Faruk Ates, Paul Irish, Alex Sexton
 * Available under the BSD and MIT licenses: www.modernizr.com/license/
 */

/*
 * Modernizr tests which native CSS3 and HTML5 features are available in
 * the current UA and makes the results available to you in two ways:
 * as properties on a global Modernizr object, and as classes on the
 * <html> element. This information allows you to progressively enhance
 * your pages with a granular level of control over the experience.
 *
 * Modernizr has an optional (not included) conditional resource loader
 * called Modernizr.load(), based on Yepnope.js (yepnopejs.com).
 * To get a build that includes Modernizr.load(), as well as choosing
 * which tests to include, go to www.modernizr.com/download/
 *
 * Authors        Faruk Ates, Paul Irish, Alex Sexton
 * Contributors   Ryan Seddon, Ben Alman
 */

window.Modernizr = (function( window, document, undefined ) {

    var version = '2.6.2',

    Modernizr = {},

    /*>>cssclasses*/
    // option for enabling the HTML classes to be added
    enableClasses = true,
    /*>>cssclasses*/

    docElement = document.documentElement,

    /**
     * Create our "modernizr" element that we do most feature tests on.
     */
    mod = 'modernizr',
    modElem = document.createElement(mod),
    mStyle = modElem.style,

    /**
     * Create the input element for various Web Forms feature tests.
     */
    inputElem /*>>inputelem*/ = document.createElement('input') /*>>inputelem*/ ,

    /*>>smile*/
    smile = ':)',
    /*>>smile*/

    toString = {}.toString,

    // TODO :: make the prefixes more granular
    /*>>prefixes*/
    // List of property values to set for css tests. See ticket #21
    prefixes = ' -webkit- -moz- -o- -ms- '.split(' '),
    /*>>prefixes*/

    /*>>domprefixes*/
    // Following spec is to expose vendor-specific style properties as:
    //   elem.style.WebkitBorderRadius
    // and the following would be incorrect:
    //   elem.style.webkitBorderRadius

    // Webkit ghosts their properties in lowercase but Opera & Moz do not.
    // Microsoft uses a lowercase `ms` instead of the correct `Ms` in IE8+
    //   erik.eae.net/archives/2008/03/10/21.48.10/

    // More here: github.com/Modernizr/Modernizr/issues/issue/21
    omPrefixes = 'Webkit Moz O ms',

    cssomPrefixes = omPrefixes.split(' '),

    domPrefixes = omPrefixes.toLowerCase().split(' '),
    /*>>domprefixes*/

    /*>>ns*/
    ns = {'svg': 'http://www.w3.org/2000/svg'},
    /*>>ns*/

    tests = {},
    inputs = {},
    attrs = {},

    classes = [],

    slice = classes.slice,

    featureName, // used in testing loop


    /*>>teststyles*/
    // Inject element with style element and some CSS rules
    injectElementWithStyles = function( rule, callback, nodes, testnames ) {

      var style, ret, node, docOverflow,
          div = document.createElement('div'),
          // After page load injecting a fake body doesn't work so check if body exists
          body = document.body,
          // IE6 and 7 won't return offsetWidth or offsetHeight unless it's in the body element, so we fake it.
          fakeBody = body || document.createElement('body');

      if ( parseInt(nodes, 10) ) {
          // In order not to give false positives we create a node for each test
          // This also allows the method to scale for unspecified uses
          while ( nodes-- ) {
              node = document.createElement('div');
              node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
              div.appendChild(node);
          }
      }

      // <style> elements in IE6-9 are considered 'NoScope' elements and therefore will be removed
      // when injected with innerHTML. To get around this you need to prepend the 'NoScope' element
      // with a 'scoped' element, in our case the soft-hyphen entity as it won't mess with our measurements.
      // msdn.microsoft.com/en-us/library/ms533897%28VS.85%29.aspx
      // Documents served as xml will throw if using &shy; so use xml friendly encoded version. See issue #277
      style = ['&#173;','<style id="s', mod, '">', rule, '</style>'].join('');
      div.id = mod;
      // IE6 will false positive on some tests due to the style element inside the test div somehow interfering offsetHeight, so insert it into body or fakebody.
      // Opera will act all quirky when injecting elements in documentElement when page is served as xml, needs fakebody too. #270
      (body ? div : fakeBody).innerHTML += style;
      fakeBody.appendChild(div);
      if ( !body ) {
          //avoid crashing IE8, if background image is used
          fakeBody.style.background = '';
          //Safari 5.13/5.1.4 OSX stops loading if ::-webkit-scrollbar is used and scrollbars are visible
          fakeBody.style.overflow = 'hidden';
          docOverflow = docElement.style.overflow;
          docElement.style.overflow = 'hidden';
          docElement.appendChild(fakeBody);
      }

      ret = callback(div, rule);
      // If this is done after page load we don't want to remove the body so check if body exists
      if ( !body ) {
          fakeBody.parentNode.removeChild(fakeBody);
          docElement.style.overflow = docOverflow;
      } else {
          div.parentNode.removeChild(div);
      }

      return !!ret;

    },
    /*>>teststyles*/

    /*>>mq*/
    // adapted from matchMedia polyfill
    // by Scott Jehl and Paul Irish
    // gist.github.com/786768
    testMediaQuery = function( mq ) {

      var matchMedia = window.matchMedia || window.msMatchMedia;
      if ( matchMedia ) {
        return matchMedia(mq).matches;
      }

      var bool;

      injectElementWithStyles('@media ' + mq + ' { #' + mod + ' { position: absolute; } }', function( node ) {
        bool = (window.getComputedStyle ?
                  getComputedStyle(node, null) :
                  node.currentStyle)['position'] == 'absolute';
      });

      return bool;

     },
     /*>>mq*/


    /*>>hasevent*/
    //
    // isEventSupported determines if a given element supports the given event
    // kangax.github.com/iseventsupported/
    //
    // The following results are known incorrects:
    //   Modernizr.hasEvent("webkitTransitionEnd", elem) // false negative
    //   Modernizr.hasEvent("textInput") // in Webkit. github.com/Modernizr/Modernizr/issues/333
    //   ...
    isEventSupported = (function() {

      var TAGNAMES = {
        'select': 'input', 'change': 'input',
        'submit': 'form', 'reset': 'form',
        'error': 'img', 'load': 'img', 'abort': 'img'
      };

      function isEventSupported( eventName, element ) {

        element = element || document.createElement(TAGNAMES[eventName] || 'div');
        eventName = 'on' + eventName;

        // When using `setAttribute`, IE skips "unload", WebKit skips "unload" and "resize", whereas `in` "catches" those
        var isSupported = eventName in element;

        if ( !isSupported ) {
          // If it has no `setAttribute` (i.e. doesn't implement Node interface), try generic element
          if ( !element.setAttribute ) {
            element = document.createElement('div');
          }
          if ( element.setAttribute && element.removeAttribute ) {
            element.setAttribute(eventName, '');
            isSupported = is(element[eventName], 'function');

            // If property was created, "remove it" (by setting value to `undefined`)
            if ( !is(element[eventName], 'undefined') ) {
              element[eventName] = undefined;
            }
            element.removeAttribute(eventName);
          }
        }

        element = null;
        return isSupported;
      }
      return isEventSupported;
    })(),
    /*>>hasevent*/

    // TODO :: Add flag for hasownprop ? didn't last time

    // hasOwnProperty shim by kangax needed for Safari 2.0 support
    _hasOwnProperty = ({}).hasOwnProperty, hasOwnProp;

    if ( !is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined') ) {
      hasOwnProp = function (object, property) {
        return _hasOwnProperty.call(object, property);
      };
    }
    else {
      hasOwnProp = function (object, property) { /* yes, this can give false positives/negatives, but most of the time we don't care about those */
        return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
      };
    }

    // Adapted from ES5-shim https://github.com/kriskowal/es5-shim/blob/master/es5-shim.js
    // es5.github.com/#x15.3.4.5

    if (!Function.prototype.bind) {
      Function.prototype.bind = function bind(that) {

        var target = this;

        if (typeof target != "function") {
            throw new TypeError();
        }

        var args = slice.call(arguments, 1),
            bound = function () {

            if (this instanceof bound) {

              var F = function(){};
              F.prototype = target.prototype;
              var self = new F();

              var result = target.apply(
                  self,
                  args.concat(slice.call(arguments))
              );
              if (Object(result) === result) {
                  return result;
              }
              return self;

            } else {

              return target.apply(
                  that,
                  args.concat(slice.call(arguments))
              );

            }

        };

        return bound;
      };
    }

    /**
     * setCss applies given styles to the Modernizr DOM node.
     */
    function setCss( str ) {
        mStyle.cssText = str;
    }

    /**
     * setCssAll extrapolates all vendor-specific css strings.
     */
    function setCssAll( str1, str2 ) {
        return setCss(prefixes.join(str1 + ';') + ( str2 || '' ));
    }

    /**
     * is returns a boolean for if typeof obj is exactly type.
     */
    function is( obj, type ) {
        return typeof obj === type;
    }

    /**
     * contains returns a boolean for if substr is found within str.
     */
    function contains( str, substr ) {
        return !!~('' + str).indexOf(substr);
    }

    /*>>testprop*/

    // testProps is a generic CSS / DOM property test.

    // In testing support for a given CSS property, it's legit to test:
    //    `elem.style[styleName] !== undefined`
    // If the property is supported it will return an empty string,
    // if unsupported it will return undefined.

    // We'll take advantage of this quick test and skip setting a style
    // on our modernizr element, but instead just testing undefined vs
    // empty string.

    // Because the testing of the CSS property names (with "-", as
    // opposed to the camelCase DOM properties) is non-portable and
    // non-standard but works in WebKit and IE (but not Gecko or Opera),
    // we explicitly reject properties with dashes so that authors
    // developing in WebKit or IE first don't end up with
    // browser-specific content by accident.

    function testProps( props, prefixed ) {
        for ( var i in props ) {
            var prop = props[i];
            if ( !contains(prop, "-") && mStyle[prop] !== undefined ) {
                return prefixed == 'pfx' ? prop : true;
            }
        }
        return false;
    }
    /*>>testprop*/

    // TODO :: add testDOMProps
    /**
     * testDOMProps is a generic DOM property test; if a browser supports
     *   a certain property, it won't return undefined for it.
     */
    function testDOMProps( props, obj, elem ) {
        for ( var i in props ) {
            var item = obj[props[i]];
            if ( item !== undefined) {

                // return the property name as a string
                if (elem === false) return props[i];

                // let's bind a function
                if (is(item, 'function')){
                  // default to autobind unless override
                  return item.bind(elem || obj);
                }

                // return the unbound function or obj or value
                return item;
            }
        }
        return false;
    }

    /*>>testallprops*/
    /**
     * testPropsAll tests a list of DOM properties we want to check against.
     *   We specify literally ALL possible (known and/or likely) properties on
     *   the element including the non-vendor prefixed one, for forward-
     *   compatibility.
     */
    function testPropsAll( prop, prefixed, elem ) {

        var ucProp  = prop.charAt(0).toUpperCase() + prop.slice(1),
            props   = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

        // did they call .prefixed('boxSizing') or are we just testing a prop?
        if(is(prefixed, "string") || is(prefixed, "undefined")) {
          return testProps(props, prefixed);

        // otherwise, they called .prefixed('requestAnimationFrame', window[, elem])
        } else {
          props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
          return testDOMProps(props, prefixed, elem);
        }
    }
    /*>>testallprops*/


    /**
     * Tests
     * -----
     */

    // The *new* flexbox
    // dev.w3.org/csswg/css3-flexbox

    tests['flexbox'] = function() {
      return testPropsAll('flexWrap');
    };

    // The *old* flexbox
    // www.w3.org/TR/2009/WD-css3-flexbox-20090723/

    tests['flexboxlegacy'] = function() {
        return testPropsAll('boxDirection');
    };

    // On the S60 and BB Storm, getContext exists, but always returns undefined
    // so we actually have to call getContext() to verify
    // github.com/Modernizr/Modernizr/issues/issue/97/

    tests['canvas'] = function() {
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    };

    tests['canvastext'] = function() {
        return !!(Modernizr['canvas'] && is(document.createElement('canvas').getContext('2d').fillText, 'function'));
    };

    // webk.it/70117 is tracking a legit WebGL feature detect proposal

    // We do a soft detect which may false positive in order to avoid
    // an expensive context creation: bugzil.la/732441

    tests['webgl'] = function() {
        return !!window.WebGLRenderingContext;
    };

    /*
     * The Modernizr.touch test only indicates if the browser supports
     *    touch events, which does not necessarily reflect a touchscreen
     *    device, as evidenced by tablets running Windows 7 or, alas,
     *    the Palm Pre / WebOS (touch) phones.
     *
     * Additionally, Chrome (desktop) used to lie about its support on this,
     *    but that has since been rectified: crbug.com/36415
     *
     * We also test for Firefox 4 Multitouch Support.
     *
     * For more info, see: modernizr.github.com/Modernizr/touch.html
     */

    tests['touch'] = function() {
        var bool;

        if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
          bool = true;
        } else {
          injectElementWithStyles(['@media (',prefixes.join('touch-enabled),('),mod,')','{#modernizr{top:9px;position:absolute}}'].join(''), function( node ) {
            bool = node.offsetTop === 9;
          });
        }

        return bool;
    };


    // geolocation is often considered a trivial feature detect...
    // Turns out, it's quite tricky to get right:
    //
    // Using !!navigator.geolocation does two things we don't want. It:
    //   1. Leaks memory in IE9: github.com/Modernizr/Modernizr/issues/513
    //   2. Disables page caching in WebKit: webk.it/43956
    //
    // Meanwhile, in Firefox < 8, an about:config setting could expose
    // a false positive that would throw an exception: bugzil.la/688158

    tests['geolocation'] = function() {
        return 'geolocation' in navigator;
    };


    tests['postmessage'] = function() {
      return !!window.postMessage;
    };


    // Chrome incognito mode used to throw an exception when using openDatabase
    // It doesn't anymore.
    tests['websqldatabase'] = function() {
      return !!window.openDatabase;
    };

    // Vendors had inconsistent prefixing with the experimental Indexed DB:
    // - Webkit's implementation is accessible through webkitIndexedDB
    // - Firefox shipped moz_indexedDB before FF4b9, but since then has been mozIndexedDB
    // For speed, we don't test the legacy (and beta-only) indexedDB
    tests['indexedDB'] = function() {
      return !!testPropsAll("indexedDB", window);
    };

    // documentMode logic from YUI to filter out IE8 Compat Mode
    //   which false positives.
    tests['hashchange'] = function() {
      return isEventSupported('hashchange', window) && (document.documentMode === undefined || document.documentMode > 7);
    };

    // Per 1.6:
    // This used to be Modernizr.historymanagement but the longer
    // name has been deprecated in favor of a shorter and property-matching one.
    // The old API is still available in 1.6, but as of 2.0 will throw a warning,
    // and in the first release thereafter disappear entirely.
    tests['history'] = function() {
      return !!(window.history && history.pushState);
    };

    tests['draganddrop'] = function() {
        var div = document.createElement('div');
        return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
    };

    // FF3.6 was EOL'ed on 4/24/12, but the ESR version of FF10
    // will be supported until FF19 (2/12/13), at which time, ESR becomes FF17.
    // FF10 still uses prefixes, so check for it until then.
    // for more ESR info, see: mozilla.org/en-US/firefox/organizations/faq/
    tests['websockets'] = function() {
        return 'WebSocket' in window || 'MozWebSocket' in window;
    };


    // css-tricks.com/rgba-browser-support/
    tests['rgba'] = function() {
        // Set an rgba() color and check the returned value

        setCss('background-color:rgba(150,255,150,.5)');

        return contains(mStyle.backgroundColor, 'rgba');
    };

    tests['hsla'] = function() {
        // Same as rgba(), in fact, browsers re-map hsla() to rgba() internally,
        //   except IE9 who retains it as hsla

        setCss('background-color:hsla(120,40%,100%,.5)');

        return contains(mStyle.backgroundColor, 'rgba') || contains(mStyle.backgroundColor, 'hsla');
    };

    tests['multiplebgs'] = function() {
        // Setting multiple images AND a color on the background shorthand property
        //  and then querying the style.background property value for the number of
        //  occurrences of "url(" is a reliable method for detecting ACTUAL support for this!

        setCss('background:url(https://),url(https://),red url(https://)');

        // If the UA supports multiple backgrounds, there should be three occurrences
        //   of the string "url(" in the return value for elemStyle.background

        return (/(url\s*\(.*?){3}/).test(mStyle.background);
    };



    // this will false positive in Opera Mini
    //   github.com/Modernizr/Modernizr/issues/396

    tests['backgroundsize'] = function() {
        return testPropsAll('backgroundSize');
    };

    tests['borderimage'] = function() {
        return testPropsAll('borderImage');
    };


    // Super comprehensive table about all the unique implementations of
    // border-radius: muddledramblings.com/table-of-css3-border-radius-compliance

    tests['borderradius'] = function() {
        return testPropsAll('borderRadius');
    };

    // WebOS unfortunately false positives on this test.
    tests['boxshadow'] = function() {
        return testPropsAll('boxShadow');
    };

    // FF3.0 will false positive on this test
    tests['textshadow'] = function() {
        return document.createElement('div').style.textShadow === '';
    };


    tests['opacity'] = function() {
        // Browsers that actually have CSS Opacity implemented have done so
        //  according to spec, which means their return values are within the
        //  range of [0.0,1.0] - including the leading zero.

        setCssAll('opacity:.55');

        // The non-literal . in this regex is intentional:
        //   German Chrome returns this value as 0,55
        // github.com/Modernizr/Modernizr/issues/#issue/59/comment/516632
        return (/^0.55$/).test(mStyle.opacity);
    };


    // Note, Android < 4 will pass this test, but can only animate
    //   a single property at a time
    //   daneden.me/2011/12/putting-up-with-androids-bullshit/
    tests['cssanimations'] = function() {
        return testPropsAll('animationName');
    };


    tests['csscolumns'] = function() {
        return testPropsAll('columnCount');
    };


    tests['cssgradients'] = function() {
        /**
         * For CSS Gradients syntax, please see:
         * webkit.org/blog/175/introducing-css-gradients/
         * developer.mozilla.org/en/CSS/-moz-linear-gradient
         * developer.mozilla.org/en/CSS/-moz-radial-gradient
         * dev.w3.org/csswg/css3-images/#gradients-
         */

        var str1 = 'background-image:',
            str2 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));',
            str3 = 'linear-gradient(left top,#9f9, white);';

        setCss(
             // legacy webkit syntax (FIXME: remove when syntax not in use anymore)
              (str1 + '-webkit- '.split(' ').join(str2 + str1) +
             // standard syntax             // trailing 'background-image:'
              prefixes.join(str3 + str1)).slice(0, -str1.length)
        );

        return contains(mStyle.backgroundImage, 'gradient');
    };


    tests['cssreflections'] = function() {
        return testPropsAll('boxReflect');
    };


    tests['csstransforms'] = function() {
        return !!testPropsAll('transform');
    };


    tests['csstransforms3d'] = function() {

        var ret = !!testPropsAll('perspective');

        // Webkit's 3D transforms are passed off to the browser's own graphics renderer.
        //   It works fine in Safari on Leopard and Snow Leopard, but not in Chrome in
        //   some conditions. As a result, Webkit typically recognizes the syntax but
        //   will sometimes throw a false positive, thus we must do a more thorough check:
        if ( ret && 'webkitPerspective' in docElement.style ) {

          // Webkit allows this media query to succeed only if the feature is enabled.
          // `@media (transform-3d),(-webkit-transform-3d){ ... }`
          injectElementWithStyles('@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}', function( node, rule ) {
            ret = node.offsetLeft === 9 && node.offsetHeight === 3;
          });
        }
        return ret;
    };


    tests['csstransitions'] = function() {
        return testPropsAll('transition');
    };


    /*>>fontface*/
    // @font-face detection routine by Diego Perini
    // javascript.nwbox.com/CSSSupport/

    // false positives:
    //   WebOS github.com/Modernizr/Modernizr/issues/342
    //   WP7   github.com/Modernizr/Modernizr/issues/538
    tests['fontface'] = function() {
        var bool;

        injectElementWithStyles('@font-face {font-family:"font";src:url("https://")}', function( node, rule ) {
          var style = document.getElementById('smodernizr'),
              sheet = style.sheet || style.styleSheet,
              cssText = sheet ? (sheet.cssRules && sheet.cssRules[0] ? sheet.cssRules[0].cssText : sheet.cssText || '') : '';

          bool = /src/i.test(cssText) && cssText.indexOf(rule.split(' ')[0]) === 0;
        });

        return bool;
    };
    /*>>fontface*/

    // CSS generated content detection
    tests['generatedcontent'] = function() {
        var bool;

        injectElementWithStyles(['#',mod,'{font:0/0 a}#',mod,':after{content:"',smile,'";visibility:hidden;font:3px/1 a}'].join(''), function( node ) {
          bool = node.offsetHeight >= 3;
        });

        return bool;
    };



    // These tests evaluate support of the video/audio elements, as well as
    // testing what types of content they support.
    //
    // We're using the Boolean constructor here, so that we can extend the value
    // e.g.  Modernizr.video     // true
    //       Modernizr.video.ogg // 'probably'
    //
    // Codec values from : github.com/NielsLeenheer/html5test/blob/9106a8/index.html#L845
    //                     thx to NielsLeenheer and zcorpan

    // Note: in some older browsers, "no" was a return value instead of empty string.
    //   It was live in FF3.5.0 and 3.5.1, but fixed in 3.5.2
    //   It was also live in Safari 4.0.0 - 4.0.4, but fixed in 4.0.5

    tests['video'] = function() {
        var elem = document.createElement('video'),
            bool = false;

        // IE9 Running on Windows Server SKU can cause an exception to be thrown, bug #224
        try {
            if ( bool = !!elem.canPlayType ) {
                bool      = new Boolean(bool);
                bool.ogg  = elem.canPlayType('video/ogg; codecs="theora"')      .replace(/^no$/,'');

                // Without QuickTime, this value will be `undefined`. github.com/Modernizr/Modernizr/issues/546
                bool.h264 = elem.canPlayType('video/mp4; codecs="avc1.42E01E"') .replace(/^no$/,'');

                bool.webm = elem.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,'');
            }

        } catch(e) { }

        return bool;
    };

    tests['audio'] = function() {
        var elem = document.createElement('audio'),
            bool = false;

        try {
            if ( bool = !!elem.canPlayType ) {
                bool      = new Boolean(bool);
                bool.ogg  = elem.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,'');
                bool.mp3  = elem.canPlayType('audio/mpeg;')               .replace(/^no$/,'');

                // Mimetypes accepted:
                //   developer.mozilla.org/En/Media_formats_supported_by_the_audio_and_video_elements
                //   bit.ly/iphoneoscodecs
                bool.wav  = elem.canPlayType('audio/wav; codecs="1"')     .replace(/^no$/,'');
                bool.m4a  = ( elem.canPlayType('audio/x-m4a;')            ||
                              elem.canPlayType('audio/aac;'))             .replace(/^no$/,'');
            }
        } catch(e) { }

        return bool;
    };


    // In FF4, if disabled, window.localStorage should === null.

    // Normally, we could not test that directly and need to do a
    //   `('localStorage' in window) && ` test first because otherwise Firefox will
    //   throw bugzil.la/365772 if cookies are disabled

    // Also in iOS5 Private Browsing mode, attempting to use localStorage.setItem
    // will throw the exception:
    //   QUOTA_EXCEEDED_ERRROR DOM Exception 22.
    // Peculiarly, getItem and removeItem calls do not throw.

    // Because we are forced to try/catch this, we'll go aggressive.

    // Just FWIW: IE8 Compat mode supports these features completely:
    //   www.quirksmode.org/dom/html5.html
    // But IE8 doesn't support either with local files

    tests['localstorage'] = function() {
        try {
            localStorage.setItem(mod, mod);
            localStorage.removeItem(mod);
            return true;
        } catch(e) {
            return false;
        }
    };

    tests['sessionstorage'] = function() {
        try {
            sessionStorage.setItem(mod, mod);
            sessionStorage.removeItem(mod);
            return true;
        } catch(e) {
            return false;
        }
    };


    tests['webworkers'] = function() {
        return !!window.Worker;
    };


    tests['applicationcache'] = function() {
        return !!window.applicationCache;
    };


    // Thanks to Erik Dahlstrom
    tests['svg'] = function() {
        return !!document.createElementNS && !!document.createElementNS(ns.svg, 'svg').createSVGRect;
    };

    // specifically for SVG inline in HTML, not within XHTML
    // test page: paulirish.com/demo/inline-svg
    tests['inlinesvg'] = function() {
      var div = document.createElement('div');
      div.innerHTML = '<svg/>';
      return (div.firstChild && div.firstChild.namespaceURI) == ns.svg;
    };

    // SVG SMIL animation
    tests['smil'] = function() {
        return !!document.createElementNS && /SVGAnimate/.test(toString.call(document.createElementNS(ns.svg, 'animate')));
    };

    // This test is only for clip paths in SVG proper, not clip paths on HTML content
    // demo: srufaculty.sru.edu/david.dailey/svg/newstuff/clipPath4.svg

    // However read the comments to dig into applying SVG clippaths to HTML content here:
    //   github.com/Modernizr/Modernizr/issues/213#issuecomment-1149491
    tests['svgclippaths'] = function() {
        return !!document.createElementNS && /SVGClipPath/.test(toString.call(document.createElementNS(ns.svg, 'clipPath')));
    };

    /*>>webforms*/
    // input features and input types go directly onto the ret object, bypassing the tests loop.
    // Hold this guy to execute in a moment.
    function webforms() {
        /*>>input*/
        // Run through HTML5's new input attributes to see if the UA understands any.
        // We're using f which is the <input> element created early on
        // Mike Taylr has created a comprehensive resource for testing these attributes
        //   when applied to all input types:
        //   miketaylr.com/code/input-type-attr.html
        // spec: www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#input-type-attr-summary

        // Only input placeholder is tested while textarea's placeholder is not.
        // Currently Safari 4 and Opera 11 have support only for the input placeholder
        // Both tests are available in feature-detects/forms-placeholder.js
        Modernizr['input'] = (function( props ) {
            for ( var i = 0, len = props.length; i < len; i++ ) {
                attrs[ props[i] ] = !!(props[i] in inputElem);
            }
            if (attrs.list){
              // safari false positive's on datalist: webk.it/74252
              // see also github.com/Modernizr/Modernizr/issues/146
              attrs.list = !!(document.createElement('datalist') && window.HTMLDataListElement);
            }
            return attrs;
        })('autocomplete autofocus list placeholder max min multiple pattern required step'.split(' '));
        /*>>input*/

        /*>>inputtypes*/
        // Run through HTML5's new input types to see if the UA understands any.
        //   This is put behind the tests runloop because it doesn't return a
        //   true/false like all the other tests; instead, it returns an object
        //   containing each input type with its corresponding true/false value

        // Big thanks to @miketaylr for the html5 forms expertise. miketaylr.com/
        Modernizr['inputtypes'] = (function(props) {

            for ( var i = 0, bool, inputElemType, defaultView, len = props.length; i < len; i++ ) {

                inputElem.setAttribute('type', inputElemType = props[i]);
                bool = inputElem.type !== 'text';

                // We first check to see if the type we give it sticks..
                // If the type does, we feed it a textual value, which shouldn't be valid.
                // If the value doesn't stick, we know there's input sanitization which infers a custom UI
                if ( bool ) {

                    inputElem.value         = smile;
                    inputElem.style.cssText = 'position:absolute;visibility:hidden;';

                    if ( /^range$/.test(inputElemType) && inputElem.style.WebkitAppearance !== undefined ) {

                      docElement.appendChild(inputElem);
                      defaultView = document.defaultView;

                      // Safari 2-4 allows the smiley as a value, despite making a slider
                      bool =  defaultView.getComputedStyle &&
                              defaultView.getComputedStyle(inputElem, null).WebkitAppearance !== 'textfield' &&
                              // Mobile android web browser has false positive, so must
                              // check the height to see if the widget is actually there.
                              (inputElem.offsetHeight !== 0);

                      docElement.removeChild(inputElem);

                    } else if ( /^(search|tel)$/.test(inputElemType) ){
                      // Spec doesn't define any special parsing or detectable UI
                      //   behaviors so we pass these through as true

                      // Interestingly, opera fails the earlier test, so it doesn't
                      //  even make it here.

                    } else if ( /^(url|email)$/.test(inputElemType) ) {
                      // Real url and email support comes with prebaked validation.
                      bool = inputElem.checkValidity && inputElem.checkValidity() === false;

                    } else {
                      // If the upgraded input compontent rejects the :) text, we got a winner
                      bool = inputElem.value != smile;
                    }
                }

                inputs[ props[i] ] = !!bool;
            }
            return inputs;
        })('search tel url email datetime date month week time datetime-local number range color'.split(' '));
        /*>>inputtypes*/
    }
    /*>>webforms*/


    // End of test definitions
    // -----------------------



    // Run through all tests and detect their support in the current UA.
    // todo: hypothetically we could be doing an array of tests and use a basic loop here.
    for ( var feature in tests ) {
        if ( hasOwnProp(tests, feature) ) {
            // run the test, throw the return value into the Modernizr,
            //   then based on that boolean, define an appropriate className
            //   and push it into an array of classes we'll join later.
            featureName  = feature.toLowerCase();
            Modernizr[featureName] = tests[feature]();

            classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
        }
    }

    /*>>webforms*/
    // input tests need to run.
    Modernizr.input || webforms();
    /*>>webforms*/


    /**
     * addTest allows the user to define their own feature tests
     * the result will be added onto the Modernizr object,
     * as well as an appropriate className set on the html element
     *
     * @param feature - String naming the feature
     * @param test - Function returning true if feature is supported, false if not
     */
     Modernizr.addTest = function ( feature, test ) {
       if ( typeof feature == 'object' ) {
         for ( var key in feature ) {
           if ( hasOwnProp( feature, key ) ) {
             Modernizr.addTest( key, feature[ key ] );
           }
         }
       } else {

         feature = feature.toLowerCase();

         if ( Modernizr[feature] !== undefined ) {
           // we're going to quit if you're trying to overwrite an existing test
           // if we were to allow it, we'd do this:
           //   var re = new RegExp("\\b(no-)?" + feature + "\\b");
           //   docElement.className = docElement.className.replace( re, '' );
           // but, no rly, stuff 'em.
           return Modernizr;
         }

         test = typeof test == 'function' ? test() : test;

         if (typeof enableClasses !== "undefined" && enableClasses) {
           docElement.className += ' ' + (test ? '' : 'no-') + feature;
         }
         Modernizr[feature] = test;

       }

       return Modernizr; // allow chaining.
     };


    // Reset modElem.cssText to nothing to reduce memory footprint.
    setCss('');
    modElem = inputElem = null;

    /*>>shiv*/
    /*! HTML5 Shiv v3.6.1 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed */
    ;(function(window, document) {
    /*jshint evil:true */
      /** Preset options */
      var options = window.html5 || {};

      /** Used to skip problem elements */
      var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;

      /** Not all elements can be cloned in IE **/
      var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;

      /** Detect whether the browser supports default html5 styles */
      var supportsHtml5Styles;

      /** Name of the expando, to work with multiple documents or to re-shiv one document */
      var expando = '_html5shiv';

      /** The id for the the documents expando */
      var expanID = 0;

      /** Cached data for each document */
      var expandoData = {};

      /** Detect whether the browser supports unknown elements */
      var supportsUnknownElements;

      (function() {
        try {
            var a = document.createElement('a');
            a.innerHTML = '<xyz></xyz>';
            //if the hidden property is implemented we can assume, that the browser supports basic HTML5 Styles
            supportsHtml5Styles = ('hidden' in a);

            supportsUnknownElements = a.childNodes.length == 1 || (function() {
              // assign a false positive if unable to shiv
              (document.createElement)('a');
              var frag = document.createDocumentFragment();
              return (
                typeof frag.cloneNode == 'undefined' ||
                typeof frag.createDocumentFragment == 'undefined' ||
                typeof frag.createElement == 'undefined'
              );
            }());
        } catch(e) {
          supportsHtml5Styles = true;
          supportsUnknownElements = true;
        }

      }());

      /*--------------------------------------------------------------------------*/

      /**
       * Creates a style sheet with the given CSS text and adds it to the document.
       * @private
       * @param {Document} ownerDocument The document.
       * @param {String} cssText The CSS text.
       * @returns {StyleSheet} The style element.
       */
      function addStyleSheet(ownerDocument, cssText) {
        var p = ownerDocument.createElement('p'),
            parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;

        p.innerHTML = 'x<style>' + cssText + '</style>';
        return parent.insertBefore(p.lastChild, parent.firstChild);
      }

      /**
       * Returns the value of `html5.elements` as an array.
       * @private
       * @returns {Array} An array of shived element node names.
       */
      function getElements() {
        var elements = html5.elements;
        return typeof elements == 'string' ? elements.split(' ') : elements;
      }

        /**
       * Returns the data associated to the given document
       * @private
       * @param {Document} ownerDocument The document.
       * @returns {Object} An object of data.
       */
      function getExpandoData(ownerDocument) {
        var data = expandoData[ownerDocument[expando]];
        if (!data) {
            data = {};
            expanID++;
            ownerDocument[expando] = expanID;
            expandoData[expanID] = data;
        }
        return data;
      }

      /**
       * returns a shived element for the given nodeName and document
       * @memberOf html5
       * @param {String} nodeName name of the element
       * @param {Document} ownerDocument The context document.
       * @returns {Object} The shived element.
       */
      function createElement(nodeName, ownerDocument, data){
        if (!ownerDocument) {
            ownerDocument = document;
        }
        if(supportsUnknownElements){
            return ownerDocument.createElement(nodeName);
        }
        if (!data) {
            data = getExpandoData(ownerDocument);
        }
        var node;

        if (data.cache[nodeName]) {
            node = data.cache[nodeName].cloneNode();
        } else if (saveClones.test(nodeName)) {
            node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
        } else {
            node = data.createElem(nodeName);
        }

        // Avoid adding some elements to fragments in IE < 9 because
        // * Attributes like `name` or `type` cannot be set/changed once an element
        //   is inserted into a document/fragment
        // * Link elements with `src` attributes that are inaccessible, as with
        //   a 403 response, will cause the tab/window to crash
        // * Script elements appended to fragments will execute when their `src`
        //   or `text` property is set
        return node.canHaveChildren && !reSkip.test(nodeName) ? data.frag.appendChild(node) : node;
      }

      /**
       * returns a shived DocumentFragment for the given document
       * @memberOf html5
       * @param {Document} ownerDocument The context document.
       * @returns {Object} The shived DocumentFragment.
       */
      function createDocumentFragment(ownerDocument, data){
        if (!ownerDocument) {
            ownerDocument = document;
        }
        if(supportsUnknownElements){
            return ownerDocument.createDocumentFragment();
        }
        data = data || getExpandoData(ownerDocument);
        var clone = data.frag.cloneNode(),
            i = 0,
            elems = getElements(),
            l = elems.length;
        for(;i<l;i++){
            clone.createElement(elems[i]);
        }
        return clone;
      }

      /**
       * Shivs the `createElement` and `createDocumentFragment` methods of the document.
       * @private
       * @param {Document|DocumentFragment} ownerDocument The document.
       * @param {Object} data of the document.
       */
      function shivMethods(ownerDocument, data) {
        if (!data.cache) {
            data.cache = {};
            data.createElem = ownerDocument.createElement;
            data.createFrag = ownerDocument.createDocumentFragment;
            data.frag = data.createFrag();
        }


        ownerDocument.createElement = function(nodeName) {
          //abort shiv
          if (!html5.shivMethods) {
              return data.createElem(nodeName);
          }
          return createElement(nodeName, ownerDocument, data);
        };

        ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' +
          'var n=f.cloneNode(),c=n.createElement;' +
          'h.shivMethods&&(' +
            // unroll the `createElement` calls
            getElements().join().replace(/\w+/g, function(nodeName) {
              data.createElem(nodeName);
              data.frag.createElement(nodeName);
              return 'c("' + nodeName + '")';
            }) +
          ');return n}'
        )(html5, data.frag);
      }

      /*--------------------------------------------------------------------------*/

      /**
       * Shivs the given document.
       * @memberOf html5
       * @param {Document} ownerDocument The document to shiv.
       * @returns {Document} The shived document.
       */
      function shivDocument(ownerDocument) {
        if (!ownerDocument) {
            ownerDocument = document;
        }
        var data = getExpandoData(ownerDocument);

        if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
          data.hasCSS = !!addStyleSheet(ownerDocument,
            // corrects block display not defined in IE6/7/8/9
            'article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}' +
            // adds styling not present in IE6/7/8/9
            'mark{background:#FF0;color:#000}'
          );
        }
        if (!supportsUnknownElements) {
          shivMethods(ownerDocument, data);
        }
        return ownerDocument;
      }

      /*--------------------------------------------------------------------------*/

      /**
       * The `html5` object is exposed so that more elements can be shived and
       * existing shiving can be detected on iframes.
       * @type Object
       * @example
       *
       * // options can be changed before the script is included
       * html5 = { 'elements': 'mark section', 'shivCSS': false, 'shivMethods': false };
       */
      var html5 = {

        /**
         * An array or space separated string of node names of the elements to shiv.
         * @memberOf html5
         * @type Array|String
         */
        'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video',

        /**
         * A flag to indicate that the HTML5 style sheet should be inserted.
         * @memberOf html5
         * @type Boolean
         */
        'shivCSS': (options.shivCSS !== false),

        /**
         * Is equal to true if a browser supports creating unknown/HTML5 elements
         * @memberOf html5
         * @type boolean
         */
        'supportsUnknownElements': supportsUnknownElements,

        /**
         * A flag to indicate that the document's `createElement` and `createDocumentFragment`
         * methods should be overwritten.
         * @memberOf html5
         * @type Boolean
         */
        'shivMethods': (options.shivMethods !== false),

        /**
         * A string to describe the type of `html5` object ("default" or "default print").
         * @memberOf html5
         * @type String
         */
        'type': 'default',

        // shivs the document according to the specified `html5` object options
        'shivDocument': shivDocument,

        //creates a shived element
        createElement: createElement,

        //creates a shived documentFragment
        createDocumentFragment: createDocumentFragment
      };

      /*--------------------------------------------------------------------------*/

      // expose html5
      window.html5 = html5;

      // shiv the document
      shivDocument(document);

    }(this, document));
    /*>>shiv*/

    // Assign private properties to the return object with prefix
    Modernizr._version      = version;

    // expose these for the plugin API. Look in the source for how to join() them against your input
    /*>>prefixes*/
    Modernizr._prefixes     = prefixes;
    /*>>prefixes*/
    /*>>domprefixes*/
    Modernizr._domPrefixes  = domPrefixes;
    Modernizr._cssomPrefixes  = cssomPrefixes;
    /*>>domprefixes*/

    /*>>mq*/
    // Modernizr.mq tests a given media query, live against the current state of the window
    // A few important notes:
    //   * If a browser does not support media queries at all (eg. oldIE) the mq() will always return false
    //   * A max-width or orientation query will be evaluated against the current state, which may change later.
    //   * You must specify values. Eg. If you are testing support for the min-width media query use:
    //       Modernizr.mq('(min-width:0)')
    // usage:
    // Modernizr.mq('only screen and (max-width:768)')
    Modernizr.mq            = testMediaQuery;
    /*>>mq*/

    /*>>hasevent*/
    // Modernizr.hasEvent() detects support for a given event, with an optional element to test on
    // Modernizr.hasEvent('gesturestart', elem)
    Modernizr.hasEvent      = isEventSupported;
    /*>>hasevent*/

    /*>>testprop*/
    // Modernizr.testProp() investigates whether a given style property is recognized
    // Note that the property names must be provided in the camelCase variant.
    // Modernizr.testProp('pointerEvents')
    Modernizr.testProp      = function(prop){
        return testProps([prop]);
    };
    /*>>testprop*/

    /*>>testallprops*/
    // Modernizr.testAllProps() investigates whether a given style property,
    //   or any of its vendor-prefixed variants, is recognized
    // Note that the property names must be provided in the camelCase variant.
    // Modernizr.testAllProps('boxSizing')
    Modernizr.testAllProps  = testPropsAll;
    /*>>testallprops*/


    /*>>teststyles*/
    // Modernizr.testStyles() allows you to add custom styles to the document and test an element afterwards
    // Modernizr.testStyles('#modernizr { position:absolute }', function(elem, rule){ ... })
    Modernizr.testStyles    = injectElementWithStyles;
    /*>>teststyles*/


    /*>>prefixed*/
    // Modernizr.prefixed() returns the prefixed or nonprefixed property name variant of your input
    // Modernizr.prefixed('boxSizing') // 'MozBoxSizing'

    // Properties must be passed as dom-style camelcase, rather than `box-sizing` hypentated style.
    // Return values will also be the camelCase variant, if you need to translate that to hypenated style use:
    //
    //     str.replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-');

    // If you're trying to ascertain which transition end event to bind to, you might do something like...
    //
    //     var transEndEventNames = {
    //       'WebkitTransition' : 'webkitTransitionEnd',
    //       'MozTransition'    : 'transitionend',
    //       'OTransition'      : 'oTransitionEnd',
    //       'msTransition'     : 'MSTransitionEnd',
    //       'transition'       : 'transitionend'
    //     },
    //     transEndEventName = transEndEventNames[ Modernizr.prefixed('transition') ];

    Modernizr.prefixed      = function(prop, obj, elem){
      if(!obj) {
        return testPropsAll(prop, 'pfx');
      } else {
        // Testing DOM property e.g. Modernizr.prefixed('requestAnimationFrame', window) // 'mozRequestAnimationFrame'
        return testPropsAll(prop, obj, elem);
      }
    };
    /*>>prefixed*/


    /*>>cssclasses*/
    // Remove "no-js" class from <html> element, if it exists:
    docElement.className = docElement.className.replace(/(^|\s)no-js(\s|$)/, '$1$2') +

                            // Add the new classes to the <html> element.
                            (enableClasses ? ' js ' + classes.join(' ') : '');
    /*>>cssclasses*/

    return Modernizr;

})(this, this.document);

a,abbr,address,article,aside,audio,b,blockquote,body,caption,cite,code,dd,del,dfn,dialog,div,dl,dt,em,fieldset,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,hr,html,i,iframe,img,ins,kbd,label,legend,li,mark,menu,nav,object,ol,p,pre,q,samp,section,small,span,strong,sub,sup,table,tbody,td,tfoot,th,thead,time,tr,ul,var,video{border:0;margin:0;outline:0;padding:0;font-size:100%;font-weight:normal}
article,aside,details,figcaption,figure,footer,header,hgroup,nav,section{display:block}
audio,canvas,video display: inline-block *display: inline *zoom: 1,audio:not([controls]) display: none,[hidden] display: none,html{height:100%;font-size:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
body{margin:0;padding:0;width:100%;height:100%;-webkit-user-select:none;-webkit-touch-callout:none;-webkit-box-orient:vertical;-webkit-box-align:stretch;-webkit-tap-highlight-color:rgba(0,0,0,0);display:-webkit-box;}
body *{box-sizing:border-box;margin:0;padding:0;-webkit-user-select:none;-webkit-tap-highlight-color:rgba(255,255,255,0)}
a{text-decoration:none;-webkit-tap-highlight-color:rgba(0,0,0,0);}
a:hover{opacity:1}
img{border:0;-ms-interpolation-mode:bicubic;vertical-align:middle;font-size:0}
table{border-collapse:collapse;border-spacing:0}
th,td,caption{vertical-align:top;text-align:left}

body[data-position="absolute"] > section{position:absolute}
body[data-position="fixed"] > section{position:fixed}
body [data-transition]{display:block !important;-webkit-transition-property:opacity z-index transform;-moz-transition-property:opacity z-index transform;transition-property:opacity z-index transform;-webkit-transition-duration:350ms;-moz-transition-duration:350ms;transition-duration:350ms;-webkit-transition-timing-function:easeOutSine;-moz-transition-timing-function:easeOutSine;transition-timing-function:easeOutSine;-webkit-backface-visibility:hidden;-moz-backface-visibility:hidden;backface-visibility:hidden}
section{top:0;left:0;width:100%;height:100%;z-index:1;display:none;}
section.show{z-index:2;display:block}
section[data-transition="pop"]{opacity:0;-webkit-transform:scale(1.15);-moz-transform:scale(1.15);transform:scale(1.15);}
section[data-transition="pop"].show{-webkit-transform:scale(1);-moz-transform:scale(1);transform:scale(1);opacity:1}
section[data-transition="pop"].hide{-webkit-transform:scale(.9);-moz-transform:scale(.9);transform:scale(.9);opacity:0}
section[data-transition="slide"]{-webkit-transform:translateX(100%);-moz-transform:translateX(100%);transform:translateX(100%);visibility:visible !important;}
section[data-transition="slide"].show{-webkit-transform:translateX(0%);-moz-transform:translateX(0%);transform:translateX(0%)}
section[data-transition="slide"].hide{-webkit-transform:translateX(-100%);-moz-transform:translateX(-100%);transform:translateX(-100%)}
section[data-transition="cover"]{-webkit-transform:translateY(110%);-moz-transform:translateY(110%);transform:translateY(110%);}
section[data-transition="cover"].show,section[data-transition="cover"].hide{-webkit-transform:translateY(0%);-moz-transform:translateY(0%);transform:translateY(0%)}
section[data-transition="fade"]{opacity:0;}
section[data-transition="fade"]:first-child,section[data-transition="fade"].show{opacity:1}
section[data-transition="fade"]:hide{opacity:0}
header,footer{position:absolute;left:0;width:100%;display:block;z-index:1}
header{top:0;height:44px;line-height:44px;}
header .title{margin-left:4px;float:left;z-index:-1;font-size:1.44em;}
header .title.centered{position:absolute;left:32px;right:32px;text-align:center;display:inline-block}
header img.title{height:26px;margin:9px auto}
footer{bottom:0;height:44px}

article{position:absolute;top:0;bottom:0;width:inherit;height:auto;visibility:hidden;display:none;z-index:0;}
.show > article.active,.hide > article.active,.hiding > article.active{visibility:visible;display:block;z-index:1;}
.show > article.active.pull,.hide > article.active.pull,.hiding > article.active.pull{-webkit-transition-property:transform;-moz-transition-property:transform;transition-property:transform;-webkit-transition-duration:350ms;-moz-transition-duration:350ms;transition-duration:350ms}
header:not(.extended) ~ article{top:44px}
header.extended ~ article{top:74px}
footer ~ article{bottom:44px}
@media handheld, only screen and (min-width: 768px){article.aside{-webkit-transform:translate3d(0,0,0);-moz-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}
}
section.aside:not(.small){-webkit-transform:translateX(264px);-moz-transform:translateX(264px);transform:translateX(264px)}
section.aside.small{-webkit-transform:translateX(64px);-moz-transform:translateX(64px);transform:translateX(64px)}
section.aside.right{-webkit-transform:translateX(-264px);-moz-transform:translateX(-264px);transform:translateX(-264px);}
section.aside.right.small{-webkit-transform:translateX(-64px);-moz-transform:translateX(-64px);transform:translateX(-64px)}
aside{position:absolute;top:0;bottom:0;height:inherit;width:264px;display:none;z-index:-1;}
aside.right{right:0}
aside.show{z-index:0;display:block}
aside header,aside footer{position:relative;left:none;height:44px}
aside footer{position:absolute;bottom:0}
aside.small{width:64px;}
aside.small nav{width:64px;text-align:center;}
aside.small nav a{display:block;padding:0;width:64px;height:64px;}
aside.small nav a .icon{position:absolute;width:inherit;font-size:48px;line-height:56px}
aside.small nav a .tag{position:relative;top:-64px;right:-18.823529411764707px}
aside.small nav a:first-child{margin-top:8px}

.row,.rows{width:100%;margin:0 auto;*zoom:1;}
.row:before,.rows:before,.row:after,.rows:after{content:"";display:table}
.row:after,.rows:after{clear:both}
.row.one,.rows.one{height:10%}
.row.two,.rows.two{height:20%}
.row.three,.rows.three{height:30%}
.row.four,.rows.four{height:40%}
.row.five,.rows.five{height:50%}
.row.six,.rows.six{height:60%}
.row.seven,.rows.seven{height:70%}
.row.eight,.rows.eight{height:80%}
.row.nine,.rows.nine{height:90%}
.row.ten,.rows.ten{height:100%}
.column,.columns{float:left;position:relative;display:block;height:100%;}
.column.centered,.columns.centered{float:none;margin:0 auto}
.column.one,.columns.one{width:10%}
.column.two,.columns.two{width:20%}
.column.three,.columns.three{width:30%}
.column.four,.columns.four{width:40%}
.column.five,.columns.five{width:50%}
.column.six,.columns.six{width:60%}
.column.seven,.columns.seven{width:70%}
.column.eight,.columns.eight{width:80%}
.column.nine,.columns.nine{width:90%}
.column.ten,.columns.ten{width:100%}
[class*="column"] + [class*="column"]:last-child{float:right}
[class*="column"] + [class*="column"].end{float:left}

.list li{list-style-type:none;padding:10px;position:relative;}
.list li,.list li a,.list li small,.list li .right{font-weight:300}
.list li.arrow::after{position:absolute;right:8px;top:40%;width:6px;height:6px;content:'';border-right:3px solid #d0d0d8;border-top:3px solid #d0d0d8;-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);transform:rotate(45deg)}
.list li a{display:block}
.list li > .icon,.list li > img{float:left;width:32px;height:32px;margin-right:8px;font-size:2.6em;line-height:1em;text-align:center}
.list li.thumb img,.list li.thumb .icon{margin:-10px 10px -10px -10px;height:53px !important;width:53px !important;font-size:3.6em}
.list li.anchor{padding:2px 10px;}
.list li.anchor .tag{display:none}
.list li strong{position:relative;font-size:1.2em;font-weight:400}
.list li small{display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}
.list li small + .right{margin-top:-12px}
.list li small,.list li.anchor,.list li .right:not(.tag){font-size:.9em}
.list .loading .right{font-size:1em}
.list .right .icon,.list small .icon{height:13px !important;width:13px !important;margin-right:1px !important;font-size:1.2em !important;line-height:1.1em}
.list.indented li{margin-bottom:10px}

nav.groupbar,footer nav{display:-webkit-box;display:-moz-box;display:box;-webkit-box-pack:justify;-moz-box-pack:justify;box-pack:justify;width:100%;}
nav.groupbar > a,footer nav > a{-webkit-box-flex:1;-moz-box-flex:1;box-flex:1}
header nav a{padding:0 11px !important;z-index:1000;float:left}
header nav .button,header nav button{margin:6px 2px 0 2px;line-height:31px !important;}
header nav .button > .icon,header nav button > .icon{font-size:1.5em;position:relative;top:3px;height:20px;width:20px;line-height:20px;display:inline-block}
header nav.right a.button:last-child{margin-right:6px}
header nav:not(.right) a.button:first-child{margin-left:6px}
header nav a:not(.button){height:44px;}
header nav a:not(.button) > .icon{font-size:1.8em}
header nav .tag{position:relative;top:-12px;left:-12px;margin-right:-20px}
header nav abbr{font-size:.9em;font-weight:700}
header nav .icon ~ abbr{margin-left:4px;float:right}
header nav .loading{margin-top:.5em;font-size:1.6em;}
header nav .loading + .icon{display:none}
nav.groupbar{position:relative;top:44px;height:30px;width:100%;z-index:2;line-height:30px;}
nav.groupbar > a{padding:0;margin:0;height:30px !important;display:block;text-align:center;}
nav.groupbar > a .icon{font-size:1em;margin-right:2px}
nav.groupbar > a .tag{position:relative;top:-1px;left:2px}
footer nav a{text-align:center;display:block;padding:0;height:44px}
footer nav .icon{font-size:2em !important;line-height:44px;width:32px;display:inline-block}
footer nav .tag{top:-42px;left:4px;}
footer nav .tag .loading{top:0;font-size:1.4em}
footer nav abbr{display:none}
footer nav .tag{position:relative;top:-12px;left:-12px;margin-right:-20px}
footer nav.with-labels .icon{line-height:36px}
footer nav.with-labels abbr{display:block !important;margin-top:-8px;z-index:1;font-size:11px;line-height:14px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}

.overthrow-enabled .overthrow{overflow:auto;-webkit-overflow-scrolling:touch}
.scroll{overflow-x:hidden;overflow-y:scroll;-webkit-overflow-scrolling:touch;-webkit-box-flex:1;}
.scroll.horizontal{overflow-x:scroll;overflow-y:hidden;white-space:nowrap}
.scroll > *{-webkit-transform:translate3d(0,0,0)}
:not(.icon).left{float:left}
:not(.icon).right{float:right}
.hidden{display:none}
.indented > *{margin:10px}
.margined{margin:3%}
.wrapper{padding:8px 8px}
.icon.small{font-size:1.3em}
.framed{border:2px solid #fff}
.round{-webkit-border-radius:4px;-moz-border-radius:4px;border-radius:4px}
.block{display:block}
.tag{display:inline-block;padding:0 3px;font-size:11px !important;line-height:1.25em;height:1.35em;text-align:center}
.margin.bottom{margin-bottom:5px}
[data-control=carousel]{overflow:hidden;list-style:none;margin:0}
.text.thin{font-weight:300}
.text.normal{font-weight:400}
.text.bold{font-weight:600}
.text.extra-bold{font-weight:700}
.text.italic{font-style:italic}
.text.underline{text-decoration:underline}
.text.line-through{text-decoration:line-through}
.text.align_left{text-align:left}
.text.align_right{text-align:right}
.text.align_center{text-align:center}
.text.align_justify{text-align:justify}
.text.small{font-size:.9em}
.text.big{font-size:1.2em}
.text.opacity{opacity:.5}

.button,button{display:inline-block;padding:10px 16px;border:none;cursor:pointer;color:#fff !important;font-family:inherit;font-size:1.05em;font-weight:600;text-align:center;text-decoration:none;outline:none;}
.button:disabled,button:disabled,.button.disabled,button.disabled{background:rgba(255,255,255,0.2);color:#999 !important}
.button .icon,button .icon{font-size:1.2em}
.button.anchor,button.anchor{width:100%;position:relative;}
.button.anchor .icon,button.anchor .icon{position:absolute;left:8px}
.button.large,button.large{height:52px;padding:0 24px;font-size:1.4em;line-height:52px}
.button.small,button.small{height:30px;padding:0 8px;font-size:.9em;line-height:28px}

form label,.form label{font-size:1.1em}
form input,.form input,form textarea,.form textarea,form select,.form select,form .progress,.form .progress{margin-bottom:8px;font-size:1.2em}
form input[type="text"],.form input[type="text"],form input[type="password"],.form input[type="password"],form input[type="date"],.form input[type="date"],form input[type="datetime"],.form input[type="datetime"],form input[type="email"],.form input[type="email"],form input[type="number"],.form input[type="number"],form input[type="search"],.form input[type="search"],form input[type="tel"],.form input[type="tel"],form input[type="time"],.form input[type="time"],form input[type="url"],.form input[type="url"],form select,.form select,form textarea,.form textarea{display:block;width:100%;padding:0 6px;height:30px;-webkit-transition:all .15s linear;-moz-transition:all .15s linear;transition:all .15s linear;font-family:inherit;-webkit-appearance:none;-webkit-user-select:text;-webkit-font-smoothing:antialiased;}
form input[type="text"]:focus,.form input[type="text"]:focus,form input[type="password"]:focus,.form input[type="password"]:focus,form input[type="date"]:focus,.form input[type="date"]:focus,form input[type="datetime"]:focus,.form input[type="datetime"]:focus,form input[type="email"]:focus,.form input[type="email"]:focus,form input[type="number"]:focus,.form input[type="number"]:focus,form input[type="search"]:focus,.form input[type="search"]:focus,form input[type="tel"]:focus,.form input[type="tel"]:focus,form input[type="time"]:focus,.form input[type="time"]:focus,form input[type="url"]:focus,.form input[type="url"]:focus,form select:focus,.form select:focus,form textarea:focus,.form textarea:focus{outline:none !important}
form textarea,.form textarea{min-height:64px}
form fieldset,.form fieldset{padding:8px 8px 0 8px;}
form fieldset label,.form fieldset label{display:inline-block;float:left;width:20%;line-height:30px}
form fieldset label + input,.form fieldset label + input{width:80% !important}
form fieldset .icon,.form fieldset .icon{position:absolute;font-size:1.2em;line-height:30px;right:8px}
form fieldset input[type="text"],.form fieldset input[type="text"],form fieldset input[type="password"],.form fieldset input[type="password"],form fieldset input[type="date"],.form fieldset input[type="date"],form fieldset input[type="datetime"],.form fieldset input[type="datetime"],form fieldset input[type="email"],.form fieldset input[type="email"],form fieldset input[type="number"],.form fieldset input[type="number"],form fieldset input[type="search"],.form fieldset input[type="search"],form fieldset input[type="tel"],.form fieldset input[type="tel"],form fieldset input[type="time"],.form fieldset input[type="time"],form fieldset input[type="url"],.form fieldset input[type="url"],form fieldset textarea,.form fieldset textarea{-webkit-box-shadow:none;-moz-box-shadow:none;box-shadow:none;border:none;padding:0;}
form fieldset input[type="text"],.form fieldset input[type="text"],form fieldset input[type="password"],.form fieldset input[type="password"],form fieldset input[type="date"],.form fieldset input[type="date"],form fieldset input[type="datetime"],.form fieldset input[type="datetime"],form fieldset input[type="email"],.form fieldset input[type="email"],form fieldset input[type="number"],.form fieldset input[type="number"],form fieldset input[type="search"],.form fieldset input[type="search"],form fieldset input[type="tel"],.form fieldset input[type="tel"],form fieldset input[type="time"],.form fieldset input[type="time"],form fieldset input[type="url"],.form fieldset input[type="url"],form fieldset textarea,.form fieldset textarea,form fieldset input[type="text"]:focus,.form fieldset input[type="text"]:focus,form fieldset input[type="password"]:focus,.form fieldset input[type="password"]:focus,form fieldset input[type="date"]:focus,.form fieldset input[type="date"]:focus,form fieldset input[type="datetime"]:focus,.form fieldset input[type="datetime"]:focus,form fieldset input[type="email"]:focus,.form fieldset input[type="email"]:focus,form fieldset input[type="number"]:focus,.form fieldset input[type="number"]:focus,form fieldset input[type="search"]:focus,.form fieldset input[type="search"]:focus,form fieldset input[type="tel"]:focus,.form fieldset input[type="tel"]:focus,form fieldset input[type="time"]:focus,.form fieldset input[type="time"]:focus,form fieldset input[type="url"]:focus,.form fieldset input[type="url"]:focus,form fieldset textarea:focus,.form fieldset textarea:focus{background:none}
form label.select,.form label.select{position:relative;display:inline-block;width:100%;font-size:inherit;line-height:inherit}
form .select:after,.form .select:after{position:absolute;top:0;right:0;height:30px;width:30px;content:"▼";pointer-events:none;text-align:center;line-height:32px}
form input[type=range],.form input[type=range]{-webkit-appearance:none;outline:none;}
form input[type=range]:not(.checkbox),.form input[type=range]:not(.checkbox){height:15px;width:100%;padding:0;margin-top:2px;border:0;}
form input[type=range]:not(.checkbox)::-webkit-slider-thumb,.form input[type=range]:not(.checkbox)::-webkit-slider-thumb{top:-1px}
form input[type=range].checkbox,.form input[type=range].checkbox{width:64px;height:30px;line-height:30px;padding:0 1px;-webkit-border-radius:2px;-moz-border-radius:2px;border-radius:2px;}
form input[type=range].checkbox:after,.form input[type=range].checkbox:after{top:-28px;position:relative;content:"OFF";float:right;padding:0 8px;font-weight:700;font-size:12px;line-height:28px}
form input[type=range].checkbox.active:after,.form input[type=range].checkbox.active:after{float:left;content:"ON"}
form input[type=range]::-webkit-slider-thumb,.form input[type=range]::-webkit-slider-thumb{position:relative;width:24px;height:24px;margin:2px;-webkit-appearance:none}
form input[type=range]::-webkit-slider-thumb::after,.form input[type=range]::-webkit-slider-thumb::after{width:6px;height:6px;display:block;content:"";position:relative;-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px;z-index:9;top:8.5px;left:8.5px}
form .progress,.form .progress{width:100%;}
form .progress .bar,.form .progress .bar{height:15px;line-height:15px;display:block;}
form .progress .bar .value,.form .progress .bar .value{display:block;height:inherit;width:0%;-webkit-transition:width 350ms easeOutSine;-moz-transition:width 350ms easeOutSine;transition:width 350ms easeOutSine}
@media screen and (-webkit-min-device-pixel-ratio:0){.custom-select select{padding-right:30px}
}
.loading{position:relative;left:50%;height:1em;width:1em;margin-left:-.5em;-webkit-transform-origin:.5em .5em;-moz-transform-origin:.5em .5em;transform-origin:.5em .5em;font-size:48px;}
.loading.disable{-webkit-animation:none;-moz-animation:none;display:none}
.loading > span{left:50%;margin-left:-.05em;}
.loading > span,.loading > span::before,.loading > span::after{display:block;position:absolute;width:.1em;height:.25em;top:0;-webkit-transform-origin:.05em .5em;-moz-transform-origin:.05em .5em;transform-origin:.05em .5em;-webkit-border-radius:.1em;-moz-border-radius:.1em;border-radius:.1em}
.loading > span::before,.loading > span::after{content:" "}
.loading > span.top{-webkit-transform:rotate(0);-moz-transform:rotate(0);transform:rotate(0)}
.loading > span.right{-webkit-transform:rotate(90deg);-moz-transform:rotate(90deg);transform:rotate(90deg)}
.loading > span.bottom{-webkit-transform:rotate(180deg);-moz-transform:rotate(180deg);transform:rotate(180deg)}
.loading > span.left{-webkit-transform:rotate(270deg);-moz-transform:rotate(270deg);transform:rotate(270deg)}
.loading > span::before{-webkit-transform:rotate(30deg);-moz-transform:rotate(30deg);transform:rotate(30deg)}
.loading > span::after{-webkit-transform:rotate(-30deg);-moz-transform:rotate(-30deg);transform:rotate(-30deg)}
.loading > span.top{background-color:rgba(0,0,0,0.99)}
.loading > span.top::after{background-color:rgba(0,0,0,0.9)}
.loading > span.left::before{background-color:rgba(0,0,0,0.8)}
.loading > span.left{background-color:rgba(0,0,0,0.7)}
.loading > span.left::after{background-color:rgba(0,0,0,0.6)}
.loading > span.bottom::before{background-color:rgba(0,0,0,0.5)}
.loading > span.bottom{background-color:rgba(0,0,0,0.4)}
.loading > span.bottom::after{background-color:rgba(0,0,0,0.35)}
.loading > span.right::before{background-color:rgba(0,0,0,0.3)}
.loading > span.right{background-color:rgba(0,0,0,0.25)}
.loading > span.right::after{background-color:rgba(0,0,0,0.2)}
.loading > span.top::before{background-color:rgba(0,0,0,0.15)}
.loading.white > span.top{background-color:rgba(255,255,255,0.99)}
.loading.white > span.top::after{background-color:rgba(255,255,255,0.9)}
.loading.white > span.left::before{background-color:rgba(255,255,255,0.8)}
.loading.white > span.left{background-color:rgba(255,255,255,0.7)}
.loading.white > span.left::after{background-color:rgba(255,255,255,0.6)}
.loading.white > span.bottom::before{background-color:rgba(255,255,255,0.5)}
.loading.white > span.bottom{background-color:rgba(255,255,255,0.4)}
.loading.white > span.bottom::after{background-color:rgba(255,255,255,0.35)}
.loading.white > span.right::before{background-color:rgba(255,255,255,0.3)}
.loading.white > span.right{background-color:rgba(255,255,255,0.25)}
.loading.white > span.right::after{background-color:rgba(255,255,255,0.2)}
.loading.white > span.top::before{background-color:rgba(255,255,255,0.15)}
section.show .loading,section.active .loading,.notification .loading{-webkit-animation:rotatingLoader .5s infinite linear;moz-animation:rotatingLoader .5s infinite linear}
@-webkit-keyframes rotatingLoader{0%{-webkit-transform:rotate(0);-moz-transform:rotate(0);transform:rotate(0)}
8.32%{-webkit-transform:rotate(0);-moz-transform:rotate(0);transform:rotate(0)}
8.33%{-webkit-transform:rotate(30deg);-moz-transform:rotate(30deg);transform:rotate(30deg)}
16.65%{-webkit-transform:rotate(30deg);-moz-transform:rotate(30deg);transform:rotate(30deg)}
16.66%{-webkit-transform:rotate(60deg);-moz-transform:rotate(60deg);transform:rotate(60deg)}
24.99%{-webkit-transform:rotate(60deg);-moz-transform:rotate(60deg);transform:rotate(60deg)}
25%{-webkit-transform:rotate(90deg);-moz-transform:rotate(90deg);transform:rotate(90deg)}
33.32%{-webkit-transform:rotate(90deg);-moz-transform:rotate(90deg);transform:rotate(90deg)}
33.33%{-webkit-transform:rotate(120deg);-moz-transform:rotate(120deg);transform:rotate(120deg)}
41.65%{-webkit-transform:rotate(120deg);-moz-transform:rotate(120deg);transform:rotate(120deg)}
41.66%{-webkit-transform:rotate(150deg);-moz-transform:rotate(150deg);transform:rotate(150deg)}
49.99%{-webkit-transform:rotate(150deg);-moz-transform:rotate(150deg);transform:rotate(150deg)}
50%{-webkit-transform:rotate(180deg);-moz-transform:rotate(180deg);transform:rotate(180deg)}
58.32%{-webkit-transform:rotate(180deg);-moz-transform:rotate(180deg);transform:rotate(180deg)}
58.33%{-webkit-transform:rotate(210deg);-moz-transform:rotate(210deg);transform:rotate(210deg)}
66.65%{-webkit-transform:rotate(210deg);-moz-transform:rotate(210deg);transform:rotate(210deg)}
66.66%{-webkit-transform:rotate(240deg);-moz-transform:rotate(240deg);transform:rotate(240deg)}
74.99%{-webkit-transform:rotate(240deg);-moz-transform:rotate(240deg);transform:rotate(240deg)}
75%{-webkit-transform:rotate(270deg);-moz-transform:rotate(270deg);transform:rotate(270deg)}
83.32%{-webkit-transform:rotate(270deg);-moz-transform:rotate(270deg);transform:rotate(270deg)}
83.33%{-webkit-transform:rotate(300deg);-moz-transform:rotate(300deg);transform:rotate(300deg)}
91.65%{-webkit-transform:rotate(300deg);-moz-transform:rotate(300deg);transform:rotate(300deg)}
91.66%{-webkit-transform:rotate(330deg);-moz-transform:rotate(330deg);transform:rotate(330deg)}
100%{-webkit-transform:rotate(330deg);-moz-transform:rotate(330deg);transform:rotate(330deg)}
}@-moz-keyframes rotatingLoader{0%{-webkit-transform:rotate(0);-moz-transform:rotate(0);transform:rotate(0)}
8.32%{-webkit-transform:rotate(0);-moz-transform:rotate(0);transform:rotate(0)}
8.33%{-webkit-transform:rotate(30deg);-moz-transform:rotate(30deg);transform:rotate(30deg)}
16.65%{-webkit-transform:rotate(30deg);-moz-transform:rotate(30deg);transform:rotate(30deg)}
16.66%{-webkit-transform:rotate(60deg);-moz-transform:rotate(60deg);transform:rotate(60deg)}
24.99%{-webkit-transform:rotate(60deg);-moz-transform:rotate(60deg);transform:rotate(60deg)}
25%{-webkit-transform:rotate(90deg);-moz-transform:rotate(90deg);transform:rotate(90deg)}
33.32%{-webkit-transform:rotate(90deg);-moz-transform:rotate(90deg);transform:rotate(90deg)}
33.33%{-webkit-transform:rotate(120deg);-moz-transform:rotate(120deg);transform:rotate(120deg)}
41.65%{-webkit-transform:rotate(120deg);-moz-transform:rotate(120deg);transform:rotate(120deg)}
41.66%{-webkit-transform:rotate(150deg);-moz-transform:rotate(150deg);transform:rotate(150deg)}
49.99%{-webkit-transform:rotate(150deg);-moz-transform:rotate(150deg);transform:rotate(150deg)}
50%{-webkit-transform:rotate(180deg);-moz-transform:rotate(180deg);transform:rotate(180deg)}
58.32%{-webkit-transform:rotate(180deg);-moz-transform:rotate(180deg);transform:rotate(180deg)}
58.33%{-webkit-transform:rotate(210deg);-moz-transform:rotate(210deg);transform:rotate(210deg)}
66.65%{-webkit-transform:rotate(210deg);-moz-transform:rotate(210deg);transform:rotate(210deg)}
66.66%{-webkit-transform:rotate(240deg);-moz-transform:rotate(240deg);transform:rotate(240deg)}
74.99%{-webkit-transform:rotate(240deg);-moz-transform:rotate(240deg);transform:rotate(240deg)}
75%{-webkit-transform:rotate(270deg);-moz-transform:rotate(270deg);transform:rotate(270deg)}
83.32%{-webkit-transform:rotate(270deg);-moz-transform:rotate(270deg);transform:rotate(270deg)}
83.33%{-webkit-transform:rotate(300deg);-moz-transform:rotate(300deg);transform:rotate(300deg)}
91.65%{-webkit-transform:rotate(300deg);-moz-transform:rotate(300deg);transform:rotate(300deg)}
91.66%{-webkit-transform:rotate(330deg);-moz-transform:rotate(330deg);transform:rotate(330deg)}
100%{-webkit-transform:rotate(330deg);-moz-transform:rotate(330deg);transform:rotate(330deg)}
}
.notification{position:absolute;top:0;width:100%;height:100%;z-index:3;display:none;background-color:rgba(0,0,0,0.75);}
.notification .window{position:relative;opacity:0;-webkit-transition:all 350ms;-moz-transition:all 350ms;transition:all 350ms;text-align:center;}
.notification .window.show{opacity:1;-webkit-transition-delay:350ms;-moz-transition-delay:350ms;transition-delay:350ms}
.notification .window strong,.notification .window small{display:block}
.notification .window.growl{left:50%;top:50%;width:104px;margin:-52px auto auto -52px;padding:24px 8px;-webkit-transform:scale(.2);-moz-transform:scale(.2);transform:scale(.2);}
.notification .window.growl.show{-webkit-transform:scale(1);-moz-transform:scale(1);transform:scale(1)}
.notification .window.growl > .icon{font-size:3.6em;line-height:1em;}
.notification .window.growl > .icon ~ strong{margin-bottom:-12px}
.notification .window.growl small{display:none}
.notification .window:not(.growl){width:280px;left:0;top:0;margin:22px auto 0;-webkit-transform:translateY(100%);-moz-transform:translateY(100%);transform:translateY(100%);}
.notification .window:not(.growl).show{-webkit-transform:translateY(0%);-moz-transform:translateY(0%);transform:translateY(0%)}
.notification .window:not(.growl):not(.html){padding-top:24px;}
.notification .window:not(.growl):not(.html) > .icon{font-size:4em;line-height:1em}
.notification .window:not(.growl):not(.html) > strong{font-size:1.2em}
.notification .window:not(.growl):not(.html) > strong,.notification .window:not(.growl):not(.html) small{padding:0 16px 16px 16px}
.notification .window:not(.growl).html .close{position:absolute;top:-14px;right:-14px;font-size:14px;line-height:24px;font-weight:normal;width:24px;height:24px;-webkit-border-radius:14px;-moz-border-radius:14px;border-radius:14px}

section.show > [data-control="pull"]{position:absolute;z-index:-1;top:44px;width:100%;height:80px;padding:10px 0;text-align:center;}
section.show > [data-control="pull"] > .icon{display:inline-block;width:48px;height:48px;font-size:44px;line-height:48px;-webkit-transition:all 300ms;-moz-transition:all 300ms;transition:all 300ms}
section.show > [data-control="pull"] > .loading{display:none;left:0%}
section.show > [data-control="pull"] > strong{position:relative;top:-16px;margin-left:4px;font-size:1.1em}
section.show > [data-control="pull"].rotate > .icon{-webkit-transform:rotate(180deg);-moz-transform:rotate(180deg);transform:rotate(180deg)}
section.show > [data-control="pull"].refresh > .icon{display:none}
section.show > [data-control="pull"].refresh > .loading{display:inline-block}

.splash{text-align:center;}
.splash > form{margin:24px 32px}
.splash img{max-width:206px;margin:20% auto 0%}
.splash h1{margin-top:20%;font-size:2.2em;font-weight:bold}
.splash .button{margin-top:10px}
.splash .copyright{position:absolute;width:100%;bottom:8px;left:0;font-size:.8em;font-style:normal;padding:0}

@font-face{font-family:'lungojsicon';src:url("data:font/truetype;charset=utf-8;base64,AAEAAAARAQAABAAQRkZUTWGTQYQAAAEcAAAAHEdERUYAggAEAAABOAAAACBPUy8yT7A77QAAAVgAAABWY21hcCK+t2EAAAGwAAABemN2dCAFDAcuAAADLAAAACpmcGdtU7QvpwAAA1gAAAJlZ2FzcAAAABAAAAXAAAAACGdseWYZ3SATAAAFyAAALQxoZWFk+T0TNwAAMtQAAAA2aGhlYQPiAlAAADMMAAAAJGhtdHiYGgM7AAAzMAAAAVRsb2NhHK4onAAANIQAAACsbWF4cAF5AZQAADUwAAAAIG5hbWUXFzOVAAA1UAAAAVBwb3N0REQdiAAANqAAAAFtcHJlcHZX4loAADgQAAABLXdlYmY4vk/fAAA5QAAAAAYAAAABAAAAAMmJbzEAAAAAzATpFQAAAADMBOk9AAEAAAAOAAAAGAAAAAAAAgABAAEAVAABAAQAAAACAAAAAQHIAZAABQAEAUwBZgAAAEcBTAFmAAAA9QAZAIQAAAIABQkAAAAAAAAAAAABAAAAAAAAAAAAAAAAUGZFZABAACHgAAHg/+AAAAHgACYAAAABAAAAAAAAAAAAAwAAAAMAAAAcAAEAAAAAAHQAAwABAAAAHAAEAFgAAAASABAAAwACAAAAXgCtIAogFCAvIF/gAP//AAAAAAAhAK0gACAQIC8gX+AA//8AAf/i/5TgQuA94CPf9CBUAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAEGAAABAAAAAAAAAAECAAAAAgAAAAAAAAAAAAAAAAAAAAEAAAADBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiMkJSYnKCkqKywtLi8wMTIzNDU2Nzg5Ojs8PT4/QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUFEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoAEgAIABIAA0AEAAUABgAGYAcgDgACAAgAIAAEAAUAByAIwA0ADgACAAALAALLAAE0uwTFBYsEp2WbAAIz8YsAYrWD1ZS7BMUFh9WSDUsAETLhgtsAEsINqwDCstsAIsS1JYRSNZIS2wAyxpGCCwQFBYIbBAWS2wBCywBitYISMheljdG81ZG0tSWFj9G+1ZGyMhsAUrWLBGdllY3RvNWVlZGC2wBSwNXFotsAYssSIBiFBYsCCIXFwbsABZLbAHLLEkAYhQWLBAiFxcG7AAWS2wCCwSESA5Ly2wCSwgfbAGK1jEG81ZILADJUkjILAEJkqwAFBYimWKYSCwAFBYOBshIVkbiophILAAUlg4GyEhWVkYLbAKLLAGK1ghEBsQIVktsAssINKwDCstsAwsIC+wBytcWCAgRyNGYWogWCBkYjgbISFZGyFZLbANLBIRICA5LyCKIEeKRmEjiiCKI0qwAFBYI7AAUliwQDgbIVkbI7AAUFiwQGU4GyFZWS2wDiywBitYPdYYISEbINaKS1JYIIojSSCwAFVYOBshIVkbISFZWS2wDywjINYgL7AHK1xYIyBYS1MbIbABWViKsAQmSSOKIyCKSYojYTgbISEhIVkbISEhISFZLbAQLCDasBIrLbARLCDSsBIrLbASLCAvsAcrXFggIEcjRmFqiiBHI0YjYWpgIFggZGI4GyEhWRshIVktsBMsIIogiocgsAMlSmQjigewIFBYPBvAWS2wFCyzAEABQEJCAUu4EABjAEu4EABjIIogilVYIIogilJYI2IgsAAjQhtiILABI0JZILBAUliyACAAQ2NCsgEgAUNjQrAgY7AZZRwhWRshIVktsBUssAFDYyOwAENjIy0AAAAAAQAB//8ADwACAAAAAAIAAcAABQAOAAA1MzcXMwEDMzUzFTM1JwdAwMBA/wCggECAoKDAwMABAP5AgICgoKAAAAMAAP/gAgAB4AAEAAgAEAAdALIIAAArsQUL6QGwES+xEgErALEFCBESsAA5MDEVNwEnARchFSESBxc2NTQmI8ABAID/AKABIP7gmxuAIDUmIEABAID/AKAgAgAggBsqJjUAAAADAAAAIAIAAaAAAwAMABQARQCyBAAAK7EHCjMzshABACuxFAfpsgUBACuyCwEAKwGwFS+wDta0Eg8ACwQrsRYBK7ESDhESsQkIOTkAsRQEERKwCTkwMTUhESETESERIycHJwMkNDYyFhQGIgIA/gAgAcAgYECAYAEgHCgcHCggAYD+oAFA/sCQMKD/ANwoHBwoHAAABAAAACACAAGgABkAIQApAC0AawCyAwAAK7EhC+myKAAAK7IrAQArsiUBACuxKQrpshEBACuxHQXpsQsVMjKzKikRCCsBsC4vsADWsRsQ6bAbELEjASuxJxLpsS8BK7EjGxESsBU5sCcRsx0gIRwkFzkAsSUpERKxGx45OTAxNRQWMyEyNjURNCYrAS4CKwEiDgEHIyIGFRY0NjIWFAYiJjQ2MhYUBiI3NTMVEw0BwA0TEw1wBQgUD4APFAgFcA0TcFR4VFR4KjxUPDxUykBADRMTDQEADRMVFhUVFhUTDax4VFR4VGZUPDxUPLYgIAAAAQAA/+gCAAHZACEAaQCyHgAAK7AOM7IDAAArsSAC6bIVAAArsRAC6bINAQArAbAiL7Ae1rENASu0GxQAKwQrsSMBK7ENHhESsgUSHTk5ObAbEbAXOQCxHhURErIGGAg5OTmxECARErAfObANEbIKDxo5OTkwMSYeATc+ATc2NTQ+ATUlByYHDgEeATc+ATc0Nj8BBQMmBwYECTolIS0CAQcGARYNHCQmLgg6JiEtAgkEBP6cDRwjJUA7IgUFKBoBARCXhwEc8BAFBjA7IgUFKRsHxF5eGf6sDwUGAAQADwBAAfEBoAALABUAHQAlAGEAsiUAACuxIQXpshQBACuxDwvpsgoBACuxBAvptBkdJQoNK7EZC+kBsCYvsB/WsSMO6bEnASsAsRkhERKzFhcaGyQXObAdEbEQDTk5sA8SswYMAREkFzmwFBGxBwA5OTAxExc+ATIWFzcuASIGHwE2Mhc3LgEiBh8BNjIXNyYiFjQ2MhYUBiIPGClwgHApGC19jn0bGTmuORkgV2RXKRgcWBwYJnQaExoTExoBMxUuNDQuFTM6OnIWQkIWIykpYxUhIRUsjRoTExoTAAAAAwAg/+AB4AHgABkAIQApAHQAsgcAACuxFQfpsgUAACuwCjOxFQvpsiEBACuxAA4zM7QdCgAIBCuyJwEAK7QiAgANBCuxEBgyMgGwKi+wAtaxFxTpsBcQsRIBK7ENFOmxKwErsRcCERKwGTmwEhFACQUICQoHGh8iIyQXObANErAQOQAwMRMzFRQWFxUHMyc1PgE9ATMnIxUUBiImPQEjFxQWMjY9ASE1ITU0JiIGFSAgW0VAwEBFWyAgIF6EXiBAS2pL/wABAEtqSwEgQEdrCyMgICMLa0dAIGBCXl5CYGA1S0s1QCAgNUtLNQACACD/4AHgAeAAEwAXAC0AsgMAACuxCAvpshQAACuxFQvpAbAYL7AA1rELFOmxGQErALEUCBESsAo5MDE3FBYzIREjESEiJjQ2MyERISIGFRM1IRUgJhoBgCD+sBQcHBQBMP7AGiZgASAgGiYBwP5gHCgcAYAmGv6AICAAAwAAAAACAAHAAAMABwALAAAxNxEHExcRJxM3EQegoLCgoLCgoEABgED+wEABgED+QEABgEAAAAACAAAAIAIAAaAAAwAJAAAREyETJSEnIycjEAHgEP4gAcAQ0BCwAUD+4AEgICAgAAACAAD/4AIAAeAABAAMAB8AsgQBACuxCAXpsAwvAbANL7AK1rECDumxDgErADAxNRcBNSMWNDYyFhQGIsABQMAgHCgcHCigwAFAwIQoHBwoHAAAAAADAAD/4AIAAeAAHwAjACcAADQUHwE3NjIWFA8BFxYyNwE2NC8BBwYiJjQ/AScmIgcBPwEXByc3FwcLJRANJhoNECULIAsBKgsLJRANJhoNECULIAv+1lXAgMBAgECAoCALJRANGiYNECULCwEqCyALJRANGiYNECULC/7WFcCAwICAQIAAAAAAAwAA/+AB4AHgABUAHQAlAHkAsh0AACuwJDOxGQfpsCAysgkAACuxDAvpshUBACuxAAvpAbAmL7AG1rADMrEPFOmxEhYyMrAPELEXCyu0Gw8ACwQrsBsQsR8BK7QjDwALBCuxJwErsQ8GERKwBDmxIx8RErMLEBEKJBc5ALEADBESsgYREjk5OTAxETIWFRcGFRQWMyE1ISImNSU1ITQmIxI0NjIWFAYiJDQ2MhYUBiINExgYJRsBgP6ADRMBoP5gJRtAHCgcHCgBJBwoHBwoAcATDc4THxslIBMNQMAbJf4cKBwcKBwcKBwcKBwAAAAAAQAA/+ACAAHgACUAZACyEQAAK7ILAAArtA8CAA0EK7IkAQArtAMCAA0EK7IWAQArsh0BACu0GAIADQQrAbAmL7AI1rAfMrQNEQAHBCuwGjKxJwErsQ0IERKzBhEWISQXOQCxJAMRErMFEhUiJBc5MDEQFBYzMjcXBhUUFjI2NCYjIgcnNjQnNxYzMjY0JiIGFRQXByYjIi8hIhjXAS9CLy8hIhjXAQHXGCIhLy9CLwHXGCIhAQFCLxhrBwYhLy9CLxhrBwwHaxgvQi8vIQYHaxgAAAADAA7/4AHwAd8AGwAjACsAABMWFxUWFzY3NjcnBgcGJyYnJi8BJjc2NycGBwY3Fzc2LwEmBxMXNzYvASYHDihRTJUWIiAQeAsLDBUqJx4aAQkICApXFBUWSlgaCghDCA3reBUGCV8LCQFhkVYBXjsCEhISZQoGBwshJyUqAxYLCwmCDh4gV4IUCA1mCQT+qWUZDQlNCQkAAAQAAP/gAgAB4AAeACIALgA2AJUAsh8AACuwIzOyIAEAK7IaAQArtDICABUEK7QpNh8aDSu0KQsAGAQrsAwyAbA3L7Ai1rEjD+myIyIKK7NAIwQJK7ILEhkyMjKwIhCxMBDpsCMQsTQBK7QQEgARBCuxCRcyMrE4ASuxNDARErEpKDk5sBARsC45ALEpHxESsAU5sTI2ERKxEhE5ObAgEbIYGRM5OTkwMTEUFjMhNTMyNj0BIzUzMjY9ASM1MzI2PQEjNSEiBhUTETMRNzQ+AzIeAxUmNDYyFhQGIhMNAaAgDRNAIA0TQCANE0D+YA0TYCBRDA8aDxcPGg8MfRomGhomDROAEw1AIBMNQCATDUAgEw3+QAHA/kCAGycTCgEBChMnG40mGhomGgAAAAQAAABAAgABgAAEAAcACgANAAA1IScHJwc3JzcXNwcXEQIA1Cwt07q6D/Hxq7pAgCgoaoGnArW1qYEBKAAAAAAEAAD/4AIAAdUAAgAHAAoADQAAFTcnESEnBy8BIScTFxG6ugIA1CwtxAHi8Ua6CoGn/sKAKCjAtf6igQEoAAAAAgBs/+ABlAHgAB4AJgA6ALIZAQArsSIH6QGwJy+wANaxIA/psCAQsSQBK7ESD+mxKAErsSAAERKwBTmwJBGzChgZCCQXOQAwMRMWFRQVHgIXPgQ3NDU0MzQ1NDU0JiIGFRQVFBY0NjIWFAYibAEFTD4EBRMwJSMDAVd6V1QlNiUlNgFCAQEDATWwcwQJIVtTYyEBAwICAgMDPVdXPQMDAh82JSU2JQAABwAQ/+AB8AHgABoAOgBaAGgAdQCEAIYA1QCyAwAAK7QzBAA1BCuyLwAAK7GBgzMzsjwAACuyHwEAK7IHAQArtCMEADUEK7IPAQArtGALABgEK7NnHw8IKwGwhy+wANaxGw7psBsQsVYBK7RpFAAcBCuwaRCxKwErsQUO6bGIASuxVhsREkALAhYYEzc4O1NXXGckFzmwaRG1Hw9UWmBqJBc5sCsSQBADBwsgDDM8S1JjZG5ydnuFJBc5ALE8LxESswQ7P0AkFzmwHxFADAUAJys4S1hudHiFhiQXObEHIxESsQsYOTmwYBGwDDkwMTcUFjI2NCYjIgcmNTYnJiMiBw4BFxYXFDEOARc0NzY3Fzc2MzIXFhcHFxYVFAcGBycHBiMiJyYnNycmFzcWHwE3NjcXJzY1NycwNTcHJi8BBwYHJxcGFQcXMBUDJjY3NjMyFxYHJgYHJhcmNjc2MzIzFhcPASYXPwEWFxYGBwYHBiMiIyY3NRCNxo2NYxIRAQsDAxQEBAsNAgINTGI6NSEtFQYMDEs2IQ0jKAI1IS0VBgwMSzYhDSMoAjpiCw0ZAgoHIBcFNjxKYgsNGQIKByAXBTY8GAEKCAMDDgIBBwYNBAgZBBYTBQUDAwcGJBsCGyQbAgEDDA0HCAUFAwMHDdBjjY3GjQMBAQgKDwECDwgLAwEWgFFLNiENIygCNSEtFQYMDEs2IQ0jKAI1IS0VBgxwSgUBNjwFCAsYCwsZAgFiSgUBNjwFCAsYCwsZAgEBEgQKAQEIBgUEAwYC/BMiBAEBAxskBR4bJAUEDxwIBAIBAV8CAAAAAwAA/+AB4AHAAAcADwAgAE4AsgMAACuxDwvpsgcBACuxCwvpAbAhL7AB1rEJFOmwCRCxDQErsQUU6bEiASuxDQkRErUDBgcCEBckFzkAsQsPERK1AQQFABMcJBc5MDEQFBYyNjQmIgI0NjIWFAYiNxQWMzI2NzM1IyYnNSMVDgGNxo2Nxm16rHp6rCYcFA8ZBWNjBxYgDhIBM8aNjcaN/rqsenqsetAUHBIOIBYHg4MFGQAADAAA/+AB4AHgAAsADwATABcAGwAfACMAJwArAC8AMwA3AKkAsgwAACuyEAAAK7EYJDMzsREF6bEZJTIyshQAACuyHCgwMzMzsRUF6bIdKTEyMjKyIQEAK7EtNTMzsSAF6bEsNDIysg0BACuwCS+wBDMBsDgvsBDWsQkUMjKxEw7psQcWMjKwExCxGAErsRwgMjKxGw7psR4iMjKwGxCxJAErsSgsMjKxJw7psSouMjKwJxCxMAErsQU0MjKxMw7psQM2MjKxOQErADAxFSERIxUjNSMVIzUjExEhESU1MxUnNTMVFzUzFSc1MxUnNTMVFzUzFSc1MxUnNTMVFzUzFSc1MxUB4EBA4EBAIAGg/oBAQEAgQEBAQEAgQEBAQEAgQEBAIAIAICAgIP4gAWD+oCBAQGBAQGBAQGBAQGBAQMBAQGBAQGBAQGBAQGBAQAAAAwBA/+ABoAHgAA8AEwAbACkAsgMAACu0GwsAKAQrshcAACu0EAsAKAQrshEBACsBsBwvsR0BKwAwMTMUFjMhMjY1ETQmIyEiBhUTESERBjQ2MhYUBiJAEw0BIA0TEw3+4A0TIAEgqQ8UDw8UDRMTDQHADRMTDf6AAWD+oDoUDw8UDwAAAgAAACACAAGAAA0AFQAANRQWMyEyNj0CJyMHFT8BMxcjByMnEw0BwA0ToMCgKoWihVZAgEBADRMTDTBQwMBQUKCgQEAAAAAABQAAACACAAGAAAsADwATABcAGwAANRQWMyEyNj0BJyMHMzczFyUhJyE3MycjBzMHIxMNAcANE6DAoCqFooX+gwFOG/7oGuQbrgnAIIBADRMTDYDAwKCgICAgIKAgAAAAAQAgAAAB4AGwAC0AGACyAAAAK7EqAumwBjIBsC4vsS8BKwAwMTsCNC4BJyImJzU2NzI2JzQ+AS4EIg4EHgEVDgEWMx4BHwEUBw4CIODgR0wWBQUBIQcOCw4CAQIGDhUhLCEVDgYCAQIJAg0JAxQJCAsWTEcdPSMEEAgIICsyDAEUEBoVGBAKChAYFRoQFAEHHxgTJgkJHwEEIz0AAwAAAEACAAFgABIAJAA3AJAAsh0BACuxEwPpAbA4L7AN1rEIDumzBQgNCCuxEBTpsBAvsQUU6bAIELEfASuxGgzpsBoQsTMBK7EuDumzKy4zCCuxNhTpsDYvsSsU6bE5ASuxBRARErMBCgsTJBc5sB8RsAM5sBoSshchIjk5ObAzEbAlObEuNhESsicUMTk5OQCxHRMRErMACicwJBc5MDE1MzY3Jic1NjU0JiIGFRQXFQ4BFyE0Jic1NjU0JiIGFRQXFQ4BJRYXMzQmJzU2NTQmIgYVFBcVBloaLRUcEBMaExAiLmABQEk3ICU2JSA3SQD/LRpaLiIQExoTEByAHhENAwcOHBQcHBQcDgcEI1gjNAcPHDcoODgoNxwPBzRMER4YIwQHDhwUHBwUHA4HAwAAAAAFAAAAIAIAAYAADwAfACMAJwArAG0AshAAACuwIDOyIQAAK7ILAQArsSkF6bAXMrMoEAsIKwGwLC+wANaxEA7ptBYPAAsEK7AQELEfASuxIA7psSQoMjKyHyAKK7NAHxoJK7EtASuxHxYRErETHDk5ALEoIREStRUaHBMkJSQXOTAxNRQWMyEyNj0BNCYjISIGFRc0NjMiJjQ2MhYUBiMyFhUzNTMVJzUzFSc1MxUmGgGAGiYmGv6AGiZALyEUHBwoHBwUIS9AoKCgoKBgGiYmGuAaJiYa4DVLHCgcHCgcSzUgIGAgIGAgIAAAAAIAAAAAAgABwAASACcAABEUFjsBFTczMjY9ATQmIyEiBhUTFBY7ARc1MzI2PQE0JisBFRQGKwETDSBA4A0TEw3+wA0ToBMNwEAgDRMTDUATDeABAA0TQEATDaANExMN/sANE0BAEw2gDRNADRMAAAABAAAAIAIAAaAAEgAANRQWOwEVNyEyNj0BNCYjISIGFRMNQEgBOA0TEw3+QA0ToA0TYGATDeANExMNAAACAEL/4gHBAdsAEQAZAAASBhceATcXFj8BNi8BPgEnLgEGPgEeAQ4BJlMiJCB3OV8FCisKB3IxFyEkh2AXUV0wF1FcAaSIPDUnF7UKBhkGCqgnfTc8IsdcMRdRXTAXAAACACD/4AHgAeAADQAVAD4AshEBACuxFQfpsAwvAbAWL7AP1rQTDwALBCuxFwErsRMPERKxDAU5OQCxFQwRErEKADk5sBERsQsNOTkwMRMXFQczNxczJzU3NQcnFjQ2MhYUBiIgoEAgYGAgQKDg4LAcKBwcKAGAQIDg4ODggEAgQEAEKBwcKBwAAgAA/+ACAAHgAAgADQAdALIDAAArsQYK6QGwDi+xDwErALEGAxESsAE5MDEQFBYyNjUjNSIXMzQmI4O6g+BdneCDXQEduoODXeCgXYMAAAAFAAAAAAIAAaAAAwAHAAsADwATAGAAsgAAACuxAQXpsgQAACuyCAwQMzMzsQUH6bIFBAors0AFDQkrsgkBACuwETMBsBQvsATWsQcO6bAHELEIASuxCw7psAsQsQwBK7EPDumwDxCxEAErsRMO6bEVASsAMDExNSEVJTUzFTM1MxUzNTMVMxEzEQIA/kBAIEAgQCBAQEBgYGDg4ICAAUD+wAAAAAUAAP/gAgAB4AALABUAGQAdACEANgCyFgAAK7EaHjMzshcBACuxGx8zM7IJAQArsAQzsQAF6QGwIi+xIwErALEAFxESsRQVOTkwMREhNCYrATUjFSMiBhMUFjMhMjY1ESETETMRMxEzETMRMxECACUbgICAGyVAEw0BQA0T/oBAQCBAIEABgBslICAl/mUNExMNAWD+wAEA/wABAP8AAQD/AAAACQAA/+ACAAHgAAMABwALAA8AEwAXABsAHwAjAIoAsgAAACuxDBgzM7EBAumxDRkyMrIEAAArshAAACuyHAAAK7IFAQArsREdMzOxBALpsgkBACuxFSEzM7EIAumxFCAyMgGwJC+wANaxBAgyMrEDDOmxBgoyMrADELEMASuxEBQyMrEPDOmxEhYyMrAPELEYASuxHCAyMrEbDOmxHiIyMrElASsAMDEVNTMVJzUzFSc1MxUTNTMVJzUzFSc1MxUTNTMVJzUzFSc1MxWAgICAgECAgICAgECAgICAgCCAgMCAgMCAgP6AgIDAgIDAgID+gICAwICAwICAAAAAAwDAAAABQAHAAAMABwALAEEAsgAAACuxAQLpsgQAACuyBQEAK7EEAumyCQEAK7EIAukBsAwvsADWsQQIMjKxAwzpsQYKMjKxAwzpsQ0BKwAwMTM1MxUnNTMVJzUzFcCAgICAgICAoICAoICAAAAAAAIAIP/gAeAB4AAXACUAMQCyEAEAK7EfBekBsCYvsBPWsRgO6bAYELElASuxDA7psScBK7ElGBESsRAPOTkAMDEzFBYzITI2PQE0JisBNTQmIgYdASMiBhU3NTQ3Njc2MhcWFxYdASATDQGADRMTDSBehF4gDROAFw0SFCwUEg0XDRMTDeANE2A1S0s1YBMNIGAWEwoGBwcGChMWYAAAAAACAAAAEwIAAaAAHAAjAFgAsiMAACuwGS+wEjMBsCQvsAHWsR4T6bAeELEhASuxChPpsSUBK7EeARESsgQUHTk5ObAhEbISBSM5OTmwChKyBhAiOTk5ALEZIxEStQADBg0EHyQXOTAxEBQWOwEXNzMyNjU0JicuASMiByYjIgYVFBcmIyIXMzUzFTMHOSgybW08JDMmHAJFMDokFCEbKAEJCChnQEBAYAEJUDltbTMkHy8HMEQtGigbBQUComBgYAACAAAAIAIAAaAAHQAkAEEAsiMAACuyEQEAK7EIA+mzGggRCCuwEzMBsCUvsSYBKwCxCCMRErIDBwQ5OTmwGhGyAA4fOTk5sBESsRUcOTkwMRAUFjsBFTM1MzI2NTQmJy4BIyIHJiMiBhUUFyYjIhc3FyMVIzU5KF+AaSQzJhwCRTA6JBQhGygBCQgoZ2BgQEABCVA5YGAzJB8vBzBELRooGwUFAqJgYGBgAAAAAQAAAAACAAHAABcAFwCwEi8BsBgvsQALK7EMDemxGQErADAxERQeAh8BPgQ1NCYjIgYHLgEjIgY1S0sbGgojWEQ3UDgmQRERQSY4UAE4NGZIOQ8OBRRARGc0OFAnISEnUAAAAAEAAP/tAgAB0wAJAAARFwc3Fyc3LwEHgB6enh6AsU9PARl8sFNTsHwaoKAAAgAA/+0CAAHTAAkAEwAAERcHNxcnNy8BDwE/AR8BBxcnBzeAHp6eHoCxT099jT8/jWYYfn4YARl8sFNTsHwaoKAqFICAFGSNQ0ONAAIAAAAAAgABwAAXADEATgCyLAAAK7IVAQArsA8zsRsL6bAjMrMSLBUIKwGwMi+wANaxGBTpsBgQsSYBK7EMFOmxMwErsSYYERKyDxUGOTk5ALESLBESsQwAOTkwMREUHgIfAT4ENTQmIyIGBy4BIyIGFzQ2MzIWHwE3PgEzMhYVFAcGBwYHJicmJyY1S0sbGgojWEQ3UDgmQRERQSY4UCA9Kx0xDhwcDjEdKz0jHTQxOzoxNR0jATg0Zkg5Dw4FFEBEZzQ4UCchISdQOCs9Hhk1NRkePSs2Ny4tKiIhKi0vNwAAAAUAAP/gAgAB4AAkAEUAUQBeAGoA9QCyAwAAK7FDC+mwTzKySQAAK7FdC+myVQAAK7FpC+myFQEAK7AhM7FiC+mwKTKyHAEAK7ExC+kBsGsvsADWsSUU6bAlELEfASuxLRTpsC0QsTQBK7EYFOmyOTxAMjIysBgQsUALK7FHFOmxUl8yMrBHELFNASuxCBTpsVhlMjKwCBCxWQsrsQ0U6bARMrFsASuxHyURErEhKTk5sTQtERKxHBs5ObFHGBESszc7PkIkFzmwTRGxFBU5ObAIErAKOQCxSUMRErAIObBdEbAKObBVErANObBpEbE7Dzk5sGISsRE5OTmwFRGwNzmwMRKxGR45OTAxNRQWOwIyNjU0Jz4BNTQnNjU0JisBIiY9ATQmIgYdARQGIgYVFzU0NjMyNzY9ATQ2MhYdARQWFwYVFBcGFBcGFRQXIyImFjQ2OwEyFhQGKwEiJjQ2OwEyFhQGKwIiJjQ2OwEyFhQGKwEiSzWggBomCxMYFhYmGqAaJiY0JhwoHCALBSQYFBMaExsXEhYWFhYJaSg44BMNgA0TEw2ADRMTDaANExMNIIANExMNoA0TEw2gDWA1SyYaExEGIRUdExMdGiYmGkAaJiYaQBomJhqAgA0TIBslQA0TEw1AGy0MExkdExM6ExMdEQ84JRoTExoTcxoTExoTcxoTExoTAAAFAAD/4AIAAeAAJAAwAD0ASQBqAPUAsgsAACuxYQvpsgMAACuwEDOxLwvpsFkysjwBACuxKAvpskgBACuxNAvpshkBACuxQQvpsFEyAbBrL7AA1rAhMrEmFOmxHDEyMrAmELEcCyuxPxTpsD8QsSwBK7E4RDIysWkU6bIHS08yMjKwaRCxCAsrsWMU6bBjELFeASuxDRTpsA0QsVYBK7ETFOmxbAErsT8mERKxAx45ObAsEbAEObBpErNKTVFnJBc5sV5jERKxCwo5ObFWDRESsRBZOTkAsQNhERKxCA05ObAvEbBnObAoErEAaTk5sDwRsSNKOTmwNBKwITmwSBGwHjmwQRKwHDkwMTUUFjsBMhYdARQWMjY9ATQ2MjY9ATQmKwIiBhUUFw4BFRQXBhY0NjsBMhYUBisBIiY0NjsCMhYUBisBIjY0NjsBMhYUBisBIhc2NCc2NTQnMzIWHQEUBiMiBwYdARQGIiY9ATQmJzY1NCYaoBomJjQmHCgcSzWggBomCxMYFhYgEw2gDRMTDaANExMNIIANExMNoA0NEw2ADRMTDYANtxYWFglpKDgLBSQYFBMaExsXEuAaJiYaQBomJhpAGiYmGoA1SyYaExEGIRUdExMqGhMTGhNzGhMTGhNzGhMTGhNwEzoTEx0RDzgogA0TIBslQA0TEw1AGy0MExkdAAAABAAA/+ACAAHgACcALwB/AIcBCACyCQAAK7EvBumyBgAAK7ANM7IAAAArsBMzsScL6bAUMrIhAAArsBozsisAACuxHgbpsn8BACuwWDOxMAvpsFcysoMBACuweS+0XmNob3QkFzMBsIgvsADWsSkP6bApELEJASuwHjKxChTpsB0ysAoQsS0BK7ETD+mwExCxQwErsGwysUQU6bBrMrGJASuxCSkRErEIHzk5sAoRsyorLi8kFzmwLRKxCxw5ObATEbQNGjA6dSQXObBDErQ7dICChyQXOQCxAAYRErEEDzk5sSsnERKxFSY5ObAeEbYXGSIkOUNOJBc5sTAhERJADDo7PUBCRUdKTYCFhiQXObGDfxESsVx7OTkwMTUXFhcHFzcWHwEzNzY3FzcnNj8BNScmJzcnByYvASMHBgcnBxcGDwEWNDYyFhQGIjcXFhcHFzcWFwcXNxYXBxc3Fh8BMzc2Nxc3JzY3FzcnNjcXNyc2PwE1JyYnNycHJic3JwcmJzcnByYvASMHBgcnBxcGBycHFwYHJwcXBg8BFjQ2MhYUBiIjAwQVFx0ICQYgBgkIHRcVBAMjIwMEFRcdCAkGIAYJCB0XFQQDI1ATGhMTGj0iAQEdDSEDBBQXHAUFBx0TBgYGIAYGBhMdBwUFHBcUBAMhDR0BASIiAQEdDSEDBBQXHAUFBx0TBgYGIAYGBhMdBwUFHBcUBAMhDR0BASJqKTopKTpABgkIHRcVBAMjIwMEFRcdCAkGIAYJCB0XFQQDIyMDBBUXHQgJBh0aExMaE/AGBgYTHQcFBRwXFAQDIQ0dAQEiIgEBHQ0hAwQUFxwFBQcdEwYGBiAGBgYTHQcFBRwXFAQDIQ0dAQEiIgEBHQ0hAwQUFxwFBQcdEwYGBi06KSk6KQAAAAADAAD/4AIAAeAABwAxADkAUACyAwAAK7E5BemyNQAAK7EfC+myBwEAK7ENBOmzCAMHCCsBsDovsBLWsQUR6bE7ASsAsTU5ERKxBAE5ObEIAxESsRcmOTmwDRGxBQA5OTAxEBQWMjY0JiIHPgMzMh4CFRQOAgcOAQcGFRQXIzQ1NDc2Nz4DNTQuAiMiBxY0NjIWFAYiltSWltQKAxMeKRgaKh4RCA0TCwwQAgQBQAwKHAwNBwEHDRILLAoEHCgcHCgBStSWltSWphorHRAOGiUVDhoWFQkKEAYKEAkLAwMoGBUXCg8MCwULEQ0HPf4oHBwoHAAAAQAAACACAAGwAAUAADUXAScHJ8ABQFDwcODAAUBQ8HAAAAAAAwAAAAACAAHGABEAGQAdAFUAsgIAACuxGQvpshkAACuyFQAAK7EdC+myDAEAK7EaCOkBsB4vsBDWsRMS6bATELEXASuxBxLpsR8BK7EXExESswwLGhskFzkAsRUZERKxEAc5OTAxNxYzITI3NjU0JwMmIgcDBhUUNjQ2MhYUBiIDMwcjBAoeAageCgQI1Q4qDtUI0BwoHBwoFFAIQBISEggIDA8BcBkZ/pAPDAgiKBwcKBwBQMAAAAMAAP/gAgAB4AAHABEAGQA7ALIDAAArsQgH6bIZAQArsQ4L6bIHAQArsRUF6QGwGi+xGwErALEOCBESsQQBOTmxFRkRErEFADk5MDEQFBYyNjQmIhM1MzUjNTMVMxUCNDYyFhQGIpbUlpbUKiAgYCBwHCgcHCgBStSWltSW/mAgoCDAIAEcKBwcKBwAAgAA/+ACAAHgAAcAKwBaALIDAAArsSkJ6bAjMrIHAQArsRIJ6bAWMgGwLC+wAdaxCRDpsA0ysAkQsSABK7AaMrEFEOmxLQErsSAJERK1AwYHAgsdJBc5ALESKREStQEEBQAUJiQXOTAxEBQWMjY0JiICND8BJyY0PwE2Mh8BNzYyHwEWFA8BFxYUDwEGIi8BBwYiLwGW1JaW1CQFV1cFBRkFDwVXVwUPBRkFBVdXBQUZBQ8FV1cFDwUZAUrUlpbUlv6VDwVXVwUPBRkFBVdXBQUZBQ8FV1cFDwUZBQVXVwUFGQAAAQAA/+ACAAHgADMAADYGFRQfARYzMjY/ARceATMyPwE2NTQmLwE3PgE1NC8BJiMiBg8BJy4BIyIPAQYVFBYfAQcCAgVJBQYDBgObmwMGAwYFSQUCA5ubAwIFSQUGAwYDm5sDBgMGBUkFAgObm0IGAwYFSQUCA5ubAwIFSQUGAwYDm5sDBgMGBUkFAgObmwMCBUkFBgMGA5ubAAAAAQAA/+ACAAHgACMAADUUFjsBFRQWOwEyNj0BMzI2PQE0JisBNTQmKwEiBh0BIyIGFQkHsAkHYAcJsAcJCQewCQdgBwmwBwmwBwmwBwkJB7AJB2AHCbAHCQkHsAkHAAAAAQAAAKACAAEgAA8AFQCyDAEAK7EDAukBsBAvsREBKwAwMTUUFjMhMjY9ATQmIyEiBhUJBwHgBwkJB/4gBwmwBwkJB2AHCQkHAAAAAAEAQP/gAaAB4AAFAAA3ATcnNydAAQBgoKBg4P8AYKCgYAAAAAEAAAAgAgABgAAFAAARCQEnBycBAAEAYKCgASD/AAEAYKCgAAEAYP/gAcAB4AAFAAA3FwkBBxdgYAEA/wBgoEBgAQABAGCgAAEAAABAAgABoAAFAAA1FzcXNwFgoKBg/wCgYKCgYAEAAAAAAAIAAP/gAgAB4AAOAB0ATQCyAwAAK7EKBemyAQAAK7IbAQArsRMF6bMZAxsIKwGwHi+xHwErALEKAxESsAA5sRkBERJACgYHDA0ODxAVFhckFzmxGxMRErAYOTAxFTcWMzI2NycOASMiJzcjNxc+ATMyFwczNQcmIyIGS0tqUYMcPBViPVA4SMAQPBViPVA4SMBLS2pRgyBLS1xKFzhFOEiaFzhFOEjAS0tcAAADACD/4AHgAeAAEwAjACoASACyAwAAK7EiC+myJQEAK7IQAQArsRcL6bMkAxAIK7ApMwGwKy+wANaxFBTpsBQQsR8BK7EHFOmxLAErsR8UERKxJCo5OQAwMTcUFjMhMjY1ETQmLwEuASsBIgYVExE0OwEyFxUzFhURFCMhIgE1Fh8BFhcgGBABcBAYEQtICykQ8BAYIAjwBAR/AQj+kAgBIAMDRwIDCBAYGBABMBEoC0gLERgQ/lABsAgBfwQE/tAIAWBSAwJHAwMAAAAEAAAAQAIAAYAACQAaACIAMwBuALIVAAArsCMzsgMAACuxIgnpshABACuwKDOyCAEAK7EeCekBsDQvsBPWsRwP6bAcELEgASuxJg/psTUBK7EcExESsQgCOTmwIBGzFRAjKCQXObAmErEHAzk5ALEeIhEStwUKEhMAJSYuJBc5MDE1HgEyNjcuASIGFTY3Njc2Nw4BFBYXJicmJyY2NDYyFhQGIhc+ATQmJxYXFhcWFwYHBgcGJIqkiiQkiqSKIDUeIhASKTU1KRIQIh41jhsmGxsmOCk1NSkSECIeNSAgNR4iEOBIWFhISFhYSDciEwoFAgxFWEUMAgUKEyIkJhsbJhtPDEVYRQwCBQoTIjc3IhMKBQADAAD/4AHgAeAAFQAdACUAABEyFhUXBhUUFjMhNSEiJjUlNSE0JiMSNDYyFhQGIiQ0NjIWFAYiDRMYGCUbAYD+gA0TAaD+YCUbQBwoHBwoASQcKBwcKAHAEw3OEx8bJSATDUDAGyX+HCgcHCgcHCgcHCgcAAMAAP/gAeAB4AAVAB0AJQAAETIWFRcGFRQWMyE1ISImNSU1ITQmIxI0NjIWFAYiJDQ2MhYUBiINExgYJRsBgP6ADRMBoP5gJRtAHCgcHCgBJBwoHBwoAcATDc4THxslIBMNQMAbJf4cKBwcKBwcKBwcKBwAAwAA/+AB4AHgABUAHQAlAAARMhYVFwYVFBYzITUhIiY1JTUhNCYjEjQ2MhYUBiIkNDYyFhQGIg0TGBglGwGA/oANEwGg/mAlG0AcKBwcKAEkHCgcHCgBwBMNzhMfGyUgEw1AwBsl/hwoHBwoHBwoHBwoHAADAAD/4AHgAeAAFQAdACUAABEyFhUXBhUUFjMhNSEiJjUlNSE0JiMSNDYyFhQGIiQ0NjIWFAYiDRMYGCUbAYD+gA0TAaD+YCUbQBwoHBwoASQcKBwcKAHAEw3OEx8bJSATDUDAGyX+HCgcHCgcHCgcHCgcAAMAAP/gAQAB4AAVAB0AJQAAETIWFRcGFRQWOwE1IyImNTc1IzQmIxI0NjIWFAYiNjQ2MhYUBiIHCg0NFA7NzQcK3t4UDiIPFQ8PFZwPFQ8PFQHAEw3OEx8bJSATDUDAGyX+HCgcHCgcHCgcHCgcAAADAAD/4AIAAeAAFQAdACUAABEyFhUXBhUUFjMhNSEiJjUlNSE0JiMSNDYyFhQGIiQ0NjIWFAYiDhQaGigcAZr+Zg0VAbz+RCcdRB4rHh4rATgdKx4eKwHAEw3OEx8bJSATDUDAGyX+HCgcHCgcHCgcHCgcAAEAAAAAAAAAAAAAAAAxAAABAAAAAQAA9P0opF8PPPUAHwIAAAAAAMwE6T0AAAAAzATpPQAA/+ACAAHgAAAACAACAAAAAAAAAAEAAAHg/9oAAAIgAAAAAAIAAAEAAAAAAAAAAAAAAAAAAABVAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAPAgAAIAIAACACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAOAgAAAAIAAAACAAAAAgAAbAIAABACAAAAAgAAAAIAAEACAAAAAgAAAAIAACACAAAAAgAAAAIAAAACAAAAAgAAQgIAACACAAAAAgAAAAIAAAACAAAAAgAAwAIAACACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAEACAAAAAgAAYAIAAAACAAAAAgAAIAIAAAACAAAAAPAAAAHgAAAA8AAAAeAAAACgAAAAeAAAAFAAAABQAAAAPAAAAGAAAAAaAAACAAAAAgAAAAIAAAABIAAAAiAAAABgAAAAeAAAAfQAAAAAAAAAAAAAABwATgCYARABfgHuAmQCogK+AtYDAANEA7wEJgRyBQgFKAVIBZwGzgcoB9AIEgg2CGYItAlOCcQJ/AoaCkoKjgq2CwgLWgvYDBAMYAzADRYNSA1eDYQN9g76D/4RUhHMEd4SOhKAEvITQBNwE5YTqBO6E8wT3hQ0FJoVJBVeFV4VXhVeFV4VXhVeFV4VXhVeFV4VXhWYFdIWDBZEFn4WfhZ+FoYAAQAAAFUAiAAMAAAAAAACAAEAAgAWAAABAAEIAAAAAAAAAAgAZgADAAEECQABAA4AAAADAAEECQACAA4ADgADAAEECQADAEYAHAADAAEECQAEAB4AYgADAAEECQAFABYAgAADAAEECQAGAA4AlgADAAEECQDIABYApAADAAEECQDJADAAugBJAGMAbwBNAG8AbwBuAFIAZQBnAHUAbABhAHIARgBvAG4AdABGAG8AcgBnAGUAIAAyAC4AMAAgADoAIABJAGMAbwBNAG8AbwBuACAAOgAgADEAOAAtADYALQAyADAAMQAyAEkAYwBvAE0AbwBvAG4AIABSAGUAZwB1AGwAYQByAFYAZQByAHMAaQBvAG4AIAAxAC4AMABJAGMAbwBNAG8AbwBuAFcAZQBiAGYAbwBuAHQAIAAxAC4AMABNAG8AbgAgAEoAdQBuACAAMQA4ACAAMQAwADoAMQA4ADoAMwA3ACAAMgAwADEAMgACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFUAAAECAQMABAAFAAYABwAIAAkACgALAAwADQAOAA8AEAARABIAEwAUABUAFgAXABgAGQAaABsAHAAdAB4AHwAgACEAIgAjACQAJQAmACcAKAApACoAKwAsAC0ALgAvADAAMQAyADMANAA1ADYANwA4ADkAOgA7ADwAPQA+AD8AQABBAQQBBQEGAQcBCAEJAQoBCwEMAQ0BDgEPARABEQESALIAswETARQBFQZnbHlwaDEGZ2x5cGgyB3VuaTAwQUQHdW5pMjAwMAd1bmkyMDAxB3VuaTIwMDIHdW5pMjAwMwd1bmkyMDA0B3VuaTIwMDUHdW5pMjAwNgd1bmkyMDA3B3VuaTIwMDgHdW5pMjAwOQd1bmkyMDBBB3VuaTIwMTAHdW5pMjAxMQpmaWd1cmVkYXNoB3VuaTIwMkYHdW5pMjA1Rgd1bmlFMDAwAAAAuAH/hbABjQBLsAhQWLEBAY5ZsUYGK1ghsBBZS7AUUlghsIBZHbAGK1xYALACIEWwAytEsAMgRbICBwIrsAMrRLAEIEWyAwcCK7ADK0SwBSBFsgQYAiuwAytEsAYgRbIFDQIrsAMrRLAHIEWyBgsCK7ADK0SwCCBFsgcKAiuwAytEsAkgRbIICQIrsAMrRLAKIEWyCQcCK7ADK0SwCyBFsgoHAiuwAytEAbAMIEWwAytEsA0gRbIMBwIrsQNGditEsA4gRbINBwIrsQNGditEsA8gRbIODQIrsQNGditEsBAgRbIPCQIrsQNGditEsBEgRbIQCAIrsQNGditEsBIgRbIRBwIrsQNGditEsBMgRbISDgIrsQNGditEsBQgRbITBwIrsQNGditEWbAUKwAAAAABT984vQAA");font-weight:normal;font-style:normal}
.icon:before{font-family:'lungojsicon';font-weight:normal !important}
.icon.home:before{content:"\0021"}
.icon.picture:before{content:"\0023"}
.icon.camera:before{content:"\0024"}
.icon.music:before{content:"\0025"}
.icon.broadcast:before{content:"\0026"}
.icon.microphone:before{content:"\0027"}
.icon.book:before{content:"\0028"}
.icon.folder:before{content:"\002a"}
.icon.tag:before{content:"\002b"}
.icon.ticket:before{content:"\002c"}
.icon.cart:before{content:"\002d"}
.icon.phone:before{content:"\002f"}
.icon.address:before{content:"\0030"}
.icon.mail:before{content:"\0031"}
.icon.mail-open:before{content:"\0032"}
.icon.pushpin:before{content:"\0033"}
.icon.compass:before{content:"\0034"}
.icon.clock:before{content:"\0035"}
.icon.calendar:before{content:"\0036"}
.icon.mobile:before{content:"\0037"}
.icon.inbox:before{content:"\0038"}
.icon.inbox-full:before{content:"\0039"}
.icon.user:before{content:"\003a"}
.icon.users:before{content:"\003b"}
.icon.vcard:before{content:"\003c"}
.icon.chat:before{content:"\003d"}
.icon.message:before{content:"\003e"}
.icon.search:before{content:"\003f"}
.icon.pie:before{content:"\0041"}
.icon.bars:before{content:"\0042"}
.icon.remove:before{content:"\0043"}
.icon.grid:before{content:"\0044"}
.icon.menu:before{content:"\0045"}
.icon.cloud:before{content:"\0047"}
.icon.upload:before{content:"\0048"}
.icon.star:before{content:"\004b"}
.icon.star-full:before{content:"\004a"}
.icon.heart:before{content:"\0049"}
.icon.heart-full:before{content:"\004c"}
.icon.thumbs-up:before{content:"\004d"}
.icon.thumbs-down:before{content:"\004e"}
.icon.help:before{content:"\0050"}
.icon.warning:before{content:"\0052"}
.icon.info:before{content:"\0053"}
.icon.cancel:before{content:"\0054"}
.icon.check:before{content:"\0051"}
.icon.multiply:before,.icon.close:before{content:"\0055"}
.icon.plus:before{content:"\0056"}
.icon.minus:before{content:"\0057"}
.icon.left:before{content:"\0058"}
.icon.down:before{content:"\0059"}
.icon.right:before{content:"\005a"}
.icon.up:before{content:"\005b"}
.icon.refresh:before{content:"\005c"}
.icon.share:before{content:"\002e"}
.icon.settings:before{content:"\004f"}
.icon.accessibility:before{content:"\0040"}
.icon.pencil:before{content:"\0022"}
.icon.file:before{content:"\005d"}
.icon.lock:before{content:"\0046"}
.icon.map:before{content:"\0029"}
.icon.eye:before{content:"\005e"}

@font-face{font-family:'lungojsiconbrand';src:url("data:font/truetype;charset=utf-8;base64,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");font-weight:normal;font-style:normal}
.icon.brand:before{font-family:'lungojsiconbrand';font-weight:normal !important}
.icon.brand.google-plus:before{content:"\0026"}
.icon.brand.google-plus-2:before{content:"\0021"}
.icon.brand.facebook:before{content:"\0025"}
.icon.brand.facebook-2:before{content:"\0022"}
.icon.brand.twitter:before{content:"\0023"}
.icon.brand.twitter-2:before{content:"\0024"}
.icon.brand.feed:before{content:"\0028"}
.icon.brand.feed-2:before{content:"\0027"}
.icon.brand.vimeo:before{content:"\0029"}
.icon.brand.vimeo-2:before{content:"\002a"}
.icon.brand.flickr:before{content:"\002b"}
.icon.brand.flickr-2:before{content:"\002c"}
.icon.brand.dribbble:before{content:"\002d"}
.icon.brand.dribbble-2:before{content:"\002e"}
.icon.brand.forrst:before{content:"\002f"}
.icon.brand.deviantart:before{content:"\0030"}
.icon.brand.deviantart-2:before{content:"\0031"}
.icon.brand.git:before{content:"\0032"}
.icon.brand.git-2:before{content:"\0033"}
.icon.brand.github:before{content:"\0044"}
.icon.brand.github-2:before{content:"\0045"}
.icon.brand.branch:before{content:"\0035"}
.icon.brand.fork:before{content:"\0034"}
.icon.brand.wordpress:before{content:"\0036"}
.icon.brand.wordpress-2:before{content:"\0037"}
.icon.brand.apple:before{content:"\0038"}
.icon.brand.android:before{content:"\0039"}
.icon.brand.windows:before{content:"\003a"}
.icon.brand.skype:before{content:"\003b"}
.icon.brand.linkedin:before{content:"\003c"}
.icon.brand.html5:before{content:"\003d"}
.icon.brand.html5-2:before{content:"\003e"}
.icon.brand.css3:before{content:"\003f"}
.icon.brand.chrome:before{content:"\0040"}
.icon.brand.firefox:before{content:"\0041"}
.icon.brand.IE:before{content:"\0042"}
.icon.brand.opera:before{content:"\0043"}

/**
 * Stylesheet
 *
 * @namespace Lungo.Theme
 * @class Default
 *
 * @author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
 */
@import url("http://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700");
/* -------------------------- THEME -------------------------- */
body {
  background-color: #222;
  font-family: "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 400;
  font-size: 13px;
  line-height: 1.3em;
  letter-spacing: -0.05em;
}
.theme,
li.theme,
a.theme {
  background-color: THEME-light;
}
.theme:active,
li.theme:active,
a.theme:active {
  background-color: #0093d5;
}
[data-control="pull"] {
  color: #666;
  -webkit-text-shadow: 0 1px 0 #fff;
  -moz-text-shadow: 0 1px 0 #fff;
  text-shadow: 0 1px 0 #fff;
}
/* -------------------------- LAYOUT COLORS -------------------------- */
section > header {
  background-color: #0093d5;
  -webkit-box-shadow: 0 1px 3px rgba(0,0,0,0.25), inset 0 1px 0 #03b1ff, inset 0 -1px 0 #007db5;
  -moz-box-shadow: 0 1px 3px rgba(0,0,0,0.25), inset 0 1px 0 #03b1ff, inset 0 -1px 0 #007db5;
  box-shadow: 0 1px 3px rgba(0,0,0,0.25), inset 0 1px 0 #03b1ff, inset 0 -1px 0 #007db5;
  color: #fff;
  -webkit-border-radius: 4px 4px 0 0;
  -moz-border-radius: 4px 4px 0 0;
  border-radius: 4px 4px 0 0;
}
section > footer,
section nav.groupbar {
  background-color: #222;
  -webkit-box-shadow: inset 0 3px 0 #1d1d1d;
  -moz-box-shadow: inset 0 3px 0 #1d1d1d;
  box-shadow: inset 0 3px 0 #1d1d1d;
}
section > article,
section > [data-control="pull"] {
  background-color: #f4f5f5;
}
section > article.splash,
section > [data-control="pull"].splash {
  background: #222;
  color: #fff;
}
section.aside {
  -webkit-box-shadow: -1px 0 2px rgba(0,0,0,0.2);
  -moz-box-shadow: -1px 0 2px rgba(0,0,0,0.2);
  box-shadow: -1px 0 2px rgba(0,0,0,0.2);
}
section.aside.right {
  -webkit-box-shadow: 1px 0 2px rgba(0,0,0,0.2);
  -moz-box-shadow: 1px 0 2px rgba(0,0,0,0.2);
  box-shadow: 1px 0 2px rgba(0,0,0,0.2);
}
aside {
  background-color: #1d1d1d;
  color: #fff;
}
aside > header,
aside > footer {
  background-color: #181818;
}
aside > header {
  -webkit-box-shadow: 0 1px 3px rgba(0,0,0,0.25), inset 0 1px 0 #222, inset 0 -1px 0 #141414;
  -moz-box-shadow: 0 1px 3px rgba(0,0,0,0.25), inset 0 1px 0 #222, inset 0 -1px 0 #141414;
  box-shadow: 0 1px 3px rgba(0,0,0,0.25), inset 0 1px 0 #222, inset 0 -1px 0 #141414;
}
/* -------------------------- NAVIGATION -------------------------- */
section > header > nav a:not(.button) {
  color: #00608a;
  -webkit-text-shadow: 0 1px 0 #20baff;
  -moz-text-shadow: 0 1px 0 #20baff;
  text-shadow: 0 1px 0 #20baff;
}
section > header > nav a:not(.button):active {
  color: #004a6b;
}
section > nav.groupbar > a.active {
  -webkit-box-shadow: inset 0 -3px 0 #0093d5;
  -moz-box-shadow: inset 0 -3px 0 #0093d5;
  box-shadow: inset 0 -3px 0 #0093d5;
}
section > footer > nav > a,
nav.groupbar > a {
  color: #888;
}
section > footer > nav > a.active,
nav.groupbar > a.active {
  color: #fff;
}
section > footer > nav > a {
  -webkit-box-shadow: 1px 0 0 #1d1d1d;
  -moz-box-shadow: 1px 0 0 #1d1d1d;
  box-shadow: 1px 0 0 #1d1d1d;
}
section > footer > nav > a.active {
  color: #fff;
  background-color: #1d1d1d;
  -webkit-box-shadow: inset 0 3px 0 #0093d5;
  -moz-box-shadow: inset 0 3px 0 #0093d5;
  box-shadow: inset 0 3px 0 #0093d5;
}
aside nav a {
  color: #4e4e4e;
}
aside nav a:active {
  color: #919191;
}
/* -------------------------- LISTS -------------------------- */
section .list li {
  background: #fff;
}
section .list li:not(.anchor) {
  border-bottom: inset 1px #ebebeb;
}
section .list li.secondary {
  -webkit-box-shadow: inset 4px 0px 0px #bfbfbf;
  -moz-box-shadow: inset 4px 0px 0px #bfbfbf;
  box-shadow: inset 4px 0px 0px #bfbfbf;
}
section .list li.accept {
  -webkit-box-shadow: inset 4px 0px 0px #3fb58e;
  -moz-box-shadow: inset 4px 0px 0px #3fb58e;
  box-shadow: inset 4px 0px 0px #3fb58e;
}
section .list li.cancel {
  -webkit-box-shadow: inset 4px 0px 0px #ee6557;
  -moz-box-shadow: inset 4px 0px 0px #ee6557;
  box-shadow: inset 4px 0px 0px #ee6557;
}
section .list li,
section .list li a {
  color: #333;
}
section .list li.anchor,
section .list li a.anchor {
  background: #222;
}
section .list li.dark,
section .list li a.dark {
  background: #595959;
}
section .list li.selectable:active,
section .list li a.selectable:active,
section .list li.theme,
section .list li a.theme,
section .list li.active,
section .list li a.active {
  background: #03b1ff;
}
section .list li.light,
section .list li a.light {
  background: #ebebeb;
  color: #7a7a7a;
}
section .list li.dark,
section .list li a.dark,
section .list li.selectable:active,
section .list li a.selectable:active,
section .list li.theme,
section .list li a.theme,
section .list li.anchor,
section .list li a.anchor,
section .list li.dark small,
section .list li a.dark small,
section .list li.selectable:active small,
section .list li a.selectable:active small,
section .list li.theme small,
section .list li a.theme small,
section .list li.anchor small,
section .list li a.anchor small,
section .list li.dark .right:not(.tag),
section .list li a.dark .right:not(.tag),
section .list li.selectable:active .right:not(.tag),
section .list li a.selectable:active .right:not(.tag),
section .list li.theme .right:not(.tag),
section .list li a.theme .right:not(.tag),
section .list li.anchor .right:not(.tag),
section .list li a.anchor .right:not(.tag) {
  color: #fff;
}
section .list li small,
section .list li a small,
section .list li .right:not(.tag),
section .list li a .right:not(.tag) {
  color: #7a7a7a;
}
.list:not(.indented) li.dark,
.list:not(.indented) li.theme,
.list:not(.indented) li.light {
  border-bottom-color: rgba(0,0,0,0.1);
}
aside .list li {
  background: none;
}
aside .list li:not(:first-child) {
  border-top: solid 1px #222;
}
aside .list li:not(:last-child) {
  border-bottom: solid 1px #141414;
}
aside .list li.active {
  background: #0093d5;
  border-color: transparent;
}
aside .list li.active strong,
aside .list li.active small,
aside .list li.active .icon {
  color: #fff;
}
aside .list li strong {
  color: #999;
}
aside .list li small,
aside .list li .icon {
  color: #666;
}
/* -------------------------- TAG -------------------------- */
.tag:not(.icon) {
  color: #fff;
  -webkit-border-radius: 2px;
  -moz-border-radius: 2px;
  border-radius: 2px;
  font-weight: 700 !important;
}
.tag:not(.icon).count {
  background-color: #0093d5;
}
.tag:not(.icon) header .count {
  background-color: THEME-dark !important;
}
footer .tag:not(.icon) {
  -webkit-box-shadow: inset 0 1px 1px rgba(255,255,255,0.3), 0 1px 2px rgba(0,0,0,0.5);
  -moz-box-shadow: inset 0 1px 1px rgba(255,255,255,0.3), 0 1px 2px rgba(0,0,0,0.5);
  box-shadow: inset 0 1px 1px rgba(255,255,255,0.3), 0 1px 2px rgba(0,0,0,0.5);
}
/* -------------------------- NOTIFICATION -------------------------- */
.notification {
  color: #fff;
}
.notification .window.growl {
  background: rgba(0,0,0,0.8);
}
.notification .window:not(.growl) {
  background: #e6e6e6;
  color: #222;
  -webkit-box-shadow: 0 0 8px #000;
  -moz-box-shadow: 0 0 8px #000;
  box-shadow: 0 0 8px #000;
}
.notification .window:not(.growl) button,
.notification .window:not(.growl) .button {
  background: #fff !important;
  -webkit-box-shadow: none !important;
  -moz-box-shadow: none !important;
  box-shadow: none !important;
  color: #007db5 !important;
  -webkit-border-radius: 0px !important;
  -moz-border-radius: 0px !important;
  border-radius: 0px !important;
  border: none !important;
  margin-bottom: 1px;
}
.notification .window:not(.growl).error {
  background: #dd2916;
  color: #fff;
}
.notification .window:not(.growl).success {
  background: #2f886b;
  color: #fff;
}
/* -------------------------- BUTTONS -------------------------- */
header .button,
header button {
  background-color: #007db5;
  -webkit-box-shadow: 0 1px 0 #03b1ff, inset 0 1px 0 #00608a;
  -moz-box-shadow: 0 1px 0 #03b1ff, inset 0 1px 0 #00608a;
  box-shadow: 0 1px 0 #03b1ff, inset 0 1px 0 #00608a;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
}
header .button:active,
header button:active {
  background-color: #005880;
}
article .button,
article button {
  -webkit-border-radius: FORM-border-radius;
  -moz-border-radius: FORM-border-radius;
  border-radius: FORM-border-radius;
  color: #fff;
  -webkit-border-radius: 2px;
  -moz-border-radius: 2px;
  border-radius: 2px;
  -webkit-box-shadow: inset 0 1px 0 rgba(255,255,255,0.2);
  -moz-box-shadow: inset 0 1px 0 rgba(255,255,255,0.2);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.2);
  border: solid 1px rgba(0,0,0,0.1);
}
article .button:active,
article button:active {
  -webkit-box-shadow: inset 0 0 128px rgba(0,0,0,0.25);
  -moz-box-shadow: inset 0 0 128px rgba(0,0,0,0.25);
  box-shadow: inset 0 0 128px rgba(0,0,0,0.25);
  border-color: none;
}
article .button.secondary,
article button.secondary {
  color: #666 !important;
}
article .button[disabled],
article button[disabled] {
  background-color: #000;
}
article button,
article .button,
article .tag:not(.icon) {
  background-color: #007db5;
}
article button.secondary,
article .button.secondary,
article .tag:not(.icon).secondary {
  background-color: #bfbfbf;
}
article button.accept,
article .button.accept,
article .tag:not(.icon).accept {
  background-color: #3fb58e;
}
article button.cancel,
article .button.cancel,
article .tag:not(.icon).cancel {
  background-color: #ee6557;
}
/* -------------------------- BUTTONS -------------------------- */
form label,
.form label {
  color: #aaa;
  font-weight: 300;
}
form fieldset,
.form fieldset {
  background: #fff;
  border-bottom: solid 1px #eee;
}
form fieldset .icon,
.form fieldset .icon {
  color: #ccc;
}
form input[type="text"],
.form input[type="text"],
form input[type="password"],
.form input[type="password"],
form input[type="date"],
.form input[type="date"],
form input[type="datetime"],
.form input[type="datetime"],
form input[type="email"],
.form input[type="email"],
form input[type="number"],
.form input[type="number"],
form input[type="search"],
.form input[type="search"],
form input[type="tel"],
.form input[type="tel"],
form input[type="time"],
.form input[type="time"],
form input[type="url"],
.form input[type="url"],
form select,
.form select,
form textarea,
.form textarea {
  background-color: #fff;
  color: rgba(0,0,0,0.75);
  border: 1px solid #ddd;
  -webkit-box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
  -moz-box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
  -webkit-border-radius: 0px;
  -moz-border-radius: 0px;
  border-radius: 0px;
}
form input[type="text"].error,
.form input[type="text"].error,
form input[type="password"].error,
.form input[type="password"].error,
form input[type="date"].error,
.form input[type="date"].error,
form input[type="datetime"].error,
.form input[type="datetime"].error,
form input[type="email"].error,
.form input[type="email"].error,
form input[type="number"].error,
.form input[type="number"].error,
form input[type="search"].error,
.form input[type="search"].error,
form input[type="tel"].error,
.form input[type="tel"].error,
form input[type="time"].error,
.form input[type="time"].error,
form input[type="url"].error,
.form input[type="url"].error,
form select.error,
.form select.error,
form textarea.error,
.form textarea.error,
form input[type="text"]:required,
.form input[type="text"]:required,
form input[type="password"]:required,
.form input[type="password"]:required,
form input[type="date"]:required,
.form input[type="date"]:required,
form input[type="datetime"]:required,
.form input[type="datetime"]:required,
form input[type="email"]:required,
.form input[type="email"]:required,
form input[type="number"]:required,
.form input[type="number"]:required,
form input[type="search"]:required,
.form input[type="search"]:required,
form input[type="tel"]:required,
.form input[type="tel"]:required,
form input[type="time"]:required,
.form input[type="time"]:required,
form input[type="url"]:required,
.form input[type="url"]:required,
form select:required,
.form select:required,
form textarea:required,
.form textarea:required {
  border-color: color_alert;
  color: color_alert;
  background-color: rgba(198,15,19,0.1);
}
form input[type="text"]:focus,
.form input[type="text"]:focus,
form input[type="password"]:focus,
.form input[type="password"]:focus,
form input[type="date"]:focus,
.form input[type="date"]:focus,
form input[type="datetime"]:focus,
.form input[type="datetime"]:focus,
form input[type="email"]:focus,
.form input[type="email"]:focus,
form input[type="number"]:focus,
.form input[type="number"]:focus,
form input[type="search"]:focus,
.form input[type="search"]:focus,
form input[type="tel"]:focus,
.form input[type="tel"]:focus,
form input[type="time"]:focus,
.form input[type="time"]:focus,
form input[type="url"]:focus,
.form input[type="url"]:focus,
form select:focus,
.form select:focus,
form textarea:focus,
.form textarea:focus {
  background: #fafafa;
  border-color: #0093d5;
  color: rgba(0,0,0,0.75);
}
form input[type="text"][disabled],
.form input[type="text"][disabled],
form input[type="password"][disabled],
.form input[type="password"][disabled],
form input[type="date"][disabled],
.form input[type="date"][disabled],
form input[type="datetime"][disabled],
.form input[type="datetime"][disabled],
form input[type="email"][disabled],
.form input[type="email"][disabled],
form input[type="number"][disabled],
.form input[type="number"][disabled],
form input[type="search"][disabled],
.form input[type="search"][disabled],
form input[type="tel"][disabled],
.form input[type="tel"][disabled],
form input[type="time"][disabled],
.form input[type="time"][disabled],
form input[type="url"][disabled],
.form input[type="url"][disabled],
form select[disabled],
.form select[disabled],
form textarea[disabled],
.form textarea[disabled] {
  background: #eee;
  border-color: #aaa;
  color: #999;
}
form .select:after,
.form .select:after {
  background: #d0d4c6;
  color: #fff;
  border-top-right-radius: 1px;
  border-bottom-right-radius: 1px;
}
form input[type=range],
.form input[type=range] {
  -webkit-box-shadow: 'inset 0 1px 2px rgba(0,0,0,0.1)';
  -moz-box-shadow: 'inset 0 1px 2px rgba(0,0,0,0.1)';
  box-shadow: 'inset 0 1px 2px rgba(0,0,0,0.1)';
}
form input[type=range]:not(.checkbox),
.form input[type=range]:not(.checkbox) {
  background-color: #ddd;
}
form input[type=range]:not(.checkbox):active,
.form input[type=range]:not(.checkbox):active {
  background-color: #03b1ff;
}
form input[type=range].checkbox,
.form input[type=range].checkbox {
  background-color: #aaa;
  color: rgba(255,255,255,0.6);
}
form input[type=range].checkbox.active,
.form input[type=range].checkbox.active {
  color: #fff;
  background-color: #03b1ff;
}
form input[type=range]::-webkit-slider-thumb,
.form input[type=range]::-webkit-slider-thumb {
  -webkit-border-radius: 2px;
  -moz-border-radius: 2px;
  border-radius: 2px;
  background-color: #e7eae2;
  border: solid 1px #d0d4c6;
}
form input[type=range]::-webkit-slider-thumb::after,
.form input[type=range]::-webkit-slider-thumb::after {
  background: #d0d4c6;
}
form .progress .bar,
.form .progress .bar {
  background-color: #ddd;
}
form .progress .bar .value,
.form .progress .bar .value {
  background-color: #03b1ff;
}
