# 🚀 Step-by-Step Deployment Guide

## Prerequisites ✅

1. **AWS CLI configured** (you already have this)
2. **Node.js installed** (you have v20.15.0)
3. **No global Amplify CLI needed** (we'll use npx)

## 🎯 **Option 1: Quick Deploy (Recommended)**

### Step 1: Navigate to the project
```bash
cd /Users/dhanunjayudusurisetty/Documents/gen_ai_application/amplify-simplified
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Initialize Amplify
```bash
npx @aws-amplify/cli configure
```
Follow the prompts to set up your AWS profile if not already done.

### Step 4: Initialize the project
```bash
npx @aws-amplify/cli init
```
**Answers to prompts:**
- Project name: `ncdhhs-pdf-downloader`
- Environment name: `dev`
- Default editor: `Visual Studio Code` (or your preference)
- App type: `javascript`
- Framework: `react`
- Source directory: `src`
- Build directory: `dist`
- Build command: `npm run build`
- Start command: `npm run dev`
- Use AWS profile: `Yes` (select your profile)

### Step 5: Add Storage (S3 bucket)
```bash
npx @aws-amplify/cli add storage
```
**Answers:**
- Select service type: `Content (Images, audio, video, etc.)`
- Provide a friendly name: `pdfStorage`
- Provide bucket name: `ncdhhs-pdfs-bucket-[your-unique-suffix]`
- Who should have access: `Auth and guest users`
- What kind of access: `create/update, read, delete`

### Step 6: Add API (for Lambda function)
```bash
npx @aws-amplify/cli add api
```
**Answers:**
- Select service: `GraphQL`
- Provide API name: `pdfProcessorAPI`
- Choose authorization type: `API key`
- Enter description: `PDF processing API`
- Do you want to configure advanced settings: `No`
- Do you have an annotated GraphQL schema: `No`
- Choose a schema template: `Single object with fields`
- Do you want to edit the schema: `Yes`

**Replace the schema with:**
```graphql
type PDFResult {
  filename: String!
  s3Key: String!
  size: Int!
  originalUrl: String!
}

type ProcessSummary {
  total: Int!
  successful: Int!
  failed: Int!
}

type ProcessError {
  url: String!
  error: String!
}

type ProcessPDFsResponse {
  success: Boolean!
  summary: ProcessSummary!
  results: [PDFResult]
  errors: [ProcessError]
}

type Query {
  listPDFs: [PDFResult]
}

type Mutation {
  processPDFs(url: String!): ProcessPDFsResponse
}
```

### Step 7: Add Lambda Function
```bash
npx @aws-amplify/cli add function
```
**Answers:**
- Select service: `Lambda function`
- Provide friendly name: `processPDFs`
- Choose function template: `Hello World`
- Do you want to configure advanced settings: `Yes`
- Do you want to access other resources: `Yes`
- Select storage: `pdfStorage`
- Select operations: `create, read, update, delete`
- Do you want to invoke this function on a recurring schedule: `No`
- Do you want to configure Lambda layers: `No`
- Do you want to edit the local function now: `No`

### Step 8: Deploy everything
```bash
npx @aws-amplify/cli push
```
This will create all AWS resources (S3, Lambda, API Gateway, etc.)

### Step 9: Publish the app
```bash
npx @aws-amplify/cli publish
```
This will build and deploy your React app.

## 🎯 **Option 2: GitHub + Amplify Console (Alternative)**

If you prefer a visual approach:

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Deploy via Amplify Console
1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New app" → "Host web app"
3. Connect your GitHub repository
4. Amplify will auto-detect build settings
5. Deploy!

## 🔧 **Troubleshooting**

### Permission Issues (like you encountered):
- **Solution**: Use `npx @aws-amplify/cli` instead of global install
- **Alternative**: Fix npm permissions (see below)

### Fix npm permissions (if you want global install):
```bash
# Option A: Use npm's built-in solution
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
npm install -g @aws-amplify/cli
```

### Lambda Function Issues:
- Make sure to copy the Lambda function code from `amplify/backend/function/processPDFs/src/index.js`
- Install dependencies in the Lambda function directory

### Build Issues:
- Run `npm run build` locally first to test
- Check `amplify.yml` configuration

## 📞 **Need Help?**

If you encounter issues:
1. Check CloudWatch logs for Lambda errors
2. Verify S3 bucket permissions
3. Ensure AWS CLI is properly configured
4. Run `npx @aws-amplify/cli status` to check resource status

## 🎉 **Success!**

Once deployed, you'll get:
- A live URL for your React app
- Automatic HTTPS
- Global CDN
- Serverless backend
- S3 storage for PDFs

Your app will be able to download PDFs from the NCDHHS website and store them in S3, all without managing any servers!
