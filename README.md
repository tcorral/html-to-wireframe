# html-to-wireframe

A lightweight tool to generate wireframes from local or remote HTML files. This tool creates visual wireframes similar to Facebook's loading skeleton screens, allowing users to see the structure of your app before the full page loads.

![HTML to Wireframe](assets/html-to-wireframe.png)

## Features

- Generate wireframe screenshots for multiple device viewport sizes
- Support for both portrait and landscape orientations
- Process multiple URLs in a single command
- Modern browser automation using Playwright

## Dependencies

This tool relies on:
- [Wirify Bookmarklet](http://www.wirify.com/) - For wireframe generation
- [Playwright](https://playwright.dev/) - Modern browser automation (replacement for deprecated PhantomJS/CasperJS)
- [Viewportsizes.com](http://viewportsizes.com) - Device viewport database

The tool will generate a PNG image for each viewport size defined in `lib/viewports/index.js`, creating both portrait and landscape orientations for each device.

## Installation

### Prerequisites

- Node.js >= 16.0.0
- npm >= 7.0.0

### Setup

1. Clone the repository:
```bash
git clone https://github.com/tcorral/html-to-wireframe.git
cd html-to-wireframe
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install chromium
```

## Usage

The tool is simple to use. Just run the following command with your target URLs:

```bash
npm start -- --urls="https://example.com,https://another-site.com"
```

### Options

- `--urls`: Comma-separated list of URLs to process (required)
- Multiple URLs will be processed sequentially
- Screenshots are saved in the `screenshots/` directory
- Each URL gets its own subdirectory with device-specific screenshots

### Output

For each URL, the tool generates:
- Wireframe screenshots for multiple device viewports
- Both portrait and landscape orientations
- PNG images organized by device name and dimensions

Example output structure:
```
screenshots/
└── example.com/
    ├── iPhone-12-390x844.png
    ├── iPhone-12-844x390.png
    ├── iPad-Air-820x1180.png
    └── iPad-Air-1180x820.png
```

## Recent Changes

### v2.0.0 (2025)
- **Modernized browser automation**: Replaced deprecated PhantomJS/CasperJS with Playwright
- **Fixed argument parsing**: Resolved npm config environment variable issues
- **Updated dependencies**: Compatible with modern Node.js versions (16+)
- **Improved stability**: Better error handling and browser lifecycle management
- **Maintained functionality**: All original wireframe generation features preserved

## Contributing

This tool has been modernized to use current browser automation technology. Future enhancements could include:

- [ ] Convert to a proper CLI tool with better argument parsing
- [ ] Publish as an npm package for global installation
- [ ] Add configuration options for:
  - Custom output directory
  - Select specific viewports/devices
  - Custom filename prefixes
  - Image format options (PNG, JPEG, etc.)
- [ ] Add support for local HTML files
- [ ] Improve error handling and logging
- [ ] Add progress indicators for long-running operations

## License

MIT - See LICENSE file for details
