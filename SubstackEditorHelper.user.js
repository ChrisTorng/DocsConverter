// ==UserScript==
// @name         Substack Editor Helper
// @version      2024-03-24_0.1.6
// @description  Make Substack Editor easier to import
// @homepage     https://github.com/ChrisTorng/DocsConverter/
// @downloadURL  https://github.com/ChrisTorng/DocsConverter/raw/main/SubstackEditorHelper.user.js
// @updateURL    https://github.com/ChrisTorng/DocsConverter/raw/main/SubstackEditorHelper.user.js
// @author       ChrisTorng
// @match        https://*.substack.com/publish/post/*
// @include      */DocsConverter/UnitTest.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const executeAsyncDelay = 0;
    let editor;
    let moreButton;
    let addFootnoteButton;
    const range = document.createRange();
    const sel = window.getSelection();

    const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
    });

    function createButton(title, onclickAsync) {
        const newButtonGroup = document.createElement('div');
        newButtonGroup.className = 'tiptap-menu-button-group';
        const newButton = document.createElement('button');
        newButton.className = 'tiptap-menu-button';
        newButton.style.fontWeight = '600';
        newButton.textContent = title;

        newButton.onclick = async (event) => {
            try {
                await onclickAsync(event);
            } catch (error) {
                console.error('Async onclick handler error:', error);
            }
        };

        newButtonGroup.appendChild(newButton);
        return newButtonGroup;
    }

    async function getFootnoteButton() {
        // Click the "More" button to show the dropdown menu
        await executeAsync(() => moreButton.dispatchEvent(clickEvent), 0);

        // Get all div elements in the document
        var allPencrafts = document.querySelectorAll('div.pencraft');

        // Iterate through them to find the one with "Footnote" as its content
        for (let div of allPencrafts) {
            if (div.textContent.trim() === "Footnote") {
                console.log("Found the div with 'Footnote'");
                const footnoteButton = div.parentElement;
                console.log(footnoteButton);

                // Click the "More" button again to hide the dropdown menu
                await executeAsync(() => moreButton.dispatchEvent(clickEvent), 0);
                return footnoteButton;
            }
        }
        console.log('Footnote button not found');
        // Click the "More" button again to hide the dropdown menu
        await executeAsync(() => moreButton.dispatchEvent(clickEvent), 0);
    }

    async function initEditor() {
        editor = document.querySelector('[data-testid="editor"]');
        moreButton = document.querySelector('[data-testid="more-submenu"]');
        if (!moreButton) {
            console.log('moreButton not ready');
            retryInitEditor();
            return;
        }

        if (!addFootnoteButton) {
            addFootnoteButton = await getFootnoteButton();
            if (!addFootnoteButton) {
                console.log('addFootnoteButton not ready');
                retryInitEditor();
                return;
            }
        }

        const tiptapMenu = document.querySelectorAll('.tiptap-menu');
        if (tiptapMenu.length === 0) {
            console.log('tiptapMenu not ready');
            retryInitEditor();
            return;
        }

        if (tiptapMenu[0].childNodes.length === 0) {
            console.log('tiptapMenu\'s childNodes not ready');
            retryInitEditor();
            return;
        }

        const buttonGroups = tiptapMenu[0].childNodes[0];
        const convertButton = createButton('Convert', convert);
        const fnButton = createButton('Footnotes', searchAndAddAllFootnotes);
        // const testButton = createButton('Test', test);
        buttonGroups.appendChild(convertButton);
        buttonGroups.appendChild(fnButton);
        // buttonGroups.appendChild(testButton);
    }

    // look for the last "<div class="tiptap-menu-button-group">", insert a new button after it
    // use setInterval to check if the button group is ready, until it's ready, then insert the new button and stop the interval
    function retryInitEditor() {
        setTimeout(async () => initEditor(), 500);
    }

    retryInitEditor();

    const replacements = [
        {
            name: 'Subscribe now button',
            regex: /<p>(?:<em>)?\[\[Subscribe now\]\](?:<\/em>)?<\/p>/g,
            replacement: '<p class="button-wrapper" data-attrs="{&quot;url&quot;:&quot;%%checkout_url%%&quot;,&quot;text&quot;:&quot;Subscribe now&quot;,&quot;action&quot;:null,&quot;class&quot;:null}" data-component-name="ButtonCreateButton"><a class="button primary" href="%%checkout_url%%"><span>Subscribe now</span></a></p>'
        },
        {
            name: 'Share this post button',
            regex: /<p>(?:<em>)?\[\[Share this post\]\](?:<\/em>)?<\/p>/g,
            replacement: '<p class="button-wrapper" data-attrs="{&quot;url&quot;:&quot;%%share_url%%&quot;,&quot;text&quot;:&quot;Share&quot;,&quot;action&quot;:null,&quot;class&quot;:null}" data-component-name="ButtonCreateButton"><a class="button primary" href="%%share_url%%"><span>Share</span></a></p>'
        },
        {
            name: 'Image caption',
            regex: /<figure>((?:(?!<\/figure>).)*)<\/figure><\/div><p>\[\[Image caption: (.*?)\]\]<\/p>/g,
            replacement: '<figure>$1<figcaption class="image-caption">$2</figcaption></figure>'
        },
        {
            name: 'Footnotes from',
            regex: /<a target="_blank" rel="footnote" href="https:\/\/[^\/]*\/[a-zA-Z]*#fn(\d+)"><sup>(\d+)<\/sup><\/a>/g,
            replacement: '[[$1]]'
        },
        //   { name: 'Footnotes from',
        //   regex: /<a target="_blank" rel="footnote" href="https:\/\/[^\/]*\/[a-zA-Z]*#fn(\d+)"><sup>(\d+)<\/sup><\/a>/g,
        //   replacement: '<a class="footnote-anchor" data-component-name="FootnoteAnchorToDOM" id="footnote-anchor-$1" href="#footnote-$1" target="_self">[[$1]]</a>' },
        // { name: 'Combined footnotes',
        //   regex: /<a target="_blank" rel="footnote" href="https:\/\/[^\/]*\/[a-zA-Z]*#fn(\d+)"><sup>(\d+)<\/sup><\/a>(.*)(?:<ol>)?<li><p>((?:(?!&nbsp;).)*)&nbsp;<a\s+target="_blank"\s+rel="noopener noreferrer nofollow".href="https:\/\/([A-Za-z0-9\-\.\/]*)#fnref(\d*)">↩<\/a><\/p><\/li>(?:<\/ol>)?/g,
        //   replacement: '<a class="footnote-anchor" data-component-name="FootnoteAnchorToDOM" id="footnote-anchor-$1" href="#footnote-$1" target="_self">[[$1: $5]]</a>$4' },
        // { name: 'Temp Footnotes to',
        //   regex: /(?:<ol>)?<li><p>((?:(?!&nbsp;).)*)&nbsp;<a\s+target="_blank"\s+rel="noopener noreferrer nofollow".href="https:\/\/([A-Za-z0-9\-\.\/]*)#fnref(\d*)">↩<\/a><\/p><\/li>(?:<\/ol>)?/g,
        //   replacement: '$3. <em>$1</em><br/>' },
        // { name: 'Footnotes section start',
        //   regex: /<h2>Notes<\/h2><hr contenteditable="false"><ol>(.*)<\/ol>/g,
        //   replacement: '$1' },
        // { name: 'Footnotes to',
        //   regex: /<li><p>([^<]*)<a target="_blank" rel="noopener noreferrer nofollow" href="https:\/\/[^\/]*\/[a-zA-Z]*#fnref(\d+)">↩<\/a><\/p><\/li>/g,
        //   replacement: '<div class="footnote" data-component-name="FootnoteToDOM"><a id="footnote-$2" href="#footnote-anchor-$2" class="footnote-number" contenteditable="false" target="_self">$2</a><div class="footnote-content"><p>$1</p></div></div>' },
    ];

    const footnotesSection = /<h2>Notes<\/h2><hr contenteditable="false"><ol>(.*)<\/ol>/g;
    const tempFootnotesTo = /(?:<ol>)?<li><p>((?:(?!&nbsp;).)*)&nbsp;<a\s+target="_blank"\s+rel="noopener noreferrer nofollow".href="https:\/\/([A-Za-z0-9\-\.\/]*)#fnref(\d*)">↩<\/a><\/p><\/li>(?:<\/ol>)?/g;
    const footnoteSectionStart = /<h2>Notes<\/h2><hr contenteditable="false">/g;

    // // This event got fired after pasted into the editor and converted by Substack
    // document.addEventListener('paste', function(e) {
    //     if (e.target.tagName !== 'BR' && !editor.contains(e.target)) {
    //         console.log('Not in the editor');
    //         return;
    //     }

    //     let html = (e.clipboardData || window.clipboardData).getData('text/html');
    //     if (!html) {
    //         console.log('No HTML data');
    //         return;
    //     }

    //     e.preventDefault();

    //     console.log(`Pasted: ${html}`);
    // });

    async function convert() {
        let html = editor.innerHTML;
        console.log(`editor before: ${html}`);

        replacements.forEach(function (replacement) {
            var count = (html.match(replacement.regex) || []).length;
            if (count > 0) {
                console.log(`${replacement.name}: ${count} occurrences`);
                html = html.replace(replacement.regex, replacement.replacement);
            }
        });

        html = combineFootnotesTo(html);

        editor.innerHTML = html;
        console.log(`editor after: ${editor.innerHTML}`);
    }

    async function traverseNodes(node, callback) {
        if (node.nodeType === Node.TEXT_NODE) {
            return await callback(node);
        }

        var child = node.firstChild;
        while (child) {
            if (await traverseNodes(child, callback)) {
                return true;
            }
            child = child.nextSibling;
        }

        return false;
    }

    async function searchAndAddOneFootnote(index, node, range, sel) {
        const searchText = `[[${index}: `;
        const text = node.nodeValue;
        const startPos = text.indexOf(searchText);
        // console.log(`searchAndAddOneFootnote: ${index}, ${node.nodeType}, ${node.nodeValue}, ${searchText}, ${startPos}`);

        if (startPos === -1) {
            // console.log('startPos not found');
            return false;
        }

        const endPos = text.indexOf(']]', startPos);
        if (endPos === -1) {
            // console.log('endPos not found');
            select(node, startPos);
            await executeAsync(() => moreButton.dispatchEvent(clickEvent));
            await executeAsync(() => addFootnoteButton.dispatchEvent(clickEvent));
            select(editor, 0);
            console.log(`searchAndAddOneFootnote: found ${index} but endPos not found`);
            return true;
        }

        const footnoteText = text.substring(startPos + searchText.length, endPos);
        // console.log(`startPos: ${startPos}, endPos: ${endPos}, footnoteText: ${footnoteText}`);

        select(node, startPos, endPos + 2);
        // console.log(`range: ${range}, sel: ${sel}, ${sel.toString()}`);
        range.deleteContents();

        await executeAsync(() => moreButton.dispatchEvent(clickEvent));
        await executeAsync(() => addFootnoteButton.dispatchEvent(clickEvent));
        await executeAsync(() => moreButton.dispatchEvent(clickEvent));
        await executeAsync(() => insertHtmlAtCursor(footnoteText));
        await executeAsync(() => deleteFollowingEmptyParagraph());
        select(editor, 0);
        console.log(`searchAndAddOneFootnote: added ${index}: ${footnoteText}`);
        return true;
    }

    async function searchAndAddAllFootnotes() {
        editor.focus();
        let currentFootnoteIndex = 1;

        while (await traverseNodes(editor, async node => {
            // console.log(`current node: ${node.nodeType}, ${node.nodeValue}`);
            return await searchAndAddOneFootnote(currentFootnoteIndex, node, range, sel)
        })) {
            currentFootnoteIndex++;
        }
    }

    function executeAsync(callback, delayMs = executeAsyncDelay) {
        try {
            // console.log('executeAsync', callback.toString());
            callback();
            // console.log('executeAsync done', callback.toString());
            return new Promise(resolve => setTimeout(resolve, delayMs));
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        }
    }

    function insertHtmlAtCursor(html) {
        const sel = window.getSelection();
        if (!sel.rangeCount) return;

        const range = sel.getRangeAt(0);
        range.deleteContents();

        const fragment = range.createContextualFragment(html);
        range.insertNode(fragment);

        if (fragment.childNodes.length > 0) {
            const lastInsertedNode = fragment.childNodes[fragment.childNodes.length - 1];
            const newRange = document.createRange();
    
            newRange.setStartAfter(lastInsertedNode);
            newRange.setEndAfter(lastInsertedNode);
    
            sel.removeAllRanges();
            sel.addRange(newRange);
        }
    }

    function deleteFollowingEmptyParagraph() {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
    
        const range = selection.getRangeAt(0);
        let container = range.endContainer;
        console.log(`container: ${container}, ${container.nodeType}, ${container.tagName}, ${range.endOffset}, ${container.length}`);
    
        if (container.nodeType === Node.TEXT_NODE && range.endOffset !== container.length) {
            console.log('Not at the end of the text node');
            return;
        }
    
        while (container.nodeType === Node.TEXT_NODE) {
            container = container.parentNode;
            console.log('parent container:', container);
        }
    
        let nextNode = container.nextSibling;
        console.log(`Next node: ${nextNode}, ${nextNode?.tagName}, ${nextNode?.textContent}`);
        while (!nextNode) {
            container = container.parentNode;
            console.log('parent container:', container);
            nextNode = container.nextSibling;
            console.log(`Next node: ${nextNode}, ${nextNode?.tagName}, ${nextNode?.textContent}`);
        }

        if (nextNode && nextNode.nodeType === Node.ELEMENT_NODE) {
            if (nextNode.tagName === 'P' && nextNode.textContent.trim() === '') {
                nextNode.remove();
            } else {
                console.log('Next node is not an empty paragraph');
            }
        }
    }

    // function jumpToFootnoteAnchor() {
    //     const sel = window.getSelection();
    //     if (!sel.rangeCount) return; // 确保有选区

    //     let node = sel.getRangeAt(0).startContainer;

    //     // 向上遍历找到最近的包含 class='footnote' 的父元素
    //     const footnoteElem = node.nodeType === 3 ? node.parentNode : node; // 如果当前节点是文本节点，从其父节点开始
    //     const footnoteContainer = footnoteElem.closest('.footnote');

    //     if (!footnoteContainer) {
    //         console.log("Footnote container not found.");
    //         return;
    //     }

    //     // 在 footnoteContainer 中找到 <a> 元素
    //     const anchor = footnoteContainer.querySelector('a.footnote-number');
    //     if (!anchor || !anchor.href) {
    //         console.log("Anchor element or href not found.");
    //         return;
    //     }

    //     //anchor.dispatchEvent(clickEvent);
    // }

    function select(node, start, end = start) {
        sel.removeAllRanges();
        range.setStart(node, start);
        range.setEnd(node, end);
        // console.log(`select: ${node}, ${start}, ${end}, ${range}, ${sel}, ${sel.toString()}`);
        sel.addRange(range);
    }

    async function test() {
        //editor.focus();
        await executeAsync(() => moreButton.dispatchEvent(clickEvent));
        await executeAsync(() => addFootnoteButton.dispatchEvent(clickEvent));
        await executeAsync(() => moreButton.dispatchEvent(clickEvent));
        await executeAsync(() => insertHtmlAtCursor('test'));
        await executeAsync(() => deleteFollowingEmptyParagraph());
        select(editor, 0);
        // await executeAsync(() => jumpToFootnoteAnchor());
    }

    function escapeHTML(htmlString) {
        return htmlString
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    function combineFootnotesTo(text) {
        const notesSections = text.match(footnotesSection);
        if (notesSections) {
            const notesSection = notesSections[0]; // get <ol>...</ol>
            const replacedNotesSection = notesSection.replace(tempFootnotesTo, (match, p1, p2, p3) => {
                // replace the footnote from with the combined footnote
                const escapedHtml = escapeHTML(p1);
                const footnoteRefRegex = new RegExp(`\\[\\[${p3}\\]\\]`, 'g');
                text = text.replace(footnoteRefRegex, `[[${p3}: ${escapedHtml}]]`);
                return ''; // remove the temp footnote to
            });

            // replace the original notes section with the combined notes section
            text = text.replace(footnotesSection, replacedNotesSection);
            // remove the notes section start
            text = text.replace(footnoteSectionStart, '');
        }

        return text;
    }
})();