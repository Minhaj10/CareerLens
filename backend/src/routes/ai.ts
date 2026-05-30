import express, { Response } from 'express';
import multer from 'multer';
import Anthropic from '@anthropic-ai/sdk';
import authMiddleware, { AuthRequest } from '../middleware/authMiddleware';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
import dotenv from 'dotenv';
dotenv.config();

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY as string });

// All AI routes are protected
router.use(authMiddleware);

// Helper to extract text from PDF buffer
const extractTextFromPDF = (buffer: Buffer): string => {
  try {
    const content = buffer.toString('latin1');
    const textMatches = content.match(/BT[\s\S]*?ET/g) || [];
    let text = '';
    
    textMatches.forEach(block => {
      const tdMatches = block.match(/\((.*?)\)\s*Tj/g) || [];
      tdMatches.forEach(match => {
        const extracted = match.replace(/^\(/, '').replace(/\)\s*Tj$/, '');
        text += extracted + ' ';
      });
    });

    // Fallback — extract any readable text
    if (text.trim().length < 50) {
      text = content
        .replace(/[^\x20-\x7E\n\r]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }

    return text.slice(0, 3000);
  } catch {
    return '';
  }
};

// POST — Analyse resume
router.post('/analyse-resume', upload.single('resume'), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const resumeText = extractTextFromPDF(req.file.buffer);

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ message: 'Could not extract text from PDF — make sure it is a text-based PDF not a scanned image' });
    }

    // Send to Claude AI
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: `You are a professional career coach and resume expert. Analyse this resume and provide feedback.

Resume text:
${resumeText}

Provide your response in this exact JSON format:
{
  "score": <number 0-100>,
  "summary": "<2 sentence overall summary>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
  "missingKeywords": ["<keyword 1>", "<keyword 2>", "<keyword 3>"],
  "recommendedRoles": ["<role 1>", "<role 2>", "<role 3>"]
}

Only respond with the JSON, no other text.`
        }
      ]
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const analysis = JSON.parse(responseText);

    res.json({ analysis, resumeText: resumeText.slice(0, 500) });

  } catch (error) {
    console.error('AI analysis error:', error);
    res.status(500).json({ message: 'AI analysis failed' });
  }
});

// POST — Job match scorer
router.post('/job-match', async (req: AuthRequest, res: Response) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ message: 'Resume text and job description required' });
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: `You are a professional recruiter. Compare this resume against the job description.

Resume:
${resumeText}

Job Description:
${jobDescription}

Provide your response in this exact JSON format:
{
  "matchScore": <number 0-100>,
  "summary": "<2 sentence match summary>",
  "matchingSkills": ["<skill 1>", "<skill 2>", "<skill 3>"],
  "missingSkills": ["<skill 1>", "<skill 2>", "<skill 3>"],
  "recommendations": ["<recommendation 1>", "<recommendation 2>"]
}

Only respond with the JSON, no other text.`
        }
      ]
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const match = JSON.parse(responseText);

    res.json({ match });

  } catch (error) {
    console.error('Job match error:', error);
    res.status(500).json({ message: 'Job match analysis failed' });
  }
});

export default router;