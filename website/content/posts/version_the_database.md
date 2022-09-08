---
title: "Version the god-damned database"
date: 2022-09-08T09:14:14+10:00
draft: false
---
Graph-based version control is, I think, one of the most powerful organisational concepts that has emerged from computer programming practice. With Git (or another modern SCM) engineers have superpowers for dealing with change management.

However, the long-suffering database doesn't seem to get as much love in the modern CI/CD pipeline. Certainly all sorts of useful things *can* be done, but usually they aren't. I've heard that traditional relational database skills are in decline - maybe that's the case. Definitely the 'DBA' role seems to be disappearing. Maybe it's just not as fashionable as the containerized and serveless technologies we've introduced in the application layer in the last decade, so people aren't talking about it, and aren't spending money on it internally. After NoSQL lost its shine, I'd joke that it feels like everyone just quietly started using PostgreSQL and stopped talking about it!

A flexible app - and definitely type of app that is designed for very different configurations for different users - is going to store a lot of configuration in the database. Additionally, there will be a lot of enumerations of types or dictionary data, for example localized text strings. I've heard this called the 'reference data' in [one of the blog posts](https://enterprisecraftsmanship.com/posts/database-versioning-best-practices/) I read on this topic, from Vladimir Khorikov. Configuration data that is different for each client instance, is actually a use case where I think NoSQL is a good idea, and there's a good argument that the configuration should be stored in a separate database to the application data.

I was first introduced to the idea of database versioning when I was writing an Android app. If you use an embedded SQLite database in your app, you were required to have a version number for it, and supply a migration functions between versions. I'm pretty sure this was enforced when you created the app package. Ruby On Rails also has a robust database migration system.

A good summary of database migration practices was in this old [Hacker News post](https://news.ycombinator.com/item?id=500496) from Jason Kester. To quote:

- every database has a build number stamped into it
- every schema change goes into a change script called e.g. `build_105-106.sql`
- changes are applied to the dev database as they are made
- the automated build pins the change script and runs it against an integration database
- a schema diff tool is used to compare dev and integration schemas.  if they don't match, the build breaks.
- the build creates a file called `build_106-107.sql` and sticks it into source control
- If you screw up and commit a change straight to dev without scripting out the change, it will break the next build and it will hurt to fix it. You'll learn quickly not to try to shortcut the process.

So yes the rough idea is the same as the old Android app SQLite databases. The database has a version number. You have to supply a migration script between versions. In an ideal world, your pipeline will apply the migration scripts to another test database, and validate that it matches the expected source of truth. We end up with a lovely, verified chain of diffs or deltas describing the changes to the database from the beginning, just like a version control log for source code.

There are further things that you can do though. The first one is extend the database version number, and keep an audit log of what migration scripts have been actually been run, in a table that records the script file name as well as the database version number. This gives you a more useful history.

Secondly, having idempotent database migration scripts is really good. This was a strong policy at MemNet. I used to grumble at having to wrangling those SQL 'IF' statements but it sure saved me a few times.

Thirdly (and this more of a philosophy) there's the idea to not bother with rollbacks. Don't change past migration scripts, don't attempt to rollback schemas on production. Forward is the only way out!

So, looking at the title again, it's clear I have feelings about this. It should be a high priority for the foundations of a new project, and probably a priority for an existing project if the speed of your feature factory is high. Once you lose track of what changes have and haven't been applied to a production database, it's a really horrible hole to be in. You start consuming huge amounts of time, as releases introduce bugs, and people frantically start doing schema diffs on backups and rewriting all those slapdash SQL scripts to be idempotent.

[Dont' think - know](http://thecodelesscode.com/case/131).