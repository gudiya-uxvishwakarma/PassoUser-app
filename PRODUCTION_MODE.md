# 🌐 Production Mode - Render Backend

## ✅ Current Configuration

App ab **production mode** mein hai aur **Render backend** use kar raha hai.

### Backend URL
```
https://passo-backend.onrender.com
```

### API Base URL
```
https://passo-backend.onrender.com/api
```

## 📱 Kya Matlab Hai?

- ✅ App **live backend** se data fetch karega
- ✅ **Internet connection** zaroori hai
- ✅ **Local backend** start karne ki zaroorat nahi
- ✅ Data **real database** se aayega (MongoDB Atlas)

## 🚀 Kaise Chalayein

### Simple Steps:
```bash
# 1. Install dependencies
cd UserApp
npm install axios

# 2. Start app (backend already live hai)
npm start
npm run android
```

**Note**: Local backend start karne ki zaroorat nahi! Render par already chal raha hai.

## 🔄 Local Backend Use Karna Hai?

Agar aap local backend test karna chahte hain:

### Step 1: Backend Start Karein
```bash
cd Passo_backend
npm start
```

### Step 2: API Config Change Karein
File: `src/config/api.js`

```javascript
// Change this line:
export const BASE_URL = API_CONFIG.PRODUCTION;

// To this (for local):
export const BASE_URL = API_CONFIG.LOCAL;
// or (for Android Emulator):
export const BASE_URL = API_CONFIG.EMULATOR;
```

### Step 3: App Restart Karein
```bash
npm start
npm run android
```

## 🌍 Production vs Local

### Production (Current - Render)
✅ Always available  
✅ No local setup needed  
✅ Real database  
✅ Internet required  
✅ Slower first request (cold start)  

### Local (Optional)
✅ Faster response  
✅ No internet needed  
✅ Full control  
❌ Backend start karna padega  
❌ MongoDB connection needed  

## 📊 Backend Status Check

### Check if Render backend is live:
```bash
curl https://passo-backend.onrender.com/health
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-03-02T..."
}
```

### Check Categories API:
```bash
curl https://passo-backend.onrender.com/api/categories
```

### Check Workers API:
```bash
curl https://passo-backend.onrender.com/api/workers/public
```

## ⚡ Performance Note

**First Request**: Render free tier mein backend sleep mode mein jata hai. Pehli request 30-60 seconds le sakti hai (cold start).

**Subsequent Requests**: Fast response milega.

**Solution**: Backend ko active rakhne ke liye periodic health checks setup kar sakte hain.

## 🐛 Troubleshooting

### Slow Response
- First request slow ho sakti hai (cold start)
- Wait for 30-60 seconds
- Next requests fast hongi

### Network Error
- Check internet connection
- Check Render backend status
- Try health endpoint: `https://passo-backend.onrender.com/health`

### Data Not Loading
- Check backend logs on Render dashboard
- Verify MongoDB connection
- Check API endpoints

## 📝 Summary

✅ **Current Mode**: Production (Render)  
✅ **Backend URL**: `https://passo-backend.onrender.com`  
✅ **Local Backend**: Not required  
✅ **Internet**: Required  
✅ **Setup**: Just install axios and run app  

## 🎯 Quick Start

```bash
cd UserApp
npm install axios
npm start
npm run android
```

That's it! Backend already live hai Render par. 🚀
