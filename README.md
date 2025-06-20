# 📄 NCDHHS PDF Downloader - Amplify Version

A simplified, serverless version of the PDF downloader application built for AWS Amplify.

## 🎯 **What This App Does**

Downloads PDF files from the NCDHHS Child Welfare Services policies page and uploads them to AWS S3 - all serverless!

**Target URL**: https://policies.ncdhhs.gov/divisional-n-z/social-services/child-welfare-services/cws-policies-manuals/

## 🏗️ **Simplified Architecture**

- **Frontend**: React app (hosted on Amplify)
- **Backend**: AWS Lambda function (no server needed!)
- **Storage**: S3 bucket (managed by Amplify)
- **API**: GraphQL API (managed by Amplify)

## 🚀 **Deploy to AWS Amplify**

### Option 1: Amplify CLI (Recommended)

1. **Install Amplify CLI**:
   ```bash
   npm install -g @aws-amplify/cli
   amplify configure
   ```

2. **Initialize Amplify**:
   ```bash
   cd amplify-simplified
   npm install
   amplify init
   ```

3. **Add API and Storage**:
   ```bash
   amplify add api
   # Choose GraphQL
   # Choose "Single object with fields"
   # Choose "No" for guided schema creation
   
   amplify add storage
   # Choose "Content (Images, audio, video, etc.)"
   # Choose "Auth and guest users"
   ```

4. **Deploy**:
   ```bash
   amplify push
   amplify publish
   ```

### Option 2: Amplify Console (GitHub)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO
   git push -u origin main
   ```

2. **Deploy via Amplify Console**:
   - Go to AWS Amplify Console
   - Connect your GitHub repository
   - Amplify will auto-detect the build settings
   - Deploy!

## 📁 **File Structure (Simplified)**

```
amplify-simplified/
├── src/
│   ├── App.jsx          # Main React component
│   ├── App.css          # Styling
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles
├── amplify/
│   └── backend/
│       └── function/
│           └── processPDFs/  # Lambda function
├── package.json         # Dependencies
├── amplify.yml          # Build configuration
└── README.md           # This file
```

## 🔧 **Key Simplifications Made**

### ❌ **Removed**:
- Separate Node.js server
- Manual environment variable management
- Complex file structure
- Connection testing endpoints
- Manual AWS SDK configuration

### ✅ **Added**:
- AWS Amplify integration
- Serverless Lambda function
- Automatic AWS resource management
- GraphQL API
- Simplified deployment process

## 🎛️ **Environment Variables**

No manual environment setup needed! Amplify manages:
- AWS credentials
- S3 bucket configuration
- API endpoints
- Lambda permissions

## 🔒 **Security**

- ✅ No exposed AWS credentials
- ✅ IAM roles managed by Amplify
- ✅ Secure API endpoints
- ✅ CORS handled automatically

## 📊 **Features**

- ✅ Scrapes PDF links from NCDHHS website
- ✅ Downloads PDFs automatically
- ✅ Uploads to S3 with organized naming
- ✅ Real-time progress updates
- ✅ Error handling and reporting
- ✅ Responsive design
- ✅ Serverless architecture

## 🚨 **Lambda Limitations**

- **Timeout**: 15 minutes max
- **Memory**: Configurable up to 10GB
- **Concurrent executions**: 1000 (default)
- **Payload size**: 6MB (synchronous)

For large batches, the function processes up to 10 PDFs per execution to avoid timeouts.

## 🛠️ **Development**

```bash
# Local development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📈 **Scaling**

For processing more PDFs:
1. Increase Lambda timeout and memory
2. Implement batch processing with SQS
3. Use Step Functions for complex workflows
4. Add DynamoDB for job tracking

## 💰 **Cost Optimization**

- Lambda: Pay per execution
- S3: Pay per storage used
- API Gateway: Pay per request
- No idle server costs!

## 🔍 **Monitoring**

- CloudWatch logs for Lambda function
- Amplify console for deployment status
- S3 console for uploaded files

## 🆘 **Troubleshooting**

1. **Build fails**: Check `amplify.yml` configuration
2. **Lambda timeout**: Reduce batch size or increase timeout
3. **S3 permissions**: Amplify handles this automatically
4. **API errors**: Check CloudWatch logs

## 📞 **Support**

This simplified version is production-ready and much easier to maintain than the original server-based architecture!
