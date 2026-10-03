# Thandavapura Transit Tracker

Agent











"Develope a college bus tracking application. The app opens with an animated logo of 'MIT Thandavapura' in orange against a black background, with 'Thandavapura' displayed in white underneath.







Access is for authorized college personnel only. Standard users login using their unique USN, starting specifically with '4MN', and must enter a matching 4-digit OTP via the linked phone number for secure access. Initial login can be done via Google.







The app must include separate tabs for 'Travel', 'College Updates', 'Calendars', 'Time Table', 'Issues', and 'Exam Time Table'. Clicking each tab should reveal only relevant details.







The 'Travel' tab features a search bar for bus or route number. After searching, it displays real-time tracking on a map, distance left, ETA compared to the user's current location, voice messaging and direct driver call to the driver.







Administration has exclusive access to upload and update content for 'College Updates', 'Calendars', 'Time Table', and 'Exam Time Table'. These sections must be structured by year and branch. Admins will have a '+' icon to upload photos, PDFs, or other documents. Students are restricted from uploading here.







All users can post problems in an 'Issues' block.







Access to secure GPS settings within the app is secured by biometric authentication, supporting up to five unique biometric IDs, accessible only to you.







Teachers have separate dedicated login employing biometric and unique IDs; adding new teachers requires specific biometric approval from you.







Your prompt should provide clear descriptions of these blocks and their functionalities and adhere to a standard format.

Build a web app dashboard with a secure login page. The login should authenticate users using biometrics (fingerprint or Face ID) or a One-Time Password via email. Once logged in, display a private dashboard where the user can enter a unique GPS ID to connect to a specific transit bus tracker. The dashboard should only show the real-time location, distance, and estimated arrival time for that connected bus on a map. Ensure that the user can also disconnect and manage these connected buses, and that no other user can access their dashboard without proper authentication."

Add real-time bus position updates on the map (polling or WebSocket) so bus markers move smoothly and ETA recalculates automatically.

Add a stop-near notification that alerts me when the tracked bus is within a configurable distance of my stop.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/80caf721-f5b4-4415-b1b5-ab75f7d0db67).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
