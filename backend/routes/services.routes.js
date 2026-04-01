import express from 'express'
import { getAllServices, getServiceById, createService, updateService, deleteService } from '../controllers/service.controller.js'
import { protect, authorize } from '../middleware/auth.middleware.js'
import upload from '../middleware/upload.middleware.js'

const router = express.Router()

router.get('/', getAllServices)
router.get('/:id', getServiceById)

// vendor creates service (image upload supported)
router.post('/', protect, authorize('vendor'), upload.single('image'), createService)

// update (vendor owner or admin) - image upload supported
router.put('/:id', protect, upload.single('image'), updateService)

// delete (admin only)
router.delete('/:id', protect, authorize('admin'), deleteService)

export default router
