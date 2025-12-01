# html-to-wireframe
html-to-wireframe was created as a easy-to-use tool to generate wireframes from local or remote html files to do 
something like Facebook does so that the user can see the structure of your app before load the whole page.

This tool relays on:
* Wirify Bookmarklet -> http://www.wirify.com/
* PhantomJS -> https://www.npmjs.com/package/phantomjs
* CasperJS -> https://www.npmjs.com/package/casperjs

To fetch all the viewport sizes available it also uses the JSON version of the database that you can find in:
* Viewportsizes.com -> http://viewportsizes.com

The tool will generate a png image per each viewport size in 'lib/viewports/index.js' file in portrait and landscape 
so you will get two images per device.

## Installation

### Git

```bash
$ git clone https://github.com/tcorral/html-to-wireframe.git
```

### Node 

Dependencies:

* node >= 0.10
* npm >= 2.0.0

```bash
$ cd html-to-wireframe
$ npm install
```

## Usage
The usage is very simple, html-to-wireframe uses npm to running it, just execute the following code and wait to get 
your wireframes in the screenshots folder.

```bash
$ npm start -- --urls="http://url.com,http://other-url.com"
```

## Todo
* Convert this tool to a command line tool
* Convert this tool to be a npm module.
* Add arguments to:
** Only get a set of viewports
** Change the path to save the images.
** Change the name or prefix the image files.
