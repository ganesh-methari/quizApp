# 🚀 Quiz App - Production Deployment Guide to Vercel

## 📋 Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Project Structure](#project-structure)
4. [Environment Setup](#environment-setup)
5. [Deployment Process](#deployment-process)
6. [Post-Deployment Configuration](#post-deployment-configuration)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This guide covers deploying your full-stack Quiz Application to Vercel with the following architecture:

- **Frontend**: React 19.2 + Vite 7.3 + TailwindCSS 4.2
- **Backend**: Node.js + Express 5.2
- **Database**: MongoDB Atlas
- **Authentication**: JWT + bcrypt
- **Deployment Platform**: Vercel

---

## 🔧 Prerequisites

### Required Accounts:
- [Vercel Account](https://vercel.com/signup) (Free tier available)
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas) (Free tier available)
- [GitHub Account](https://github.com/signup) (For Vercel integration)

### Required Tools:
```bash
# Install Vercel CLI
npm install -g vercel

# Install Git (if not installed)
# Download from: https://git-scm.com/downloads
```

---

## 📁 Project Structure

### Current Structure:
```
quizApp/
├── src/                          # Frontend Source
│   ├── components/               # React Components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Navbar.jsx
│   │   ├── QuizList.jsx
│   │   ├── QuizCreate.jsx
│   │   ├── QuizTake.jsx
│   │   └── QuizResult.jsx
│   ├── context/                  # React Context
│   │   └── AuthContext.jsx
│   ├── App.jsx                   # Main App Component
│   ├── main.jsx                  # Entry Point
│   └── index.css                 # Global Styles

├── public/                       # Static Assets
│   └── vite.svg

├── api/                          # Backend API (Create this)
│   ├── index.js                  # Serverless Entry Point
│   ├── controllers/              # Route Controllers
│   ├── middlewares/              # Custom Middlewares
│   ├── models/                   # Database Models
│   └── utils/                    # Utility Functions

├── .env.example                  # Environment Variables Template
├── .env.local                    # Local Environment Variables
├── .gitignore                    # Git Ignore Rules
├── vercel.json                   # Vercel Configuration
├── vite.config.js                # Vite Configuration
├── package.json                  # Frontend Dependencies
└── package-lock.json             # Lock File
```

---

## 🔐 Environment Setup

### 1. Create Environment Variables File

Create `.env.example` in your project root:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quizapp

# JWT Secret (Generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend URL
CLIENT_URL=http://localhost:5173

# Node Environment
NODE_ENV=development
```

### 2. Generate JWT Secret

```bash
# Generate a secure random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist IP: `0.0.0.0/0` (allows all IPs for Vercel)
5. Get your connection string

---

## 🚀 Deployment Process

### Step 1: Prepare Backend for Serverless

Create `api/index.js`:

```javascript
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./controllers/auth');
const quizRoutes = require('./controllers/quiz');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));

// Database Connection
if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Error:', err));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Export for Vercel
module.exports = app;
```

### Step 2: Create Vercel Configuration

Create `vercel.json` in project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/public/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Step 3: Update Frontend API Configuration

Create `src/config/api.js`:

```javascript
const API_BASE_URL = import.meta.env.PROD
  ? '/api'  // In production, use relative path
  : 'http://localhost:5000/api';  // In development, use local backend

export default API_BASE_URL;
```

Update `src/context/AuthContext.jsx`:

```javascript
import API_BASE_URL from '../config/api';

// Replace all localhost:5000 with API_BASE_URL
const response = await axios.post(`${API_BASE_URL}/auth/login`, {
  email,
  password
});
```

### Step 4: Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# 1. Login to Vercel
vercel login

# 2. Deploy
vercel

# 3. Set environment variables
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add CLIENT_URL

# 4. Deploy to production
vercel --prod
```

#### Option B: Using Vercel Dashboard

1. **Push code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/quizapp.git
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Project should be auto-detected

3. **Configure Environment Variables**:
   - Go to **Settings** → **Environment Variables**
   - Add all variables from `.env.example`

4. **Deploy**:
   - Click **Deploy**
   - Wait for deployment to complete
   - Visit your deployment URL

---

## ⚙️ Post-Deployment Configuration

### 1. Update Environment Variables in Vercel Dashboard

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quizapp
JWT_SECRET=your_generated_jwt_secret
CLIENT_URL=https://your-app.vercel.app
NODE_ENV=production
```

### 2. Configure Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records:
   ```
   Type: CNAME
   Name: @ (or your subdomain)
   Value: cname.vercel-dns.com
   ```
4. Wait for SSL certificate (usually 5-10 minutes)

### 3. Set Up Monitoring

1. **Enable Vercel Analytics**:
   - Go to **Analytics** tab
   - Click **Enable Analytics**

2. **Set Up Error Tracking** (Optional):
   ```bash
   npm install @sentry/react
   ```
   Initialize in `src/main.jsx`

---

## 📊 Monitoring & Maintenance

### Deployment Checklist

- [ ] Backend API endpoints are accessible
- [ ] MongoDB connection is working
- [ ] User authentication works
- [ ] Quiz creation/taking works
- [ ] Email sending works (if configured)
- [ ] No console errors in browser
- [ ] Responsive design works on mobile

### Monitoring Commands

```bash
# View deployment logs
vercel logs

# View real-time logs
vercel logs --follow

# Check deployment status
vercel ls

# Inspect environment variables
vercel env ls
```

### Regular Maintenance

1. **Update Dependencies**:
   ```bash
   npm update
   npm audit fix
   ```

2. **Monitor Database**:
   - Check MongoDB Atlas dashboard
   - Monitor connection count
   - Review slow queries

3. **Review Logs**:
   - Check Vercel Function logs
   - Monitor error rates
   - Track API response times

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### 1. "Cannot GET /api/*" Error

**Problem**: API routes not working

**Solution**:
```javascript
// Ensure vercel.json has correct routes
{
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.js"
    }
  ]
}
```

#### 2. MongoDB Connection Timeout

**Problem**: Database connection failing

**Solution**:
- Whitelist `0.0.0.0/0` in MongoDB Atlas
- Check `MONGODB_URI` is correct
- Ensure cluster is active (not paused)

#### 3. CORS Errors

**Problem**: Frontend can't access backend

**Solution**:
```javascript
// In api/index.js
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
```

#### 4. Environment Variables Not Working

**Problem**: `process.env` variables are undefined

**Solution**:
- Add variables in Vercel Dashboard, not `.env` file
- Redeploy after adding variables
- Use exact variable names (case-sensitive)

#### 5. Build Failures

**Problem**: Deployment fails during build

**Solution**:
```bash
# Test build locally
npm run build

# Check for missing dependencies
npm install

# Ensure Node.js version compatibility
node --version  # Should be 18.x or higher
```

#### 6. 504 Gateway Timeout

**Problem**: Functions timing out

**Solution**:
- Optimize database queries
- Add database connection pooling
- Increase function timeout (Vercel Pro only)

---

## 📈 Performance Optimization

### Frontend Optimization

1. **Code Splitting**:
   ```javascript
   const QuizTake = lazy(() => import('./components/QuizTake'));
   ```

2. **Image Optimization**:
   ```jsx
   import ImageOptimizer from 'react-image-webp';
   ```

3. **Bundle Analysis**:
   ```bash
   npm run build
   npx vite-bundle-visualizer
   ```

### Backend Optimization

1. **Database Connection Pooling**:
   ```javascript
   mongoose.connect(process.env.MONGODB_URI, {
     maxPoolSize: 10,
     minPoolSize: 5
   });
   ```

2. **Caching Strategy**:
   ```javascript
   const cache = new Map();
   app.get('/api/quizzes', cache middleware);
   ```

3. **API Response Compression**:
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

---

## 🔒 Security Best Practices

### Must Implement:

1. **Environment Variables Security**:
   - Never commit `.env` files
   - Use strong JWT secrets (32+ characters)
   - Rotate secrets regularly

2. **API Security**:
   ```javascript
   // Rate limiting
   const rateLimit = require('express-rate-limit');

   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });

   app.use('/api/', limiter);
   ```

3. **Input Validation**:
   ```javascript
   const { body, validationResult } = require('express-validator');

   app.post('/api/auth/register', [
     body('email').isEmail(),
     body('password').isLength({ min: 6 })
   ], (req, res) => {
     // Handle validation
   });
   ```

4. **HTTPS Only**:
   - Vercel provides HTTPS by default
   - Redirect HTTP to HTTPS

---

## 📝 Deployment Checklist

### Pre-Deployment:
- [ ] All environment variables set
- [ ] MongoDB Atlas cluster active
- [ ] Code pushed to GitHub
- [ ] `.gitignore` properly configured
- [ ] Build succeeds locally
- [ ] All tests passing

### Post-Deployment:
- [ ] API endpoints tested
- [ ] Database connection verified
- [ ] Authentication flow tested
- [ ] Email functionality tested
- [ ] Mobile responsiveness checked
- [ ] Performance acceptable

---

## 🎓 Learning Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB University](https://university.mongodb.com/)
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

---

## 💡 Pro Tips

1. **Always deploy to a preview branch first**
   ```bash
   vercel --env=preview
   ```

2. **Use Vercel's GitHub integration**
   - Automatic deployments on push
   - Preview URLs for pull requests
   - Rollback functionality

3. **Monitor your free tier limits**
   - 100GB bandwidth per month
   - 1000 serverless function invocations per day
   - 512MB function execution memory

4. **Set up alerts**
   - Email notifications for failed deployments
   - Error rate monitoring
   - Performance degradation alerts

---

## 🆘 Support

If you encounter issues:

1. Check [Vercel Status](https://www.vercel-status.com/)
2. Search [Vercel Documentation](https://vercel.com/docs)
3. Ask in [Vercel Community](https://github.com/vercel/vercel/discussions)
4. Review deployment logs in Vercel Dashboard

---

## 📜 License

This deployment guide is part of the Quiz App project.

**Last Updated**: March 2025
**Version**: 1.0.0

---

**Happy Deploying! 🎉**
