<div align="center">

<h1>chameleon-ultra.js</h1>

<p>A JavaScript SDK for ChameleonUltra using Web Bluetooth, Web Serial and SerialPort.</p>

[API Reference](https://taichunmin.idv.tw/chameleon-ultra.js/docs/) | [Demos](pages/demos.md)

[![npm version](https://img.shields.io/npm/v/chameleon-ultra.js.svg?logo=npm)](https://www.npmjs.org/package/chameleon-ultra.js)
[![jsdelivr hits](https://img.shields.io/jsdelivr/npm/hm/chameleon-ultra.js?logo=jsdelivr)](https://www.jsdelivr.com/package/npm/chameleon-ultra.js)
[![Build status](https://img.shields.io/github/actions/workflow/status/taichunmin/chameleon-ultra.js/ci.yml?branch=master)](https://github.com/taichunmin/chameleon-ultra.js/actions/workflows/ci.yml)
[![code coverage](https://img.shields.io/coverallsCoverage/github/taichunmin/chameleon-ultra.js)](https://coveralls.io/github/taichunmin/chameleon-ultra.js)
[![install size](https://img.shields.io/badge/dynamic/json?url=https://packagephobia.com/v2/api.json?p=chameleon-ultra.js&query=$.install.pretty&label=install%20size)](https://packagephobia.now.sh/result?p=chameleon-ultra.js)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/chameleon-ultra.js)](https://bundlephobia.com/package/chameleon-ultra.js@latest)
[![npm downloads](https://img.shields.io/npm/dm/chameleon-ultra.js.svg)](https://npm-stat.com/charts.html?package=chameleon-ultra.js)
[![GitHub contributors](https://img.shields.io/github/contributors/taichunmin/chameleon-ultra.js)](https://github.com/taichunmin/chameleon-ultra.js/graphs/contributors)
[![Known Vulnerabilities](https://snyk.io/test/npm/chameleon-ultra.js/badge.svg)](https://snyk.io/test/npm/chameleon-ultra.js)

</div>

## Browser & OS compatibility

### SerialPort (Node.js)

[Node SerialPort](https://serialport.io/docs/) is a JavaScript library for connecting to serial ports that works in NodeJS and Electron.

### Web Bluetooth API

A subset of the Web Bluetooth API is available in ChromeOS, Chrome for Android 6.0, Mac (Chrome 56) and Windows 10 (Chrome 70). See MDN's [Browser compatibility](https://developer.mozilla.org/docs/Web/API/Web_Bluetooth_API#Browser_compatibility) table for more information.

For Linux and earlier versions of Windows, enable the `#experimental-web-platform-features` flag in `about://flags`.

### Web Serial API

The Web Serial API is available on all desktop platforms (ChromeOS, Linux, macOS, and Windows) in Chrome 89. See MDN's [Browser compatibility](https://developer.mozilla.org/docs/Web/API/Serial#browser_compatibility) table for more information.

### Web Serial API Polyfill

On Android, support for USB-based serial ports is possible using the WebUSB API and the [Serial API polyfill](https://github.com/google/web-serial-polyfill). This polyfill is limited to hardware and platforms where the device is accessible via the WebUSB API because it has not been claimed by a built-in device driver.

## Installing

### Package manager

Using npm:

```bash
$ npm install chameleon-ultra.js

# Also install SerialPort if you want to run in node.js
$ npm install serialport
```

Using yarn:

```bash
$ yarn add chameleon-ultra.js

# Also install SerialPort if you want to run in node.js
$ yarn add serialport
```

Once the package is installed, you can import the library using `import` or `require`:

```js
// import
import { Buffer, ChameleonUltra } from 'chameleon-ultra.js'
import WebbleAdapter from 'chameleon-ultra.js/plugin/WebbleAdapter'
import WebserialAdapter from 'chameleon-ultra.js/plugin/WebserialAdapter'
import SerialPortAdapter from 'chameleon-ultra.js/plugin/SerialPortAdapter'

// require
const { Buffer, ChameleonUltra } = require('chameleon-ultra.js')
const WebbleAdapter = require('chameleon-ultra.js/plugin/WebbleAdapter')
const WebserialAdapter = require('chameleon-ultra.js/plugin/WebserialAdapter')
const SerialPortAdapter = require('chameleon-ultra.js/plugin/SerialPortAdapter')
```

### CDN

Using jsDelivr CDN:

```html
<!-- chameleon-ultra.js require lodash@4, place before any chameleon-ultra libraries -->
<script src="https://cdn.jsdelivr.net/npm/lodash@4/lodash.min.js"></script>

<!-- chameleon-ultra.js Core -->
<script src="https://cdn.jsdelivr.net/npm/chameleon-ultra.js@0/dist/iife/index.min.js"></script>
<!-- chameleon-ultra.js Crypto1 -->
<script src="https://cdn.jsdelivr.net/npm/chameleon-ultra.js@0/dist/iife/Crypto1.min.js"></script>
<!-- chameleon-ultra.js WebbleAdapter plugin -->
<script src="https://cdn.jsdelivr.net/npm/chameleon-ultra.js@0/dist/iife/plugin/WebbleAdapter.min.js"></script>
<!-- chameleon-ultra.js WebserialAdapter plugin -->
<script src="https://cdn.jsdelivr.net/npm/chameleon-ultra.js@0/dist/iife/plugin/WebserialAdapter.min.js"></script>
```

After the `script` tag, you can use the `chameleon-ultra.js` as following:

```js
const { Buffer, ChameleonUltra, WebbleAdapter, WebserialAdapter } = window.ChameleonUltraJS

const ultraUsb = new ChameleonUltra(true)
ultraUsb.use(new WebserialAdapter())
const ultraBle = new ChameleonUltra(true)
ultraBle.use(new WebbleAdapter())
```

## Getting Started

TBD
