## React native + Spring boot qr code login

> :warning:  If you see "mime type not found" reload this page, it brokes sometimes

https://user-images.githubusercontent.com/52082794/225158202-0159274c-f8ca-457d-8085-cf379022afeb.mp4

### About
As the name suggests this project is a QR code based login application, this feature is just as the one you'd see on popular apps such as Telegram, Whatsapp, Discord and others. This one is made of the 3 following projects:

- [Scanner](https://github.com/Glazzes/rn-spring-qr-login/tree/main/scanner) is a react native mobile app that allows you to create user accounts, login with email/password or login by scanning codes
- [Web](https://github.com/Glazzes/rn-spring-qr-login/tree/main/qr-web) is a react native web based app that allows users to login by email/password or login by scanning a qr code with [Scanner](https://github.com/Glazzes/rn-spring-qr-login/tree/main/scanner)
- [Backend](https://github.com/Glazzes/rn-spring-qr-login/tree/main/qr-backend) is a spring boot based backend with a custom authentication flow, this one is built with the building blocks provided by spring security's architecture

### Observations
All animations have been created manually, that includes the scrollable bottom sheet and image cropper.

### Technologies used
- Spring boot (Kotlin)
- React native / React native web
- Redis
- Docker
- Oracle cloud

### Try it out live!
You can find the website at this url http://140.238.187.124/login, for the app, you can download the apk at the root of this repository or just [click here](https://github.com/Glazzes/rn-spring-qr-login/raw/main/app-release.apk) (I do not own a domain, neither access to a play store account, sorry for the inconvinience)

### How does it works?

On the browser it makes use of browser's [EventSource](https://developer.mozilla.org/es/docs/Web/API/EventSource) class in order to have unidirectional events beetwen the server and the browser.

On the server we keep reference to each [EventSource](https://developer.mozilla.org/es/docs/Web/API/EventSource) with the [SSEmitter](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/servlet/mvc/method/annotation/SseEmitter.html) class, so wen can send events to each particular source

On the mobile app we scan the qr-code which has missing entries that will be fullfiled by the mobie app, once fullfiled we saved this code to the backend, once saved, we'll send the missing entries to the browser via event source events, so both the backend and the browser have the same qr-code, at this point the user can now login by sending the qr-code to the backend, if a code with the same entries is found it's considered to be a successful login.

There're some things to keep in mind:

- A new qr code is autogenerated every 5 minutes if no action has been taken
- A qr code without missing entries will be rejected by the mobile app
- The missing entries are unique ids, one randomly generated by the mobile app and the other refers to the user id, when saving the code on the browser both user ids must match to be considered a valid qr code
- Qr codes are redish hashes with life time of 5 minutes
- Reloading the page as expected will create a new event source therefore a new code

### Build

For a local testing environment set up, run the following command:
```bash
docker compose -f docker-compose-local.yaml up -d
```

You should find the apps at the following ports:
- Web at `3000`
- Backend at `8080`
- Redis at `6379`

Scanner app must be built by yourself, you must have the following programs already set up in your machine:
- [Java 17](https://docs.aws.amazon.com/corretto/latest/corretto-17-ug/downloads-list.html)
- [NodeJs](https://nodejs.org/en/)
- [A react native enviroment already set up](https://reactnative.dev/docs/environment-setup)

With all of the previous stuff done, change the host on [this file](https://github.com/Glazzes/rn-spring-qr-login/blob/main/scanner/.env.production) for the ipv4 ip address of your computer, for instance change `localhost` to `192.168.100.32`, then run the following command inside scanner folder:
```bash
cd android && ./gradlew assembleRelease
```
Once the build has completed you will find the release apk in the following directory:
```bash
[path to repo]/scanner/android/app/build/outputs/apk/release
```
