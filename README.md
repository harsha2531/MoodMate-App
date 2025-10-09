# 😊 MoodMate – Your Personal Daily Journal & Mood Tracker  

> A React Native + Expo mobile app built with TypeScript, Firebase, and NativeWind (Tailwind CSS for React Native).  
> MoodMate helps users record their daily moods, write journal entries, and view emotional trends — promoting mindfulness and emotional awareness.  

---

## 🎥 Demo Video  
👉 [Watch the video](https://drive.google.com/file/d/1oz_idZd_iIHNhQs9CyY6tuPEsIphjWwK/view?usp=sharing)  

## 📱 Download APK  
📦 [Download MoodMate APK](https://expo.dev/accounts/harsha2631/)  

---

## 🚀 Features  

### 👤 Authentication  
- Firebase Email & Password login  
- Role-based access: `Admin` 👑 & `User` 🙋‍♂️  
- Persistent user session  

### 📝 Journal Management (CRUD)  
- Create, Read, Update, Delete daily mood entries  
- Select mood emoji (😊 😢 😡 😌)  
- Write daily thoughts and attach an optional image  

### 📊 Mood Insights  
- Weekly mood statistics  
- Identify emotional trends  

### 🧑‍💼 Admin Role  
- Manage all users  
- View and delete user journal entries  

### 💅 Modern UI  
- Clean minimal design using **NativeWind (Tailwind CSS)**  
- Gradient headers and calm color palette  
- Smooth navigation with **Expo Router**

---

## 🧠 Tech Stack  

| Layer | Technology |
|-------|-------------|
| **Frontend** | React Native (Expo) + TypeScript |
| **Styling** | NativeWind (Tailwind CSS for React Native) |
| **Navigation** | Expo Router |
| **Backend** | Firebase Authentication + Firestore |
| **Icons** | Expo Vector Icons (Ionicons) |
| **Gradients** | Expo Linear Gradient |

---

## 📂 Folder Structure  

```
MoodMate/
├── app/                    # Expo Router app directory
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx      # Dashboard/Home screen
│   │   ├── profile.tsx    # User profile
│   │   ├── admin.tsx      # Admin dashboard
│   │   └── _layout.tsx    # Tab layout
│   ├── login.tsx          # Login screen
│   ├── register.tsx       # Registration screen
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── MoodSelector.tsx   # Mood selection component
│   └── JournalCard.tsx    # Journal entry card
├── context/               # React Context
│   └── AuthContext.tsx    # Authentication context
├── services/              # Business logic
│   ├── authService.ts     # Authentication services
│   └── journalService.ts  # Journal CRUD operations
├── types/                 # TypeScript definitions
├── firebase.ts            # Firebase configuration
├── global.css             # NativeWind global styles
├── tailwind.config.js     # Tailwind configuration
├── metro.config.js        # Metro bundler config
└── package.json           # Dependencies and scripts
```

---

## ⚙️ Installation Guide  

### 1️⃣ Clone Repository  
```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/MoodMate.git
cd MoodMate
```

### 2️⃣ Install Dependencies  
```bash
npm install
```

### 3️⃣ Configure Firebase  
Edit `firebase.ts` and paste your Firebase credentials:
```ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MSG_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

### 4️⃣ Run the App  
```bash
npx expo start
```

---

## 👑 Role Management  

| Role | Permissions |
|------|--------------|
| **User** | Create / View / Update / Delete their own journal entries |
| **Admin** | Manage users, view & delete any entry |

🛠 To promote a user to Admin:  
In **Firestore → users → {userId}**, set:
```json
"role": "Admin"
```

---

## 🔐 Firestore Rules (Example)
```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /entries/{entryId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

---

## 🖼️ Screenshots  

| Login | Home | Journal | Profile |
|-------|------|----------|----------|
| ![Login](assets/screens/login.png) | ![Home](assets/screens/home.png) | ![Journal](assets/screens/journal.png) | ![Profile](assets/screens/profile.png) |

---

## 🤝 Contributing  

1. Fork the repository  
2. Create a new branch:  
   ```bash
   git checkout -b feature/my-feature
   ```  
3. Commit your changes:  
   ```bash
   git commit -m "Add my feature"
   ```  
4. Push and create a Pull Request 🎉  

---

## 📬 Contact  

👨‍💻 **Developer:** Harsha Nimeda  
📧 Email: harshanimeda@gmail.com  
🌐 GitHub: [@HarshaNimeda](https://github.com/YOUR_GITHUB_USERNAME)

---

## 🧾 License  

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

> “MoodMate helps you understand your emotions, one entry at a time.” 💙
