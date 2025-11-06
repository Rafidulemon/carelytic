import { S3Client } from "@aws-sdk/client-s3";

interface R2Config {
  endpoint: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
}

const cached: { client: S3Client | null; config: R2Config | null } = {
  client: null,
  config: null,
};

function loadConfig(): R2Config {
  const endpoint = process.env.S3_ENDPOINT ?? "";
  const region = process.env.S3_REGION ?? "auto";
  const accessKeyId = process.env.S3_ACCESS_KEY_ID ?? "";
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY ?? "";
  const bucket = process.env.S3_BUCKET ?? "";

  if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) {
    throw new Error("Cloudflare R2 credentials are not fully configured.");
  }

  return { endpoint, region, accessKeyId, secretAccessKey, bucket };
}

export function getR2Client() {
  if (cached.client && cached.config) {
    return { client: cached.client, config: cached.config };
  }

  const config = loadConfig();
  const client = new S3Client({
    endpoint: config.endpoint,
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    forcePathStyle: true,
  });

  cached.client = client;
  cached.config = config;

  return { client, config };
}
