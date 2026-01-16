import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-issue-reports.ts';
import '@/ai/flows/categorize-issue-reports.ts';