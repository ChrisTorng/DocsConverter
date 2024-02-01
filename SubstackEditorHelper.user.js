// ==UserScript==
// @name         Substack Editor Helper
// @version      2024-01-24_0.1.1
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

    const subscribeNowRegEx = /<p>\r?\n?\[\[SUBSCRIBE NOW\]\]\r?\n?<\/p>\r?\n?/g;
    const subscribeNowHtml = `<p class="button-wrapper"
data-attrs="{&quot;url&quot;:&quot;%%checkout_url%%&quot;,&quot;text&quot;:&quot;Subscribe now&quot;,&quot;action&quot;:null,&quot;class&quot;:null}"
data-component-name="ButtonCreateButton"><a class="button primary" href="%%checkout_url%%"><span>Subscribe now</span></a></p>`;

    // This event got fired after pasted into the editor and converted by Substack
    document.addEventListener('paste', function(e) {
        e.preventDefault();
        const html = (e.clipboardData || window.clipboardData).getData('text/html');
        if (!html) {
            console.log('No HTML data, skipping');
            return;
        }

        // document.execCommand('insertHTML', false, html);
        const editor = document.querySelector('[data-testid="editor"]');
        console.log(`Originally: ${editor.innerHTML}`);

        editor.innerHTML = editor.innerHTML.replace(subscribeNowRegEx, subscribeNowHtml);

        // Dealing with footnote links, not working now
        // var links = editor.querySelectorAll('a[target="_blank"]');
        // links.forEach(function(link) {
        //     link.removeAttribute('target');
        //     link.innerHTML += "(replaced)";
        // });

        console.log(`Processed: ${editor.innerHTML}`);
    });
})();