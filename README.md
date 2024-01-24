# DocsConverter

For Google Docs to Substack converting tool.

My [previous experience](https://github.com/ChrisTorng/DocsConverter/discussions/2) on converting tool.

[My initial tests](https://github.com/ChrisTorng/DocsConverter/discussions/3) and [Current Plan](https://github.com/ChrisTorng/DocsConverter/discussions/4).

[SubstackEditorHelper.user.js](SubstackEditorHelper.user.js) can be imported into [Tampermonkey](https://www.tampermonkey.net/). It hooks on Substack Editor, capture the paste event and do some converting job. It's far from finished. But proved this is achievable.

Install
-------
Not necessary by now:

> Install [Docs to Markdown](https://workspace.google.com/marketplace/app/docs_to_markdown/700168918607) to convert Google Docs to HTML. If you can't install or turn on it, try to logout all account, relogin again to try.

Install [Tampermonkey](https://www.tampermonkey.net/), then install [SubstackEditorHelper.user.js](https://github.com/ChrisTorng/DocsConverter/raw/main/SubstackEditorHelper.user.js). You can only install every time for updating the script because of this is a private repo.

Test
----
Download [raw MinimalTest.html](https://github.com/ChrisTorng/DocsConverter/raw/main/MinimalTest.html) and save as .html. Open it in browser, select all and copy the content.

Create a [Substack](https://substack.com) account. Create a new post. Paste the copied html content into content editor. You should see hyperlinks have "(replaced)" text attached, proving that this script is working. You can see F12 Development Tool's Console output for details.