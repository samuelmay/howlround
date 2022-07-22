---
title: "Rust Australia Sydney meetup"
date: 2022-07-22T09:33:25+10:00
draft: false
---
Last Tuesday I tuned in for the [Rust Australia virtual meetup](https://github.com/RustAU/Virtual). I don't think it's the inaugural one, but it's the first one post-pandemic. Well done to the organisers. There's talk of a physical meetup in September, which I look forward to. The stream was organised on Twitch with discussion on Discord, and the rapid-fire stream of reaction emojis was defnitely more hip than I'm used to for software presentations!

There is a lot of work going on in the WASM space. I think Rust had a WASM compliation target quite early and it seems to be a bit of a flagship symbiosis for both projects, if that makes sense. Plenty of people have pointed out that WASM is covering a lot of the same ground as other "run anywhere" VMs like Java, .NET, Adobe Flash, and even some IMB mainframe systems. I barely remember Java Applets - I think one of my very first projects when learning to program was a stopwatch applet (Java Applets were probably already irrelevant by that point but must have still been a common tutorial topic). However, I definitely hear the argument from the WASM proponents that 1) lessons have been learnt from these previous technologies, and improvements made, and 2) this time it's an open standard, already built in to the major browsers, and not being pushed by a particular corporation.

Another major topic was async runtimes. There were a few projects in this space, with Erlang often being cited as an inspiriation. [Lunatic](https://github.com/lunatic-solutions/lunatic) in particular seemed pretty cool. One guy was also building a web platform on Lunatic called "Puck" that had some live view style features and server-side DOM diffing, very ambitious but exciting. I can't find the link right now unfortunately.

I have to say though I was particularly interested to hear about [BonsaiDB](https://github.com/khonsulabs/bonsaidb). As a systems language it seems that Rust should be a good choice for implementing databases. Of course the big RDBMS projects are so vital and high-quality these days, and e.g. SQLite is at the pinnacle of quality tested C code, so it's hard to imagine them ever being "rewritten in Rust".
