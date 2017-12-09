#!/usr/bin/env bash

export STORE_FILE="$HOME/.android/debug.keystore"
export STORE_PASSWORD="android"
export KEY_ALIAS="AndroidDebugKey"
export KEY_PASSWORD="android"

./gradlew --no-daemon app:assembleRelease
