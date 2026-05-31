import express, { Response } from 'express';
import multer from 'multer';
import Anthropic from '@anthropic-ai/sdk';
import authMiddleware, { AuthRequest } from '../middleware/authMiddleware';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY as string });

// All AI routes are protected
router.use(authMiddleware);

// POST — Analyse resume
router.post('/analyse-resume', upload.single('resume'), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Extract text from PDF
    let resumeText = '';
    try {
      const pdfParse = require('pdf-parse');
      const pdfData = await pdfParse(req.file.buffer);
      resumeText = pdfData.text;
    } catch (err) {
      console.error('PDF parse error:', err);
      return res.status(400).json({ message: 'Could not read PDF — make sure it is a text based PDF' });
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ message: 'Could not extract text from PDF' });
    }

    console.log('Extracted text length:', resumeText.length);
    console.log('First 200 chars:', resumeText.slice(0, 200));

    // Send to Claude AI
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are a professional career coach. Analyse this resume and provide feedback.

Resume:
${resumeText}

Respond with ONLY this JSON, no markdown, no backticks:
{"score":85,"summary":"Two sentence summary here","strengths":["strength1","strength2","strength3"],"improvements":["improvement1","improvement2","improvement3"],"missingKeywords":["keyword1","keyword2","keyword3"],"recommendedRoles":["role1","role2","role3"]}`
        }
      ]
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    console.log('AI response:', responseText.slice(0, 200));

    const cleanResponse = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const analysis = JSON.parse(cleanResponse);
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
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are a professional recruiter. Compare this resume against the job description.

Resume:
${resumeText}

Job Description:
${jobDescription}

Respond with ONLY this JSON, no markdown, no backticks:
{"matchScore":75,"summary":"Two sentence summary here","matchingSkills":["skill1","skill2","skill3"],"missingSkills":["skill1","skill2","skill3"],"recommendations":["rec1","rec2"]}`
        }
      ]
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const cleanResponse = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const match = JSON.parse(cleanResponse);
    res.json({ match });

  } catch (error) {
    console.error('Job match error:', error);
    res.status(500).json({ message: 'Job match analysis failed' });
  }
});

export default router;