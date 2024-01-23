// ==UserScript==
// @name         Substack Editor Helper
// @namespace    http://tampermonkey.net/
// @version      2024-01-22
// @description  Make Substack Editor easier to import
// @author       ChrisTorng
// @match        https://*.substack.com/publish/post/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('paste', function(e) {
        e.preventDefault();
        const html = (e.clipboardData || window.clipboardData).getData('text/html');
        if(html){
//            document.execCommand('insertHTML', false, html);
            const editor = document.querySelector('[data-testid="editor"]');
            console.log(editor.innerHTML);

            var links = editor.querySelectorAll('a[target="_blank"]');
            links.forEach(function(link) {
                link.removeAttribute('target');
                link.innerHTML += "replaced";
            });

            console.log(editor.innerHTML);
        }
        else {
            const text = (e.clipboardData || window.clipboardData).getData('text');
            console.log(text);
            document.execCommand('insertText', false, text);
        }
    });
})();