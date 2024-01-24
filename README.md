# DocsConverter

For Google Docs to Substack converting tool.

My [previous experience](discussions/2) on converting tool.

[My initial tests](discussions/3) and [Current Plan](discussions/4).

[SubstackEditorHelper.user.js](SubstackEditorHelper.user.js) can be imported into [Tampermonkey](https://www.tampermonkey.net/). It hooks on Substack Editor, capture the paste event and do some converting job. It's far from finished. But proved this is achievable.

Install
-------
Not necessary by now:

> Install [Docs to Markdown](https://workspace.google.com/marketplace/app/docs_to_markdown/700168918607) to convert Google Docs to HTML. If you can't install or turn on it, try to logout all account, relogin again to try.

Install [Tampermonkey](https://www.tampermonkey.net/), then install [SubstackEditorHelper.user.js](raw/main/SubstackEditorHelper.user.js). You can update the script manually from the Tampermonkey Dashboard's Last Updated column, or it will update daily.

Test
----
Download [raw MinimalTest.html](raw/main/MinimalTest.html) and save as .html. Open it in browser, select all and copy the content.

Create a [Substack](https://substack.com) account. Create a new post. Paste the copied html content into content editor. You should see hyperlinks have "(replaced)" text attached, proving that this script is working. You can see F12 Development Tool's Console output for details.