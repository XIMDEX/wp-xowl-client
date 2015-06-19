# Xowl Service client for WordPress

This WordPress plugin adds to your default editor (TinyMCE) the ability to detect **semantic entities** on your post content and link them to their official wikipedia page for further reading.

## Installing instructions
This plugin works with the latest version of Wordpress (v4.2.2)

You can directly download the source code on its first release [here](https://github.com/XIMDEX/wp-xowl-client/releases/tag/0.1). Install it as any WordPress plugin, that is, unzip it on the _wp-content/plugins_ folder and WordPress itself should recognize it as plugin from its user interface.

You will have to request us an API-Key in our registration page in order to use it. The URL of this register page is provided by the module itself. Once the token has been validated, we can enrich our posts with references to a several semantic entities. 

You will find a new icon on your editor's toolbar like this:

![Tag icon](/assets/imgs/screenshots/tag_icon.png)

By clicking on this icon the plugin will send your content to our **Xowl Service's API** and will add entities of different types (rendered with different colors) depending on its type. If there are multiple references to a single entity, we can **disambiguate** choosing the proper one that best suits with our context.

When you save and publish the post, the entities will be translated into their links to their **official wikipedia pages** where the visitor could find more useful information about each of them.

## Screenshots

For example, enhancing some post about **Radiohead**:
![Enhancing your post content ](/assets/imgs/screenshots/enhancement01.png)

And selecting the proper entity for the entity **United Kingdom**:
![Selecting the proper entity ](/assets/imgs/screenshots/enhancement02.png)

Finally, your published post looks like something like this:
![Published post ](/assets/imgs/screenshots/enhancement03.png)
