import { Router } from 'express';
import { listApartments, getApartment, createApartment } from '../controllers/apartmentController';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Apartment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         project:
 *           type: string
 *           example: "Palm Hills"
 *         unit_name:
 *           type: string
 *           example: "A-101"
 *         unit_number:
 *           type: string
 *           example: "101"
 *         price:
 *           type: number
 *           example: 1500000
 *         area:
 *           type: number
 *           example: 120
 *         city:
 *           type: string
 *           example: "Cairo"
 *         description:
 *           type: string
 *           example: "Nice apartment with garden view"
 *         status:
 *           type: string
 *           enum: [available, sold, reserved]
 *           example: "available"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-01-01T00:00:00.000Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2025-01-01T00:00:00.000Z"
 *     ApartmentInput:
 *       type: object
 *       required:
 *         - project
 *         - unit_name
 *         - unit_number
 *         - price
 *         - area
 *         - city
 *       properties:
 *         project:
 *           type: string
 *           example: "Palm Hills"
 *         unit_name:
 *           type: string
 *           example: "A-101"
 *         unit_number:
 *           type: string
 *           example: "101"
 *         price:
 *           type: number
 *           example: 1500000
 *         area:
 *           type: number
 *           example: 120
 *         city:
 *           type: string
 *           example: "Cairo"
 *         description:
 *           type: string
 *           example: "Nice apartment with garden view"
 *         status:
 *           type: string
 *           enum: [available, sold, reserved]
 *           default: "available"
 *           example: "available"
 *     ApartmentListResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Apartment'
 *         meta:
 *           type: object
 *           properties:
 *             page:
 *               type: integer
 *               example: 1
 *             page_size:
 *               type: integer
 *               example: 10
 *             total:
 *               type: integer
 *               example: 42
 *             total_pages:
 *               type: integer
 *               example: 5
 *     ApartmentSingleResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/Apartment'
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Error message"
 *         errors:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * @swagger
 * /api/apartments:
 *   get:
 *     summary: List all apartments with filtering, sorting, and pagination
 *     description: Retrieve a paginated list of apartments with optional search, price filters, and sorting
 *     tags: [Apartments]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter by project, unit_name, or unit_number (case-insensitive)
 *         example: "Palm"
 *       - in: query
 *         name: min_price
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *         example: 1000000
 *       - in: query
 *         name: max_price
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *         example: 2000000
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [newest, price_asc, price_desc]
 *         description: Sort order
 *         example: "newest"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *         example: 1
 *       - in: query
 *         name: page_size
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Number of items per page
 *         example: 10
 *     responses:
 *       200:
 *         description: Successful response with apartment list and pagination metadata
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApartmentListResponse'
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', listApartments);

/**
 * @swagger
 * /api/apartments/{id}:
 *   get:
 *     summary: Get a single apartment by ID
 *     description: Retrieve detailed information about a specific apartment
 *     tags: [Apartments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Apartment ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Successful response with apartment details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApartmentSingleResponse'
 *       404:
 *         description: Apartment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', getApartment);

/**
 * @swagger
 * /api/apartments:
 *   post:
 *     summary: Create a new apartment
 *     description: Create a new apartment listing with validation
 *     tags: [Apartments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApartmentInput'
 *     responses:
 *       201:
 *         description: Apartment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApartmentSingleResponse'
 *       400:
 *         description: Validation error or duplicate apartment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', createApartment);

export default router;
