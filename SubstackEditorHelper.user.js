// ==UserScript==
// @name         Substack Editor Helper
// @version      2024-02-03_0.1.2
// @description  Make Substack Editor easier to import
// @homepage     https://github.com/ChrisTorng/DocsConverter/
// @downloadURL  https://github.com/ChrisTorng/DocsConverter/raw/main/SubstackEditorHelper.user.js
// @updateURL    https://github.com/ChrisTorng/DocsConverter/raw/main/SubstackEditorHelper.user.js
// @author       ChrisTorng
// @match        https://*.substack.com/publish/post/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const replacements = [
        // Subscribe now button
        { regex: /<p>\r?\n?\[\[SUBSCRIBE NOW\]\]\r?\n?<\/p>\r?\n?/g,
          replacement: `<p class="button-wrapper" data-attrs="{&quot;url&quot;:&quot;%%checkout_url%%&quot;,&quot;text&quot;:&quot;Subscribe now&quot;,&quot;action&quot;:null,&quot;class&quot;:null}" data-component-name="ButtonCreateButton"><a class="button primary" href="%%checkout_url%%"><span>Subscribe now</span></a></p>` },
        // Footnotes from
        { regex: /<a target="_blank" rel="footnote" href="https:\/\/[^\/]*\/[a-zA-Z]*#fn(\d+)"><sup>(\d+)<\/sup><\/a>/g,
          replacement: `<a class="footnote-anchor" data-component-name="FootnoteAnchorToDOM" id="footnote-anchor-$1" href="#footnote-$1" target="_self">$1</a>` },
        // Footnotes section start
        { regex: /<h2>Notes<\/h2><hr contenteditable="false"><ol>(.*)<\/ol>/g,
          replacement: '$1' },
        // Footnotes to
        { regex: /<li><p>([^<]*)<a target="_blank" rel="noopener noreferrer nofollow" href="https:\/\/[^\/]*\/[a-zA-Z]*#fnref(\d+)">↩<\/a><\/p><\/li>/g,
          replacement: `<div class="footnote" data-component-name="FootnoteToDOM"><a id="footnote-$2" href="#footnote-anchor-$2" class="footnote-number" contenteditable="false" target="_self">$2</a><div class="footnote-content"><p>$1</p></div></div>` },
    ];

    // This event got fired after pasted into the editor and converted by Substack
    document.addEventListener('paste', function(e) {
        const editor = document.querySelector('[data-testid="editor"]');
        if (!editor.contains(e.target)) {
            console.log('Not in the editor');
            return;
        }

        let html = (e.clipboardData || window.clipboardData).getData('text/html');
        if (!html) {
            console.log('No HTML data');
            return;
        }

        e.preventDefault();

        console.log(`Pasted: ${html}`);

        // document.execCommand('insertHTML', false, html);
        console.log(`editor before: ${editor.innerHTML}`);

        // Replace all replacements
        replacements.forEach(function(replacement) {
            editor.innerHTML = editor.innerHTML.replace(replacement.regex, replacement.replacement);
        });

        // Dealing with footnote links, not working now
        // var links = editor.querySelectorAll('a[target="_blank"]');
        // links.forEach(function(link) {
        //     link.removeAttribute('target');
        //     link.innerHTML += "(replaced)";
        // });

        console.log(`editor after: ${editor.innerHTML}`);
    });
})();