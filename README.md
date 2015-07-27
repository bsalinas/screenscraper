# ScreenScraper
ScreenScraper is an extension for Google Chrome which allows you to easily scrape data from websites. Download it in the [Google Chrome Web Store](https://chrome.google.com/webstore/detail/screenscraper/pfegffhjcgkneoemnlniggnhkfioidjg)

##Usage
Let's say you have a website with:
```
<div class="foo">
   <span class="name">Joe</span>
   <span class="city">Seattle</span>
   <img src="profilepic.png"></img>
</div>
<div class="foo">
   <span class="name">Jean</span>
   <span class="city">Austin</span>
   <img src="profilepic_i.png"></img>
</div>
<div class="foo">
   <span class="name">Ben</span>
   <span class="city">Boston</span>
   <img src="profilepic_asbfdsi.png"></img>
</div>
```
In the top `selector` input box, type in `.foo` to select all of the elements of class `foo`. Then, add columns for `.name`, `.city`. and the `src` attribute of `img`.

This will make a row in your output data for each `.foo` on the page and select the `name`, `city`, and image `src` for each of those.

Under the hood, this uses jQuery, so you can use any selector supported there.

##Improvements
Here's some things that should happen

* Better documentation
* Ability to select attributes on the parent element. Right now, if I want to select all the `.foo` on a page and want to grab an attribute for that, I can't.
* (Bug) The attribute input field disappears when the popup closes. It still will select that attribute, it just doesn't show you the input field.

Pull requests welcome.