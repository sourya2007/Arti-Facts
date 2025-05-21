import { config } from 'dotenv';
config();

import '@/ai/flows/generate-tags.ts';
import '@/ai/flows/validate-historical-relevance.ts';
import '@/ai/flows/generate-extended-historical-summary.ts';
import '@/ai/flows/generate-historical-summary.ts';