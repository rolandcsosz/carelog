# Activity Log App - Frontend

## Local dev setup

1. Clone the repository
1. Open frontend directory by running `cd frontend`
1. Run `npm install`
1. Setup backend url in `src/env.ts` file. By default, it is set to `http://localhost:8080`. You can change it to your backend url.
1. Run `npm run dev` to start the app in development mode.
1. Open your browser and go to `http://localhost:5173/` to see the app in action.
1. Hot reloading is enabled, so any changes you make to the code will be reflected in the browser without needing to refresh the page.

## Running the app in docker

1. Clone the repository
1. Open the frontend directory.
1. In docker-compose.yml file, set the BACKEND_URL in the environment section to your backend url.
1. Run `docker-compose up -d` to start the app in docker.
1. Open your browser and go to `http://localhost/` to see the app in action.

## Building IOS app

1. Clone the repository
1. Open frontend directory by running `cd frontend`
1. Run `npm install`
1. Run `npm run generate:ios` to build the ios source code.
1. Open the ios/ directory in Xcode.
1. In Xcode, select the target device and click on the play button to run the app on the device or simulator.
1. If you want to build the app for release, select the Generic iOS Device as the target device and then go to Product > Archive. This will create an archive of the app that you can distribute to the App Store or to your testers.

## Building android app

1. Clone the repository
1. Open frontend directory by running `cd frontend`
1. Run `npm install`
1. Run `npm run generate:android` to build the android source code.
1. Set  `ANDROID_HOME` environment variable to your android sdk path. Usually it is *C:\Users\user\AppData\Local\Android\Sdk* on windows after installing android studio.
1. In the android/ directory, run `./gradlew assembleRelease` to build the app.
1. The release apk will be generated in the *android/app/build/outputs/apk/release/* directory. The file name will be `app-release-unsigned.apk`. It is unsigned, so you need to sign it before distributing it because android does not allow unsigned apks to be installed on devices. To sign the apk, you need to modify the `build.gradle` file in the android/app/ directory and then run the `./gradlew assembleRelease` command again. You can find the instructions to sign the apk: [https://developer.android.com/studio/publish/app](https://developer.android.com/studio/publish/app).

## Known issues

- [ ]  Transition on navigation is not smooth on desktop view. `useNavigation.ts` change requered. Low priority issue. ⬇️

## Parts to improve

- [ ]  Add tests for components and pages. High priority issue. ⬆️
- [ ]  Merge useAdminModel and useUserModel into a single hook. Medium priority issue. ⬆️