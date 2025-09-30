
📄 `README.md`

```markdown
# 📍 Location-Based Coupon Claim Page

This project is a simple **location-based coupon claiming webpage**.  
Users must **enable their browser location access** in order to claim coupons.  
The webpage will prompt the user to allow location permissions, and based on their location, a coupon is displayed.

---

## 🚀 Features
- Responsive **mobile-first design**.
- **Location access** request using the browser's Geolocation API.
- If the user denies or blocks location, a helpful card is shown explaining how to enable it.
- Simple and clean UI with **HTML + CSS + JavaScript (Vanilla)**.
- Backend-ready (Node/Express or any server) for hosting on local LAN or internet.

---

## 📂 Project Structure
```

Location_tracker/
│── index.html       # Main HTML page
│── style.css        # CSS styles (mobile-first design)
│── script.js        # JavaScript logic (geolocation + coupon handling)
│── server.js        # Express server to host the page locally (optional)
│── README.md        # Documentation
│── .env             # Environment variables (if needed for backend)

````

---

## 🛠️ Setup & Run

### 1. Clone or Download
```bash
git clone https://github.com/your-repo/location-tracker.git
cd location-tracker
````

### 2. Install Dependencies (if using Node backend)

```bash
npm install express dotenv
```

### 3. Start Local Server

```bash
node server.js
```

By default, the page will run at:

```
http://localhost:5000
```

To access from another device on the same network, replace `localhost` with your LAN IP:

```
http://192.168.x.x:5000
```

⚠️ **Note**:
Geolocation API requires a **secure context** (`https://` or `http://localhost`).
For LAN access, Chrome/Edge usually allow `http://192.168.x.x`, but for internet deployment, you’ll need HTTPS.

---

## 📱 Usage

1. Open the page in a browser.
2. Click **"Claim Now"**.
3. The browser will show a popup:
   *"This site wants to know your location. Allow / Block"*
4. If **Allowed**, location is captured → Coupon generated.
5. If **Blocked**, a card will appear explaining how to enable location in browser settings.

---

## 🔐 Troubleshooting

* If the **popup doesn’t appear**, make sure:

  * You are not serving the page via `file://` (use a server).
  * You have not previously **blocked location** for this site.
  * You are testing in a modern browser (Chrome, Edge, Safari, Firefox).

---

## 📜 License

MIT License – free to use and modify.

```

---

Do you want me to also prepare the **exact `server.js` file** content that matches this README so you can copy–paste and run it right away?
```
