import axios from 'axios';
import * as cheerio from 'cheerio';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({ region: process.env.AWS_REGION });

// Helper function to sanitize filename
const sanitizeFilename = (filename) => {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_+/g, '_')
    .toLowerCase();
};

// Helper function to upload file to S3
const uploadToS3 = async (buffer, filename) => {
  const timestamp = new Date().getTime();
  const sanitizedName = sanitizeFilename(filename);
  const key = `pdfs/${timestamp}_${sanitizedName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.STORAGE_PDFBUCKET_BUCKETNAME,
    Key: key,
    Body: buffer,
    ContentType: 'application/pdf',
    Metadata: {
      'upload-date': new Date().toISOString(),
      'original-name': filename
    }
  });

  try {
    const result = await s3Client.send(command);
    return {
      success: true,
      key: key,
      bucket: process.env.STORAGE_PDFBUCKET_BUCKETNAME,
      etag: result.ETag
    };
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error(`Failed to upload to S3: ${error.message}`);
  }
};

export const handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  try {
    const { url } = event.arguments;
    
    if (!url) {
      throw new Error('URL is required');
    }

    console.log(`Starting PDF download process for: ${url}`);

    // Fetch the webpage
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 30000
    });

    // Parse HTML and find PDF links
    const $ = cheerio.load(response.data);
    const pdfLinks = [];

    // Look for PDF links
    $('a[href$=".pdf"], a[href*=".pdf"]').each((i, element) => {
      const href = $(element).attr('href');
      if (href) {
        // Convert relative URLs to absolute URLs
        const absoluteUrl = new URL(href, url).href;
        pdfLinks.push({
          url: absoluteUrl,
          text: $(element).text().trim() || 'Unnamed PDF'
        });
      }
    });

    if (pdfLinks.length === 0) {
      throw new Error('No PDF links found on the page');
    }

    console.log(`Found ${pdfLinks.length} PDF links`);

    // Process each PDF (limit to first 10 to avoid timeout)
    const maxPDFs = Math.min(pdfLinks.length, 10);
    const results = [];
    const errors = [];

    for (let i = 0; i < maxPDFs; i++) {
      const pdfLink = pdfLinks[i];
      try {
        console.log(`Processing PDF ${i + 1}/${maxPDFs}: ${pdfLink.url}`);

        // Download PDF
        const pdfResponse = await axios.get(pdfLink.url, {
          responseType: 'arraybuffer',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          },
          timeout: 30000 // 30 seconds timeout for Lambda
        });

        // Verify it's actually a PDF
        const contentType = pdfResponse.headers['content-type'];
        if (!contentType || !contentType.includes('pdf')) {
          throw new Error(`Invalid content type: ${contentType}. Expected PDF.`);
        }

        // Generate filename from URL or use the link text
        const urlParts = pdfLink.url.split('/');
        const originalFilename = urlParts[urlParts.length - 1] || `${sanitizeFilename(pdfLink.text)}.pdf`;
        
        // Upload to S3
        const uploadResult = await uploadToS3(
          Buffer.from(pdfResponse.data),
          originalFilename
        );

        results.push({
          originalUrl: pdfLink.url,
          filename: originalFilename,
          s3Key: uploadResult.key,
          size: pdfResponse.data.byteLength
        });

        console.log(`✅ Successfully processed PDF ${i + 1}/${maxPDFs}`);

      } catch (error) {
        console.error(`❌ Error processing PDF ${i + 1}/${maxPDFs}:`, error.message);
        errors.push({
          url: pdfLink.url,
          error: error.message
        });
      }
    }

    // Return response
    const responseData = {
      success: true,
      summary: {
        total: maxPDFs,
        successful: results.length,
        failed: errors.length
      },
      results: results,
      errors: errors.length > 0 ? errors : null
    };

    console.log(`Process completed: ${results.length}/${maxPDFs} PDFs successfully uploaded`);
    return responseData;

  } catch (error) {
    console.error('Error in processPDFs function:', error);
    throw new Error(error.message);
  }
};
