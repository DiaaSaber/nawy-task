'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardActions,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress,
  Alert,
  Box,
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchApartments,
  selectApartments,
  selectApartmentsMeta,
  selectApartmentsFilters,
  selectApartmentsLoading,
  selectApartmentsError,
  setSearch,
  setMinPrice,
  setMaxPrice,
  setSort,
  setPage,
} from '../store/apartmentsSlice';

export default function HomePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const apartments = useAppSelector(selectApartments);
  const meta = useAppSelector(selectApartmentsMeta);
  const filters = useAppSelector(selectApartmentsFilters);
  const loading = useAppSelector(selectApartmentsLoading);
  const error = useAppSelector(selectApartmentsError);

  // Local state for input fields
  const [searchInput, setSearchInput] = useState(filters.search);
  const [minPriceInput, setMinPriceInput] = useState(filters.min_price?.toString() || '');
  const [maxPriceInput, setMaxPriceInput] = useState(filters.max_price?.toString() || '');

  // Fetch apartments on mount and when filters change
  useEffect(() => {
    dispatch(fetchApartments());
  }, [dispatch, filters]);

  const handleApplyFilters = () => {
    dispatch(setSearch(searchInput));
    dispatch(setMinPrice(minPriceInput ? parseFloat(minPriceInput) : undefined));
    dispatch(setMaxPrice(maxPriceInput ? parseFloat(maxPriceInput) : undefined));
  };

  const handleSortChange = (value: string) => {
    dispatch(setSort(value as 'newest' | 'price_asc' | 'price_desc'));
  };

  const handlePrevPage = () => {
    if (meta && meta.page > 1) {
      dispatch(setPage(meta.page - 1));
    }
  };

  const handleNextPage = () => {
    if (meta && meta.page < meta.total_pages) {
      dispatch(setPage(meta.page + 1));
    }
  };

  const handleViewDetails = (id: number) => {
    router.push(`/apartments/${id}`);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', { minimumFractionDigits: 0 }) + ' EGP';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'sold':
        return 'error';
      case 'reserved':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Apartments Listings</h1>
        <p className="text-gray-600 mt-2">Browse available apartments and find your perfect home</p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <TextField
              label="Search"
              placeholder="Project, unit name, or number"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleApplyFilters();
                }
              }}
              fullWidth
              size="small"
            />

            {/* Min Price */}
            <TextField
              label="Min Price"
              type="number"
              placeholder="0"
              value={minPriceInput}
              onChange={(e) => setMinPriceInput(e.target.value)}
              fullWidth
              size="small"
            />

            {/* Max Price */}
            <TextField
              label="Max Price"
              type="number"
              placeholder="0"
              value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(e.target.value)}
              fullWidth
              size="small"
            />

            {/* Sort */}
            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={filters.sort}
                label="Sort By"
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="price_asc">Price: Low to High</MenuItem>
                <MenuItem value="price_desc">Price: High to Low</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="mt-4">
            <Button variant="contained" onClick={handleApplyFilters} disabled={loading}>
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Box className="flex justify-center py-12">
          <CircularProgress />
        </Box>
      )}

      {/* Apartments Grid */}
      {!loading && apartments.length === 0 && (
        <Box className="text-center py-12">
          <Typography variant="h6" color="textSecondary">
            No apartments found. Try adjusting your filters.
          </Typography>
        </Box>
      )}

      {!loading && apartments.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {apartments.map((apartment) => (
              <Card key={apartment.id} className="flex flex-col h-full">
                <CardContent className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <Typography variant="h6" component="h2" className="font-semibold">
                      {apartment.project}
                    </Typography>
                    <Chip
                      label={apartment.status.toUpperCase()}
                      color={getStatusColor(apartment.status) as any}
                      size="small"
                    />
                  </div>

                  <Typography variant="body2" color="textSecondary" className="mb-2">
                    {apartment.unit_name} • Unit #{apartment.unit_number}
                  </Typography>

                  <Typography variant="body2" color="textSecondary" className="mb-3">
                    📍 {apartment.city}
                  </Typography>

                  <div className="space-y-1">
                    <Typography variant="h5" className="font-bold text-blue-600">
                      {formatPrice(apartment.price)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      📐 {apartment.area} m²
                    </Typography>
                  </div>

                  {apartment.description && (
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      className="mt-3"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {apartment.description}
                    </Typography>
                  )}
                </CardContent>

                <CardActions className="p-4 pt-0">
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => handleViewDetails(apartment.id)}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.total_pages > 1 && (
            <Box className="flex justify-center items-center gap-4 mt-8">
              <Button
                variant="outlined"
                onClick={handlePrevPage}
                disabled={meta.page <= 1 || loading}
              >
                Previous
              </Button>

              <Typography variant="body1">
                Page {meta.page} of {meta.total_pages} ({meta.total} total)
              </Typography>

              <Button
                variant="outlined"
                onClick={handleNextPage}
                disabled={meta.page >= meta.total_pages || loading}
              >
                Next
              </Button>
            </Box>
          )}
        </>
      )}
    </div>
  );
}
