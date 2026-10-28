import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v2 as cloudinary } from 'cloudinary';
import { authenticate, authorize } from '../middleware/auth';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ── Cloudflare R2 (S3-compatible) ───────────
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET = process.env.R2_BUCKET;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL; // e.g. https://pub-xxxxxx.r2.dev

const R2_ENABLED =
  [R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET].every(
    (v) => v && v !== '' && !v.startsWith('your-')
  ) && !!R2_PUBLIC_URL;

let r2: S3Client | null = null;
if (R2_ENABLED) {
  r2 = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID!,
      secretAccessKey: R2_SECRET_ACCESS_KEY!,
    },
  });
}

// ── Cloudinary (legacy fallback) ────────────
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;
const CLOUDINARY_ENABLED = [CLOUD_NAME, API_KEY, API_SECRET].every(
  (v) => v && v !== '' && !v.startsWith('your-')
);
if (CLOUDINARY_ENABLED) {
  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
  });
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for cloud videos
});

function getExtension(mimetype: string, fallbackName = ''): string {
  const ext = path.extname(fallbackName || '').toLowerCase();
  if (ext) return ext;
  const map: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'video/mp4': '.mp4',
    'video/webm': '.webm',
  };
  return map[mimetype] || '.bin';
}

function makeFilename(file: Express.Multer.File): string {
  return `storefront/${Date.now()}-${crypto.randomBytes(3).toString('hex')}${getExtension(
    file.mimetype,
    file.originalname
  )}`;
}

async function uploadToR2(file: Express.Multer.File): Promise<string> {
  const Key = makeFilename(file);
  await r2!.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key,
      Body: file.buffer,
      ContentType: file.mimetype,
      CacheControl: 'public, max-age=31536000',
    })
  );
  return `${R2_PUBLIC_URL}/${Key}`;
}

function uploadToCloudinary(file: Express.Multer.File, isVideo: boolean): Promise<string> {
  const resourceType = isVideo ? 'video' : 'image';
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'samvera_storefront', resource_type: resourceType },
      (err, result) => {
        if (err || !result) return reject(err || new Error('Cloudinary upload failed'));
        resolve(result.secure_url);
      }
    );
    stream.end(file.buffer);
  });
}

function saveLocally(file: Express.Multer.File): Promise<string> {
  const name = `${Date.now()}-${crypto.randomBytes(3).toString('hex')}${getExtension(
    file.mimetype,
    file.originalname
  )}`;
  return new Promise((resolve, reject) => {
    fs.writeFile(path.join(uploadsDir, name), file.buffer, (err) =>
      err ? reject(err) : resolve(`/uploads/${name}`)
    );
  });
}

router.post('/', authenticate, authorize(['ADMIN']), upload.single('file'), async (req, res, next) => {
  try {
    const file: any = req.file as Express.Multer.File;
    if (!file || !file.buffer) {
      return res.status(400).json({ success: false, error: { message: 'No file uploaded' } });
    }

    const isVideo = file.mimetype.startsWith('video/');
    let url: string | null = null;
    let storedIn = 'local';

    if (R2_ENABLED) {
      try {
        url = await uploadToR2(file);
        storedIn = 'r2';
      } catch (err) {
        console.warn('R2 upload failed, trying next provider:', err);
      }
    }

    if (!url && CLOUDINARY_ENABLED) {
      try {
        url = await uploadToCloudinary(file, isVideo);
        storedIn = 'cloudinary';
      } catch (err) {
        console.warn('Cloudinary upload failed, trying next provider:', err);
      }
    }

    if (!url) {
      url = await saveLocally(file);
    }

    res.json({ success: true, data: { url, storedIn } });
  } catch (error) {
    next(error);
  }
});

// Multer error handler (bad size/format etc.)
router.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  const status = err?.code === 'LIMIT_FILE_SIZE' ? 413 : 500;
  res.status(status).json({
    success: false,
    error: { message: err?.message || 'Upload failed' },
  });
});

export default router;
