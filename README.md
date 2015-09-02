# url-to-wireframe
url-to-wireframe was created as a easy-to-use tool to generate wireframes from local or remote html files to do 
something like Facebook does so that the user can see the structure of your app before load the whole page.

This tool uses [Wirify Bookmarklet|http://www.wirify.com/] to do almost all the job but it also relays in:
* [PhantomJS|https://www.npmjs.com/package/phantomjs]
* [CasperJS|https://www.npmjs.com/package/casperjs]

To fetch all the viewport sizes available it also uses the JSON version of the database that you can find in 
[viewportsizes.com|http://viewportsizes.com]

The tool will generate a png image per each viewport size in 'lib/viewports/index.js' file in portrait and landscape 
so you will get two images per device.

## Installation

### Git

```bash
$ git clone https://github.com/tcorral/url-to-wireframe.git
```

### Node 

Dependencies:

* node >= 0.10
* npm >= 2.0.0

```bash
$ cd url-to-wireframe
$ npm install
```

## Usage
The usage is very simple, url-to-wireframe uses npm to running it, just execute the following code and wait to get 
your wireframes in the screenshots folder.

```bash
npm start --urls=http://url.com,http://other-url.com
```


