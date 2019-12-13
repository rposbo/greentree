# greentree
Treemap to identify CO2 and energy usage a web page via a WebPageTest result

Using a WebPageTest result, the GreenWebFoundation API, and calculations from Carbon Website, display a treemap visualisation, per host of:

1. Bytes per request
2. Energy used serving each request (Watt Hours)
3. CO2 generated for each request (grams and also litres)

The blocks are grey if the host uses non-renewable energy and green if it uses a renewable energy source.

## Client Side

https://rposbo.github.io/greentree

There's a single page with all the logic inside; just paste in a WPT test ID and hit GO! The dots and dashes are calls to GreenWebFoundation API to see if the host is using renewable energy; dashes are when the call failed (probably blocked) by the browser thinking it's an advert ping.

## Server Side

The rest of the repo is the nodejs version of this, so you can hook it into a pipeline and generate static reports if you wanted to.
