import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const sourceDirs = ['app', 'components', 'context', 'data', 'lib', 'providers'];
const errors = [];

const forbiddenLiterals = [
  ['next/font/google', 'network-dependent build-time Google font import'],
  ['concierge@rifaa.sa', 'stale fictional support email'],
  ['+966 11 234 5678', 'stale fictional support phone'],
  ["metadataBase: new URL('https://rifaa.sa')", 'stale fictional canonical domain'],
];

const requiredPaths = [
  'app/robots.ts',
  'app/sitemap.ts',
  'app/manifest.ts',
  'app/not-found.tsx',
  'app/error.tsx',
  'app/global-error.tsx',
  'app/api/health/route.ts',
  'app/discover/page.tsx',
  'app/discover/layout.tsx',
  'app/atelier/page.tsx',
  'app/atelier/layout.tsx',
  'app/compare/page.tsx',
  'app/compare/layout.tsx',
  'app/pairing/page.tsx',
  'app/pairing/layout.tsx',
  'lib/pairing.ts',
  'components/product/GarmentPassport.tsx',
  'components/product/CompleteTheLook.tsx',
  'components/home/PairingPreview.tsx',
  'context/CompareContext.tsx',
  'components/home/CompareStudioPreview.tsx',
  'app/capsule/page.tsx',
  'app/capsule/layout.tsx',
  'app/studio/page.tsx',
  'app/studio/layout.tsx',
  'app/passport/page.tsx',
  'app/passport/layout.tsx',
  'app/concierge/page.tsx',
  'app/concierge/layout.tsx',
  'app/gifts/page.tsx',
  'app/gifts/GiftAtelierClient.tsx',
  'app/gifts/layout.tsx',
  'lib/gifts.ts',
  'components/home/GiftAtelierPreview.tsx',
  'components/home/ConciergePreview.tsx',
  'lib/journey.ts',
  'context/StylePassportContext.tsx',
  'components/home/StylePassportPreview.tsx',
  'components/home/CapsuleStudioPreview.tsx',
  'lib/capsule.ts',
  'components/home/AtelierPreview.tsx',
  'data/atelier.ts',
  'components/home/StyleConcierge.tsx',
  'components/home/MaterialLibrary.tsx',
  'components/home/WardrobeBoard.tsx',
  'components/layout/ScrollProgress.tsx',
  'components/layout/MegaMenu.tsx',
  'data/navigation.ts',
  'lib/discovery.ts',
  'docs/PRODUCTION-HANDOFF.md',
  'context/AuthContext.tsx',
  'lib/supabase/client.ts',
  'supabase/migrations/20261003070000_rifaa_customer_cloud.sql',
];

for (const required of requiredPaths) {
  if (!fs.existsSync(path.join(rootDir, required))) {
    errors.push(`Missing required production-readiness file: ${required}`);
  }
}

for (const malformed of [
  'app/editorial/%5Bslug%5D',
  'app/products/%5Bslug%5D',
]) {
  if (fs.existsSync(path.join(rootDir, malformed))) {
    errors.push(`Malformed encoded dynamic route exists: ${malformed}`);
  }
}

function scanDirectory(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      scanDirectory(fullPath);
      continue;
    }

    if (!/\.(tsx|ts|jsx|js|mjs)$/.test(entry.name)) continue;

    const content = fs.readFileSync(fullPath, 'utf8');
    const relative = path.relative(rootDir, fullPath);

    for (const [literal, label] of forbiddenLiterals) {
      if (content.includes(literal)) {
        errors.push(`${relative} contains ${label}: ${literal}`);
      }
    }

    if (/SUPABASE_SERVICE_ROLE_KEY|service_role/i.test(content)) {
      errors.push(`${relative} contains a server-side Supabase credential marker in runtime source`);
    }

    if (/\beval\s*\(/.test(content)) {
      errors.push(`${relative} contains eval(), which is not allowed in storefront runtime code`);
    }

    if (/dangerouslySetInnerHTML/.test(content)) {
      errors.push(`${relative} uses dangerouslySetInnerHTML; review and remove unless explicitly security-reviewed`);
    }

    const storageCalls = content.match(/(?:localStorage|sessionStorage)\.setItem\([^\n;]*/g) || [];
    for (const call of storageCalls) {
      if (/(cardNumber|cvv|expiry|security.?code|full.?card)/i.test(call)) {
        errors.push(`${relative} appears to persist sensitive payment data: ${call.slice(0, 140)}`);
      }
    }
  }
}

for (const sourceDir of sourceDirs) {
  const full = path.join(rootDir, sourceDir);
  if (fs.existsSync(full)) scanDirectory(full);
}

if (errors.length) {
  console.error('\n❌ Production quality validation failed:');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log('✅ Production quality validation passed:');
console.log('  - Required production routes and recovery files exist.');
console.log('  - No stale fictional contact/canonical literals detected.');
console.log('  - Supabase cloud-account integration files are present without service-role credentials in runtime source.');
console.log('  - No malformed encoded dynamic-route directories detected.');
console.log('  - No eval() or unsanctioned dangerouslySetInnerHTML usage detected.');
console.log('  - No obvious sensitive payment persistence patterns detected.');
