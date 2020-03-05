#!/bin/bash

cd android && ./gradlew clean && cd ../
rm -rf /tmp/metro-cache*
rm -rf node_modules
rm -rf android/app/build
watchman watch-del-all
yarn cache clean
