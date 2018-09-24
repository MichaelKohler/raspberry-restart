# Raspberry Restart

As my Raspberry is running quite some stuff, I want to restart it when it goes down. This is done with this script and a MyStrom switch. Feel free to adapt it to your needs but as it's quite specific to my use case, I'll make changes that might not be in your interest.

This currently requires the Raspberry to be reachable and giving back a 200 HTTP code on *some* endpoint.

## Installation

```
$ npm install
```

Then copy the sample config file and adjust the values to match your setup:

```
$ cp config.sample.json config.json
```

## Usage

```
$ npm start
```
