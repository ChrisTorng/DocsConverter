DocsConverter
=============

For [Google Docs](https://docs.google.com) to [Substack](https://substack.com) converting tool.

[Visit DocsConverter site](https://christorng.github.io/DocsConverter/) / [view source](https://github.com/ChrisTorng/DocsConverter).

Action Plan
-----------

[Previous experience](https://github.com/ChrisTorng/DocsConverter/discussions/2) on converting tool. Some [Initial tests](https://github.com/ChrisTorng/DocsConverter/discussions/3) and [Current Plan](https://github.com/ChrisTorng/DocsConverter/discussions/4).

It's using [Docs to HTML Converter](https://github.com/ChrisTorng/gd2md-html) repo, forked from [Docs to Markdown](https://workspace.google.com/marketplace/app/docs_to_markdown/700168918607) add-on (source [gd2md-html](https://github.com/evbacher/gd2md-html)), to convert Google Docs into HTML. Then use [Tampermonkey](https://www.tampermonkey.net/) with [SubstackEditorHelper.user.js](SubstackEditorHelper.user.js), to hook on Substack Editor, capture the paste event and do some converting job.

Install
-------
The new [Docs to HTML Converter](https://github.com/ChrisTorng/gd2md-html) is working on my account, but still can't figure out how to share this testing add-on to anyone who wish to test it. See this issue [How to publish it for anyone who wants to test and help?](https://github.com/ChrisTorng/gd2md-html/discussions/6) for details. There is a manually setup on [wiki](https://github.com/ChrisTorng/gd2md-html/wiki).

Currently, you can install the original [Docs to Markdown](https://workspace.google.com/marketplace/app/docs_to_markdown/700168918607) add-on instead. For any issue, reference to [Troubleshooting](https://github.com/evbacher/gd2md-html/wiki#troubleshooting).

Install [Tampermonkey](https://www.tampermonkey.net/), then install [SubstackEditorHelper.user.js](https://christorng.github.io/DocsConverter/SubstackEditorHelper.user.js). You can update the script manually from the Tampermonkey Dashboard's Last Updated column, or it will update daily. You need to refresh Substack page to apply updated script.

Test
----
Open [MinimalTest.html](MinimalTest.html) in browser, select all and copy the content.

Create a [Substack](https://substack.com) account. Create a new post. Paste the copied html content into content editor. You should see hyperlinks have "(replaced)" text attached, proving that this script is working. You can see F12 Development Tool's Console output for more details.