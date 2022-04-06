---
title: "Automating the deployment of this website"
date: 2022-04-06T17:01:01+11:00
draft: false
---

After some [previous adventures]({{< ref "/posts/checksums_git_crlf" >}} "Line endings") getting this Hugo site up and running, I had a working but annoying process where I would edit the site in my web projects repo (with Hugo in live server mode) then publish it across to the GitHub Pages repo with ```hugo -d ..\samuelmay.github.io```. Then I had to commit to the web projects repo to save the work, and separately commit and push the GitHub Pages repo to deploy the site.

Now this is exactly the kind of thing that should be done automatically, and in fact the Hugo [guide for hosting on GitHub Pages](https://gohugo.io/hosting-and-deployment/hosting-on-github/) includes a decent how-to for setting up a GitHub Action. I started with that and only had to make a couple of tweaks. I changed the working and publish directories for the 'Build' and 'Deploy' actions, created an access token in my GitHub account and added it as a repository secret, and configured the 'Deploy' action to [push to an external repository](https://github.com/marketplace/actions/github-pages-action#%EF%B8%8F-deploy-to-external-repository-external_repository)). You have to configure the CNAME file as well in the 'Deploy' action, as it deletes everything already existing in the repository by default.

And it works pretty painlessly! I push the main branch, and away it goes. As a side effect, using the GitHub Action invisbly avoids the line endings issue from my previous post, as the build and hosting are both done on Linux, though it doesn't really solve it. In fact, it hides it - I mentioned that the 'Deploy' action deletes everything already in the repository, and that includes the previously checked-in '.gitattributes' file.