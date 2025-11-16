import { Request, Response, NextFunction } from 'express';
import { Op, ValidationError } from 'sequelize';
import Apartment from '../models/Apartment';

export const listApartments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      search,
      min_price,
      max_price,
      sort = 'newest',
      page = '1',
      page_size = '10',
    } = req.query;

    // Validate numeric params
    const pageNum = parseInt(page as string, 10);
    const pageSizeNum = parseInt(page_size as string, 10);

    if (isNaN(pageNum) || pageNum < 1) {
      res.status(400).json({ error: 'Invalid page parameter. Must be a positive integer.' });
      return;
    }

    if (isNaN(pageSizeNum) || pageSizeNum < 1) {
      res.status(400).json({ error: 'Invalid page_size parameter. Must be a positive integer.' });
      return;
    }

    // Build where clause
    const where: any = {};

    // Search filter
    if (search && typeof search === 'string') {
      where[Op.or] = [
        { project: { [Op.iLike]: `%${search}%` } },
        { unit_name: { [Op.iLike]: `%${search}%` } },
        { unit_number: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Price filters
    if (min_price) {
      const minPriceNum = parseFloat(min_price as string);
      if (isNaN(minPriceNum)) {
        res.status(400).json({ error: 'Invalid min_price parameter. Must be a number.' });
        return;
      }
      where.price = { ...where.price, [Op.gte]: minPriceNum };
    }

    if (max_price) {
      const maxPriceNum = parseFloat(max_price as string);
      if (isNaN(maxPriceNum)) {
        res.status(400).json({ error: 'Invalid max_price parameter. Must be a number.' });
        return;
      }
      where.price = { ...where.price, [Op.lte]: maxPriceNum };
    }

    // Determine order
    let order: any[] = [];
    switch (sort) {
      case 'newest':
        order = [['created_at', 'DESC']];
        break;
      case 'price_asc':
        order = [['price', 'ASC']];
        break;
      case 'price_desc':
        order = [['price', 'DESC']];
        break;
      default:
        order = [['created_at', 'DESC']];
    }

    // Calculate pagination
    const offset = (pageNum - 1) * pageSizeNum;
    const limit = pageSizeNum;

    // Query database
    const { count, rows } = await Apartment.findAndCountAll({
      where,
      order,
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / pageSizeNum);

    res.status(200).json({
      data: rows,
      meta: {
        page: pageNum,
        page_size: pageSizeNum,
        total: count,
        total_pages: totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getApartment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const apartment = await Apartment.findByPk(id);

    if (!apartment) {
      res.status(404).json({ error: 'Apartment not found' });
      return;
    }

    res.status(200).json({ data: apartment });
  } catch (error) {
    next(error);
  }
};

export const createApartment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      project,
      unit_name,
      unit_number,
      price,
      area,
      city,
      description,
      status,
    } = req.body;

    // Validate required fields
    const requiredFields = ['project', 'unit_name', 'unit_number', 'price', 'area', 'city'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      res.status(400).json({
        error: 'Missing required fields',
        errors: missingFields.map(field => `${field} is required`),
      });
      return;
    }

    // Validate price and area
    const priceNum = parseFloat(price);
    const areaNum = parseFloat(area);

    if (isNaN(priceNum) || priceNum <= 0) {
      res.status(400).json({ error: 'Price must be a positive number' });
      return;
    }

    if (isNaN(areaNum) || areaNum <= 0) {
      res.status(400).json({ error: 'Area must be a positive number' });
      return;
    }

    // Validate status if provided
    if (status && !['available', 'sold', 'reserved'].includes(status)) {
      res.status(400).json({ error: 'Status must be one of: available, sold, reserved' });
      return;
    }

    // Create apartment
    const apartment = await Apartment.create({
      project,
      unit_name,
      unit_number,
      price: priceNum,
      area: areaNum,
      city,
      description,
      status: status || 'available',
    });

    res.status(201).json({ data: apartment });
  } catch (error: any) {
    // Handle Sequelize validation errors
    if (error instanceof ValidationError) {
      res.status(400).json({
        error: 'Validation error',
        errors: error.errors.map(e => e.message),
      });
      return;
    }

    // Handle unique constraint violation
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({
        error: 'An apartment with this project and unit number already exists',
      });
      return;
    }

    next(error);
  }
};
