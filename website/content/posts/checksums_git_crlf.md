---
title: "Static website subresource integrity and text file line endings"
date: 2022-04-03T14:08:24+11:00
draft: false
---
When I was creating this site and playing around with Hug, I encountered [this issue for the Anatole theme](https://github.com/lxndrblz/anatole/issues/114#issuecomment-828750909). Hugo is thorough enough when it minifies resource files to add 'integrity' attributes with calculated checksums for the minified files.

Now when you're using GitHub pages or another web host that serves the content out of a Git repository, it turns out the operating system that the web host is running actually matters. That is, it matters if you're developing on a different one. A bug/feature of Git is that [it can magically change the line endings](https://docs.github.com/en/get-started/getting-started-with-git/configuring-git-to-handle-line-endings) of text files it checks out, to match the local operating system convention. Now if you have built your static site on Windows, pushed it to GitHub, and the GitHub Pages host server then checks out the site on a Linux host, the line endings on the resource files might be different - which will invalidate the checksums!

My solution was to check in a '.gitattributes' file to the GitHub Pages repository, which tells git to force CSS files to always be checked out with the same line endings:

```
*.css text eol=crlf
```