---
title: ".NET 6 with top-to-bottom async C#"
date: 2022-03-29T12:18:31+11:00
draft: false
---
Recently I started a new project with all the latest .NET shiny bits. Visual Studio 2022, .NET 6, Dapper as the object mapper and every damn function from top to bottom marked as ```async```. It absolutely *flies* and the performance goes down great in demos. Razor is a perfectly fine templating system, the dependency injection mostly just works, and I even appreciate the '$' string interpolation. I have to say productivity with a basic server-rendered app has been noticeably higher than trying to iterate an full Angular SPA and backend API with a small team. I did have to relearn a few old school HTML form tricks for one feature though.

Nullable types are expected to be explicitly declared and are checked much more strictly, which can be annoying, but is probably good for me.

The ```Task``` primitives give you ways to do all sorts of risky premature optimization, like starting a task for every item on a list and waiting for them all to finish and rejoin the original thread.

```
private async Task<Payment> checkCustomerStatus(Payment p)
{
	// ...
}

IEnumerable<Task<Payment>> updateTasks = inputArg.Payments.Select(p => checkCustomerForPayment(p));
result.Payments = await Task.WhenAll(updateTasks);
```

I heard that a lot of the Microsoft people from the legendary *Midori* project went on to work on .NET. Whether that's true or not, they've been doing great work.