// ==UserScript==
// @name         Substack Editor Helper
// @version      2024-02-08_0.1.3
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

    let editor;

    // look for the last "<div class="tiptap-menu-button-group">", insert a new button after it
    // use setInterval to check if the button group is ready, until it's ready, then insert the new button and stop the interval
    const addConvertButtonIntervalId = setInterval(() => {
        const buttonGroups = document.querySelectorAll('.tiptap-menu-button-group');
        if (buttonGroups.length > 0) {
            const newButtonGroup = document.createElement('div');
            newButtonGroup.className = 'tiptap-menu-button-group';
            const newButton = document.createElement('button');
            newButton.className = 'tiptap-menu-button';
            newButton.style = 'font-weight: 600';
            newButton.textContent = 'Convert';
            newButton.onclick = convert;
            newButtonGroup.appendChild(newButton);

            const lastButtonGroup = buttonGroups[buttonGroups.length - 1];
            lastButtonGroup.parentNode.insertBefore(newButtonGroup, lastButtonGroup.nextSibling);

            editor = document.querySelector('[data-testid="editor"]');

            clearInterval(addConvertButtonIntervalId);
        } else {
            console.log('Button group not ready');
        }
    }, 500);

    // Change replacements as { key, { name, regex, replacement } }
    const replacements = [
        { key: 'subscribe-now-button',
          name: 'Subscribe now button',
          regex: /<p>\r?\n?\[\[SUBSCRIBE NOW\]\]\r?\n?<\/p>\r?\n?/g,
          replacement: `<p class="button-wrapper" data-attrs="{&quot;url&quot;:&quot;%%checkout_url%%&quot;,&quot;text&quot;:&quot;Subscribe now&quot;,&quot;action&quot;:null,&quot;class&quot;:null}" data-component-name="ButtonCreateButton"><a class="button primary" href="%%checkout_url%%"><span>Subscribe now</span></a></p>` },
        { key: 'image-caption',
          name: 'Image caption',
          regex: /<figure>(.*)<\/figure><\/div><p>\r?\n?\[\[CAPTION: (.*)\]\]\r?\n?<\/p>/g,
          replacement: `<figure>$1<figcaption class="image-caption">$2</figcaption></figure>` },
        { key: 'footnotes-from',
          name: 'Footnotes from',
          regex: /<a target="_blank" rel="footnote" href="https:\/\/[^\/]*\/[a-zA-Z]*#fn(\d+)"><sup>(\d+)<\/sup><\/a>/g,
          replacement: `<a class="footnote-anchor" data-component-name="FootnoteAnchorToDOM" id="footnote-anchor-$1" href="#footnote-$1" target="_self">$1</a>` },
        { key: 'footnotes-section-start',
          name: 'Footnotes section start',
          regex: /<h2>Notes<\/h2><hr contenteditable="false"><ol>(.*)<\/ol>/g,
          replacement: '$1' },
        { key: 'footnotes-to',
          name: 'Footnotes to',
          regex: /<li><p>([^<]*)<a target="_blank" rel="noopener noreferrer nofollow" href="https:\/\/[^\/]*\/[a-zA-Z]*#fnref(\d+)">↩<\/a><\/p><\/li>/g,
          replacement: `<div class="footnote" data-component-name="FootnoteToDOM"><a id="footnote-$2" href="#footnote-anchor-$2" class="footnote-number" contenteditable="false" target="_self">$2</a><div class="footnote-content"><p>$1</p></div></div>` },
    ];

    //// const replacements = [
    ////     // Subscribe now button
    ////     { regex: /<p>\\r?\\n?\\[\\[SUBSCRIBE NOW\\]\\]\\r?\\n?<\/p>\\r?\\n?/g,
    ////       replacement: '<p class="button-wrapper" data-attrs="{&quot;url&quot;:&quot;%%checkout_url%%&quot;,&quot;text&quot;:&quot;Subscribe now&quot;,&quot;action&quot;:null,&quot;class&quot;:null}" data-component-name="ButtonCreateButton"><a class="button primary" href="%%checkout_url%%"><span>Subscribe now</span></a></p>' },
    ////     // Image caption
    ////     { regex: /<figure>(.*)<\/figure><\/div><p>\r?\n?\[\[CAPTION: (.*)\]\]\r?\n?<\/p>/g,
    ////       replacement: '<figure>$1<figcaption class="image-caption">$2</figcaption></figure>' },
    ////     // Footnotes from
    ////     { regex: /<a target="_blank" rel="footnote" href="https:\/\/[^\/]*\/[a-zA-Z]*#fn(\d+)"><sup>(\d+)<\/sup><\/a>/g,
    ////       replacement: '<a class="footnote-anchor" data-component-name="FootnoteAnchorToDOM" id="footnote-anchor-$1" href="#footnote-$1" target="_self">$1</a>' },
    ////     // Footnotes section start
    ////     { regex: /<h2>Notes<\/h2><hr contenteditable="false"><ol>(.*)<\/ol>/g,
    ////       replacement: '$1' },
    ////     // Footnotes to
    ////     { regex: /<li><p>([^<]*)<a target="_blank" rel="noopener noreferrer nofollow" href="https:\/\/[^\/]*\/[a-zA-Z]*#fnref(\d+)">↩<\/a><\/p><\/li>/g,
    ////       replacement: '<div class="footnote" data-component-name="FootnoteToDOM"><a id="footnote-$2" href="#footnote-anchor-$2" class="footnote-number" contenteditable="false" target="_self">$2</a><div class="footnote-content"><p>$1</p></div></div>' },
    //// ];

    // This event got fired after pasted into the editor and converted by Substack
    document.addEventListener('paste', function(e) {
        if (e.target.tagName !== 'BR' && !editor.contains(e.target)) {
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
    });

    function convert() {
        // document.execCommand('insertHTML', false, html);
        console.log(`editor before: ${editor.innerHTML}`);

        replacements.forEach(function(replacement) {
            var count = (editor.innerHTML.match(replacement.regex) || []).length;
            if (count > 0) {
                console.log(`${replacement.name}: ${count} occurrences`);
                editor.innerHTML = editor.innerHTML.replace(replacement.regex, replacement.replacement);
            }
        });

        // Dealing with footnote links, not working now
        // var links = editor.querySelectorAll('a[target="_blank"]');
        // links.forEach(function(link) {
        //     link.removeAttribute('target');
        //     link.innerHTML += "(replaced)";
        // });

        console.log(`editor after: ${editor.innerHTML}`);
    }
})();