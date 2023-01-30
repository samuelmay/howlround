---
title: "IIS Websites with a Site ID of 0"
date: 2022-11-25T16:51:51+11:00
draft: false
---
**tl;dr if you create a website with a site ID of 0 in IIS, it will break the site**

Recently I lost *far too much of my life* discovering why a change broke one of our ASP.NET websites. 

We were in the process of migrating to a new CI/CD pipeline, and had successfully tested it in both a development and in a mock production environment. All looked good, so we went ahead and deployed to the production server (This was a blue/green deployment, so the previous version was running happily on a different server the whole time). A temporary subdomain was pointed at the new production release and we went to start some final testing.

Unfortunately, all we got was a 500 internal server error, no matter what we tried! Even the extremely basic aspx page that was used as a health check would not load, which additionally meant that the health check never passed, and the deployment always failed.

Any inspection of logs, tracing, or Windows Event log did not produce an informative error message. The Windows event log showed a message like:

`An application has reported as being unhealthy. The worker process will now request a recycle. Reason given: ASP.NET application initialization failed.. The data is the error.`

Along with a hexadecimal error code `0x80070057`. The stacktrace could only show the location as “AspNetApplicationInitializationFailureModule”.

The issue was especially confusing, as the exact same build of the code was working perfectly on the same server images in two other environments. The ops team repeatedly confirmed that the server setups were identical, and the product team repeatedly confirmed that the code build version was also identical.

Many things were checked and tried:

- doesn't seem to be the database connection string (database configuration files from the working production environemnt deployment were copied, and it didn't work)
- doesn't seem to be web.config (the web.config from working live production deployment was copy-pasted and it didn't work)
- doesn't seem to be missing or corrupted files in deployment (in a fit of desperation, the whole inetpub folder from a working deployment was zipped, uploaded and copy-pasted)
- Didn't seem to be .NET framework installed version
- no issues in Server Management installed features from what we could see
- IIS tracing didn't show anything useful
- no other logs were showing anything useful.
- Creating a different test website on the server (this worked!)
- Remote debugging with Visual Studio (did not work)
- Local debugging with Visual Studio including installing Visual Studio on the server (did not work, the exception could not be caught)

## A False Clue

One test was upgrading the .NET Framework version of site, manually deploying the build to the server, and testing if that worked. It did!

I assumed that the .NET Framework version was the issue. did a new branch, commit, and build, and redeployed the site. However, that deployment also failed.

## A Real Clue

It was then realised that it was not the .NET Framework upgrade that caused the site to work, it was the manual deployment.

Further testing confirmed that manually running the deployment script commands would result in the site not working, however, creating the site using the mouse and GUI using IIS Manager would result in the site working fine.

Both of these scenarios were run, and the resulting `C:\Windows\System32\inetsrv\config\applicationHost.config` files were saved and compared with diff tool. There were 4 differences, after testing each difference, it was determined that **if the website is created with an IIS site ID of 0 it does not work, but if the website is created with an IIS site ID of 1, it does work.**

## Explanation

The deployment script was using the environment number as the site ID. E.g. the development environment had an environment ID of 20, so the site ID was passed in an argument as ‘20’. In the mock production environment, the environment ID was 10 ... and in production, the environment ID was ‘0’.

## Conclusion

Ultimately, I would *like* to blame Microsoft and IIS, for not giving a readable error description, and for allowing a site to be created with an invalid ID with `appcmd`. There is also no documentation to be found about this issue or about IIS site IDs. This might have been one of the first issues in my career for which there truly seemed to be *absolutely nothing* to be found online about it.

For our side, I think the fact that the failure was specific to the environment, should have caused us to look more closely at the environment parameters in the deployment scripts. At OneStop, because there is a very old and baked-in convention of using “0” as production environment ID, there is the potential for names or IDs to be set to “0” which may cause strange issues like this.

Thanks to all of my colleagues who helped with this issue.
