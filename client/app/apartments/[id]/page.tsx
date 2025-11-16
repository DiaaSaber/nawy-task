'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  fetchApartmentById,
  selectSelectedApartment,
  selectApartmentsLoading,
  selectApartmentsError,
  clearSelected,
} from '../../../store/apartmentsSlice';

export default function ApartmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const apartment = useAppSelector(selectSelectedApartment);
  const loading = useAppSelector(selectApartmentsLoading);
  const error = useAppSelector(selectApartmentsError);

  useEffect(() => {
    if (params.id) {
      dispatch(fetchApartmentById({ id: params.id as string }));
    }

    return () => {
      dispatch(clearSelected());
    };
  }, [dispatch, params.id]);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center py-12">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert severity="error">{error}</Alert>
        <Button variant="contained" onClick={() => router.push('/')}>
          Back to Listings
        </Button>
      </div>
    );
  }

  if (!apartment) {
    return (
      <div className="space-y-4">
        <Alert severity="warning">Apartment not found</Alert>
        <Button variant="contained" onClick={() => router.push('/')}>
          Back to Listings
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back Button */}
      <Button variant="outlined" onClick={() => router.push('/')}>
        ← Back to Listings
      </Button>

      {/* Main Card */}
      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <Typography variant="h4" component="h1" className="font-bold mb-2">
                {apartment.project}
              </Typography>
              <Typography variant="h6" color="textSecondary">
                {apartment.unit_name} • Unit #{apartment.unit_number}
              </Typography>
            </div>
            <Chip
              label={apartment.status.toUpperCase()}
              color={getStatusColor(apartment.status) as any}
              size="medium"
            />
          </div>

          <Divider />

          {/* Price and Area */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Typography variant="body2" color="textSecondary" className="mb-1">
                Price
              </Typography>
              <Typography variant="h4" className="font-bold text-blue-600">
                {formatPrice(apartment.price)}
              </Typography>
            </div>
            <div>
              <Typography variant="body2" color="textSecondary" className="mb-1">
                Area
              </Typography>
              <Typography variant="h4" className="font-bold">
                {apartment.area} m²
              </Typography>
            </div>
          </div>

          <Divider />

          {/* Location */}
          <div>
            <Typography variant="body2" color="textSecondary" className="mb-1">
              Location
            </Typography>
            <Typography variant="h6">📍 {apartment.city}</Typography>
          </div>

          {/* Description */}
          {apartment.description && (
            <>
              <Divider />
              <div>
                <Typography variant="body2" color="textSecondary" className="mb-2">
                  Description
                </Typography>
                <Typography variant="body1">{apartment.description}</Typography>
              </div>
            </>
          )}

          <Divider />

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Typography variant="body2" color="textSecondary">
                Created
              </Typography>
              <Typography variant="body2">{formatDate(apartment.created_at)}</Typography>
            </div>
            <div>
              <Typography variant="body2" color="textSecondary">
                Last Updated
              </Typography>
              <Typography variant="body2">{formatDate(apartment.updated_at)}</Typography>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
