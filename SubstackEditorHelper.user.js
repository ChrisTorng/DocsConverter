// ==UserScript==
// @name         Substack Editor Helper
// @version      2024-01-24_0.1.0
// @description  Make Substack Editor easier to import
// @homepage     https://github.com/ChrisTorng/DocsConverter/
// @downloadURL  https://github.com/ChrisTorng/DocsConverter/raw/main/SubstackEditorHelper.user.js
// @author       ChrisTorng
// @match        https://*.substack.com/publish/post/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // This event got fired after pasted into the editor and converted by Substack
    document.addEventListener('paste', function(e) {
        e.preventDefault();
        const html = (e.clipboardData || window.clipboardData).getData('text/html');
        if(html){
            // document.execCommand('insertHTML', false, html);
            const editor = document.querySelector('[data-testid="editor"]');
            console.log(editor.innerHTML);

            // Dealing with footnote links, not working now
            var links = editor.querySelectorAll('a[target="_blank"]');
            links.forEach(function(link) {
                link.removeAttribute('target');
                link.innerHTML += "(replaced)";
            });

            console.log(editor.innerHTML);
        }
        else {
            const text = (e.clipboardData || window.clipboardData).getData('text');
            console.log(text);
            // document.execCommand('insertText', false, text);
        }
    });
})();