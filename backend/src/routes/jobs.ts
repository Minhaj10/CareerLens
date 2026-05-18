import express, { Response } from 'express';
import Job from '../models/Job';
import authMiddleware, { AuthRequest } from '../middleware/authMiddleware';

const router = express.Router();

// All job routes are protected
router.use(authMiddleware);

// GET all jobs for logged in user
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const jobs = await Job.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create new job
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { company, role, status, notes, salary, jobUrl } = req.body;

    const job = new Job({
      userId: req.userId,
      company,
      role,
      status: status || 'Applied',
      notes,
      salary,
      jobUrl
    });

    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update job
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE job
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;