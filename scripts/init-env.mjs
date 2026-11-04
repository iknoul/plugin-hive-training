import fs from 'fs';
import path from 'path';

const targets = ['shiphub-api', 'shiphub-web'];

targets.forEach((dir) => {
  const examplePath = path.join(process.cwd(), dir, '.env.example');
  const envPath = path.join(process.cwd(), dir, '.env');

  if (fs.existsSync(examplePath)) {
    if (!fs.existsSync(envPath)) {
      fs.copyFileSync(examplePath, envPath);
      console.log(`Created .env for ${dir} from .env.example`);
    } else {
      console.log(`.env already exists for ${dir}, skipping.`);
    }
  }
});