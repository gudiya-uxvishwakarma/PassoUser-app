# Backend Integration - Hindi Guide

## ✅ Kya Kiya Gaya Hai

UserApp ko Passo Backend se successfully connect kar diya gaya hai.

## 🚀 Kaise Chalayein

### Step 1: Axios Install Karein
```bash
cd UserApp
npm install axios
```

### Step 2: Backend Start Karein
```bash
cd Passo_backend
npm start
```

Backend `http://localhost:5000` par chalega

### Step 3: App Start Karein
```bash
cd UserApp
npm start
npm run android
```

## 📱 Kya Features Add Hue

### 1. Categories Backend Se Aati Hain
- HomeScreen par categories backend se fetch hoti hain
- Real categories with worker count

### 2. Workers Backend Se Aate Hain
- Featured workers backend se aate hain
- Verified workers filter
- Search functionality
- Category-wise filtering

### 3. API Services Ready Hain
- Category Service
- Worker Service  
- Notification Service
- Authentication Service (OTP)

## 📁 Naye Files

### Services (src/services/)
- `api.service.js` - Main API client
- `category.service.js` - Categories ke liye
- `worker.service.js` - Workers ke liye
- `notification.service.js` - Notifications ke liye
- `index.js` - Sab services export

### Config (src/config/)
- `api.js` - API URLs aur endpoints

## 🔧 Updated Screens

### HomeScreen
- Backend se data fetch hota hai
- Loading state dikhta hai
- Real categories aur workers

### WorkerDiscoveryScreen
- Backend se workers fetch hote hain
- Filters work karte hain
- Search functionality

## 🌐 API URLs

### Production (Default - Render)
```
https://passo-backend.onrender.com/api
```
**App ab yahi use karega by default**

### Development (Optional - Local Testing)
```
http://10.0.2.2:5000/api  (Android Emulator)
http://localhost:5000/api  (iOS Simulator)
```

**Note**: Local testing ke liye `src/config/api.js` mein BASE_URL change karein:
```javascript
export const BASE_URL = API_CONFIG.LOCAL; // ya API_CONFIG.EMULATOR
```

## 📊 Backend Endpoints

### Categories
- `GET /api/categories` - Sab categories
- `GET /api/categories/:id` - Ek category

### Workers
- `GET /api/workers/public` - Sab workers
- `GET /api/workers/:id` - Ek worker
- `POST /api/workers/send-otp` - OTP bhejein
- `POST /api/workers/verify-otp` - OTP verify karein

### Notifications
- `GET /api/workers/:workerId/notifications` - Notifications
- `PUT /api/workers/:workerId/notifications/:id/read` - Mark as read

## 💡 Kaise Use Karein

### Categories Fetch Karna
```javascript
import {categoryService} from './services';

const response = await categoryService.getAllCategories();
if (response.success) {
  console.log(response.data); // Categories array
}
```

### Workers Search Karna
```javascript
import {workerService} from './services';

const response = await workerService.getAllWorkers({
  category: 'Plumber',
  city: 'Mumbai',
  verified: true
});

if (response.success) {
  console.log(response.data); // Workers array
}
```

### OTP Bhejein
```javascript
import {workerService} from './services';

// OTP bhejein
const otpResponse = await workerService.sendOTP('9876543210');
console.log(otpResponse.otp); // Screen par dikhayein

// OTP verify karein
const verifyResponse = await workerService.verifyOTP('9876543210', '123456');
if (verifyResponse.success) {
  console.log(verifyResponse.worker); // Worker ka data
}
```

## ⚙️ Configuration

### API URL Change Karna (Optional)
File: `src/config/api.js`

**Default**: Production (Render) URL use hota hai
```javascript
export const BASE_URL = API_CONFIG.PRODUCTION; // Render backend
```

**Local Testing Ke Liye** (agar local backend chalana ho):
```javascript
export const BASE_URL = API_CONFIG.LOCAL;      // localhost
// ya
export const BASE_URL = API_CONFIG.EMULATOR;   // Android Emulator
```

## 🐛 Problems Aur Solutions

### Network Error
- Backend server chal raha hai check karein
- API URL sahi hai check karein
- Android Emulator ke liye `10.0.2.2` use karein

### Data Nahi Aa Raha
- Backend console check karein
- MongoDB connected hai check karein
- API endpoints sahi hain check karein

### CORS Error
- Backend mein CORS already enabled hai
- Backend console check karein

## 📝 Important Notes

1. **Axios Install Karna Zaroori Hai**
   ```bash
   npm install axios
   ```

2. **Backend Pehle Start Karein**
   Backend server pehle start hona chahiye

3. **Environment Auto-Detect Hota Hai**
   App automatically development ya production detect karta hai

4. **Loading States Already Hain**
   Sab screens mein loading indicators already add hain

## 🎯 Aage Kya Karna Hai

1. ✅ Axios install karein
2. ✅ Backend start karein
3. ✅ App test karein
4. 🔄 Baaki screens integrate karein:
   - WorkerDetailScreen
   - NotificationScreen
   - ProfileScreen
   - BookingScreen

## 🎉 Integration Complete!

Aapka app ab backend se fully connected hai! Categories, workers, notifications sab backend se aa rahe hain.

### Test Karne Ke Liye:
1. Backend start karein: `cd Passo_backend && npm start`
2. App start karein: `cd UserApp && npm start`
3. Android run karein: `npm run android`
4. HomeScreen par categories aur workers dikhenge backend se!

## 📞 Support

Koi problem ho to:
1. Backend console check karein
2. App console check karein
3. Network tab check karein (React Native Debugger)

Happy Coding! 🚀
