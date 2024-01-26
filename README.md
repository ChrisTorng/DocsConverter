DocsConverter
=============

For [Google Docs](https://docs.google.com) to [Substack](https://substack.com) converting tool.

[Visit DocsConverter site](https://christorng.github.io/DocsConverter/)

Action Plan
-----------

[Previous experience](https://github.com/ChrisTorng/DocsConverter/discussions/2) on converting tool. Some [Initial tests](https://github.com/ChrisTorng/DocsConverter/discussions/3) and [Current Plan](https://github.com/ChrisTorng/DocsConverter/discussions/4).

It's using [Docs to Markdown](https://workspace.google.com/marketplace/app/docs_to_markdown/700168918607) Extension (source [gd2md-html](https://github.com/evbacher/gd2md-html)) to convert Google Docs into HTML. Then use [Tampermonkey](https://www.tampermonkey.net/) to hook on Substack site. Do the last converting while pasting.

There is a public [Docs to HTML Converter](https://github.com/ChrisTorng/gd2md-html) repo, forked from [Docs to Markdown (gd2md-html)](https://github.com/evbacher/gd2md-html), fixing things (like embedding images) there.

Currently [SubstackEditorHelper.user.js](SubstackEditorHelper.user.js) can be imported into [Tampermonkey](https://www.tampermonkey.net/). It hooks on Substack Editor, capture the paste event and do some converting job. It's far from finished. But proved this is achievable.

Install
-------
Not necessary by now:

> Install [Docs to Markdown](https://workspace.google.com/marketplace/app/docs_to_markdown/700168918607) to convert Google Docs to HTML. For any issue, reference to [Troubleshooting](https://github.com/evbacher/gd2md-html/wiki#troubleshooting).

Install [Tampermonkey](https://www.tampermonkey.net/), then install [SubstackEditorHelper.user.js](https://christorng.github.io/DocsConverter/SubstackEditorHelper.user.js). You can update the script manually from the Tampermonkey Dashboard's Last Updated column, or it will update daily. You need to refresh Substack page to apply updated script.

Test
----
Open [MinimalTest.html](MinimalTest.html) in browser, select all and copy the content.

Create a [Substack](https://substack.com) account. Create a new post. Paste the copied html content into content editor. You should see hyperlinks have "(replaced)" text attached, proving that this script is working. You can see F12 Development Tool's Console output for more details.