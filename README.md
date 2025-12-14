# Recipes

Go to ![https://alexdavey.github.io/recipes](https://alexdavey.github.io/Recipes).


## RECIPE FORMAT  
In order to show up properly, your recipe's Markdown file should be named with dashes in place of spaces (ex: `rice-pilaf.md` or `saag-paneer.md`). This will be used to populate your list of recipes on the main page.

Use `recipe-template.md` and/or follow this format:

```markdown
# TITLE
Optional subheader

## info  
* About XXX minutes  
* XXX servings  

## ingredients
* 

## steps  
1. 

## notes  
* 

## based on  
* url to where the recipe came from
```

For example:

```markdown
# Raspberry and Elderflower Gin and Tonic
A delicious light-red drink perfect for winter gatherings!

## ingredients
* 8 raspberries (frozen ok but should be thawed)  
* Fresh thyme (optional)  
* Gin  
* 1/2 lime  
* 1-2 tbsp St Germaine (or 1-2 tsp simple syrup)  

## steps
1. Muddle raspberries with 1.5 oz gin (and fresh thyme, if using)  
2. Add juice of half a lime  
3. Add 1-2 tbsp St Germaine (or 1-2 tsp simple syrup)  
4. Strain into glass, add ice cubes and top with tonic 

## notes
* Replace tonic with champagne for a *French 75* mashup   

## based on
* https://www.instagram.com/p/Bq3ckR8HIDE/
```

You can optionally include info about how long the recipe takes and how many servings it makes. Put this before the `Ingredients` list:  

```## info  
* Takes about 90 minutes  
* Enough for a large biryani or a full-sized curry
```

The `Ingredients` and `Steps` sections can be split with subheaders too:

```## steps
1. Soak urad dal for 4 hours to overnight, drain  
2. Grind in blender until a smooth and thick paste (add a little water if necessary)  
3. Put in mixing bowl and whip with hands for 2-3 minutes until fluffy  
4. Add spices, herbs, and salt and whip again to combine  

To fry:
1. Heat oil over medium/medium-high heat  
2. Take a bowl of water, wet hands, and form small balls  
3. Slide into oil and cook, flipping often, until golden  
4. Drain on paper towels  
```

## ADDING IMAGES  
If you have a `jpg` image with the same filename as your recipe, it will automatically be added. 

For example: `aloo-matar.md` should have an image called `aloo-matar.jpg` in the `images` folder.

You can also include other images in the recipe using Markdown's image syntax: `![alt text](url)`. You'll probably want to update the stylesheet to size them appropriately.


## OTHER OPTIONS  
* `lookForHeroImage`: on by default, but you can turn it off if you never intend to include hero images  
* `autoUrlSections`: list of sections in the recipe template where you want raw URLs (ex: www.instagram.com) to be turned into real links. Great for the `Based On` section but not so good if you want to include Markdown-formatted links in other sections  
* `shortenUrls`: turns a super-long url into just the main domain name (link will still work as normal, just less cluttered). Off by default but exists if you want it
