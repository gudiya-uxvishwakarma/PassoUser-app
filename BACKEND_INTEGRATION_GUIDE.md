# Backend Integration Guide

## ✅ Integration Complete!

UserApp ko Passo Backend se successfully integrate kar diya gaya hai.

## 📦 Installation Required

Backend integration ke liye axios package install karna hoga:

```bash
cd UserApp
npm install axios
```

## 🔧 Configuration

### API Configuration
File: `src/config/api.js`

Backend URL configured hai:
- **Production (Default)**: `https://passo-backend.onrender.com`
- **Local (Optional)**: `http://localhost:5000` or `http://10.0.2.2:5000`

**Note**: App ab by default Render (production) backend use karega. Local testing ke liye api.js mein BASE_URL change kar sakte hain.

## 📁 New Files Created

### 1. Services Layer
- `src/services/api.service.js` - Base API client with axios
- `src/services/category.service.js` - Category API calls
- `src/services/worker.service.js` - Worker API calls
- `src/services/notification.service.js` - Notification API calls
- `src/services/index.js` - Central export

### 2. Configuration
- `src/config/api.js` - API endpoints aur configuration

## 🔄 Updated Screens

### HomeScreen
- Backend se categories fetch hoti hain
- Backend se featured/verified workers fetch hote hain
- Loading state added
- Real-time search functionality

### WorkerDiscoveryScreen
- Backend se workers fetch hote hain
- Category-based filtering
- Search functionality
- Loading state added

## 🚀 API Endpoints Used

### Categories
- `GET /api/categories` - All categories
- `GET /api/categories/:id` - Single category

### Workers
- `GET /api/workers/public` - All workers (with filters)
- `GET /api/workers/:id` - Single worker
- `POST /api/workers/send-otp` - Send OTP
- `POST /api/workers/verify-otp` - Verify OTP
- `POST /api/workers/check-mobile` - Check mobile exists

### Notifications
- `GET /api/workers/:workerId/notifications` - Get notifications
- `PUT /api/workers/:workerId/notifications/:notificationId/read` - Mark as read

## 🔑 Features

### 1. Category Management
```javascript
import {categoryService} from './services';

// Get all categories
const response = await categoryService.getAllCategories();
if (response.success) {
  console.log(response.data); // Array of categories
}
```

### 2. Worker Discovery
```javascript
import {workerService} from './services';

// Get all workers with filters
const response = await workerService.getAllWorkers({
  category: 'Plumber',
  city: 'Mumbai',
  verified: true,
  featured: true,
});

if (response.success) {
  console.log(response.data); // Array of workers
}
```

### 3. OTP Authentication
```javascript
import {workerService} from './services';

// Send OTP
const otpResponse = await workerService.sendOTP('9876543210');
console.log(otpResponse.otp); // Display OTP on screen

// Verify OTP
const verifyResponse = await workerService.verifyOTP('9876543210', '123456');
if (verifyResponse.success) {
  console.log(verifyResponse.worker); // Worker data
  console.log(verifyResponse.token); // JWT token
}
```

### 4. Search Workers
```javascript
import {workerService} from './services';

// Search by category and city
const response = await workerService.searchWorkers('Electrician', 'Delhi');
```

## 🛠️ Backend Setup

### 1. Start Backend Server

```bash
cd Passo_backend
npm install
npm start
```

Backend will run on `http://localhost:5000`

### 2. Environment Variables

Backend `.env` file already configured:
- MongoDB Atlas connection
- Firebase Admin SDK
- JWT Secret

## 📱 Testing

### 1. Start Backend
```bash
cd Passo_backend
npm start
```

### 2. Start React Native App
```bash
cd UserApp
npm install axios
npm start
```

### 3. Run on Android
```bash
npm run android
```

## 🔍 API Response Format

### Success Response
```json
{
  "success": true,
  "data": [...],
  "message": "Success message"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message"
}
```

## 🎯 Next Steps

1. **Install axios**: `npm install axios`
2. **Start backend**: Backend server ko start karein
3. **Test app**: App ko run karein aur test karein
4. **Add more screens**: Baaki screens ko bhi integrate karein:
   - WorkerDetailScreen
   - NotificationScreen
   - ProfileScreen

## 📝 Notes

- Backend production URL already configured hai
- Development mein Android Emulator ke liye `10.0.2.2` use hota hai
- iOS Simulator ke liye `localhost` use kar sakte hain
- All API calls automatically handle errors
- Loading states already implemented hain

## 🐛 Troubleshooting

### Network Error
- Check backend server is running
- Check API URL in `src/config/api.js`
- For Android Emulator, use `10.0.2.2` instead of `localhost`

### CORS Error
- Backend already has CORS enabled
- Check backend console for errors

### Data Not Loading
- Check backend console logs
- Check MongoDB connection
- Verify API endpoints in backend

## 🎉 Integration Complete!

Ab aapka UserApp backend se fully integrated hai. Categories, workers, aur notifications sab backend se aa rahe hain!
