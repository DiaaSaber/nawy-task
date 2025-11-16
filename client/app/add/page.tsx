'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Alert,
  Typography,
  Snackbar,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createApartment, selectApartmentsLoading } from '../../store/apartmentsSlice';
import type { CreateApartmentInput } from '../../types/apartment';

export default function AddApartmentPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectApartmentsLoading);

  const [formData, setFormData] = useState<CreateApartmentInput>({
    project: '',
    unit_name: '',
    unit_number: '',
    price: 0,
    area: 0,
    city: '',
    description: '',
    status: 'available',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleChange = (field: keyof CreateApartmentInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.project.trim()) {
      newErrors.project = 'Project is required';
    }
    if (!formData.unit_name.trim()) {
      newErrors.unit_name = 'Unit name is required';
    }
    if (!formData.unit_number.trim()) {
      newErrors.unit_number = 'Unit number is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    if (formData.area <= 0) {
      newErrors.area = 'Area must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) {
      return;
    }

    try {
      const result = await dispatch(createApartment(formData)).unwrap();
      setSuccessMessage(true);
      
      // Redirect to the created apartment's page after a short delay
      setTimeout(() => {
        router.push(`/apartments/${result.data.id}`);
      }, 1500);
    } catch (error: any) {
      setSubmitError(
        error.error || error.message || 'Failed to create apartment. Please try again.'
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Apartment</h1>
        <p className="text-gray-600 mt-2">Fill in the details to list a new apartment</p>
      </div>

      {/* Error Alert */}
      {submitError && (
        <Alert severity="error" onClose={() => setSubmitError(null)}>
          {submitError}
        </Alert>
      )}

      {/* Success Snackbar */}
      <Snackbar
        open={successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Apartment created successfully! Redirecting...
        </Alert>
      </Snackbar>

      {/* Form Card */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Project */}
            <TextField
              label="Project *"
              placeholder="e.g., Palm Hills"
              value={formData.project}
              onChange={(e) => handleChange('project', e.target.value)}
              error={!!errors.project}
              helperText={errors.project}
              fullWidth
            />

            {/* Unit Name */}
            <TextField
              label="Unit Name *"
              placeholder="e.g., A-101"
              value={formData.unit_name}
              onChange={(e) => handleChange('unit_name', e.target.value)}
              error={!!errors.unit_name}
              helperText={errors.unit_name}
              fullWidth
            />

            {/* Unit Number */}
            <TextField
              label="Unit Number *"
              placeholder="e.g., 101"
              value={formData.unit_number}
              onChange={(e) => handleChange('unit_number', e.target.value)}
              error={!!errors.unit_number}
              helperText={errors.unit_number}
              fullWidth
            />

            {/* Price and Area */}
            <div className="grid grid-cols-2 gap-4">
              <TextField
                label="Price (EGP) *"
                type="number"
                placeholder="0"
                value={formData.price || ''}
                onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                error={!!errors.price}
                helperText={errors.price}
                fullWidth
              />

              <TextField
                label="Area (m²) *"
                type="number"
                placeholder="0"
                value={formData.area || ''}
                onChange={(e) => handleChange('area', parseFloat(e.target.value) || 0)}
                error={!!errors.area}
                helperText={errors.area}
                fullWidth
              />
            </div>

            {/* City */}
            <TextField
              label="City *"
              placeholder="e.g., Cairo"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              error={!!errors.city}
              helperText={errors.city}
              fullWidth
            />

            {/* Status */}
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => handleChange('status', e.target.value)}
              >
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="sold">Sold</MenuItem>
                <MenuItem value="reserved">Reserved</MenuItem>
              </Select>
            </FormControl>

            {/* Description */}
            <TextField
              label="Description"
              placeholder="Enter a detailed description of the apartment..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              multiline
              rows={4}
              fullWidth
            />

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                fullWidth
              >
                {loading ? 'Creating...' : 'Create Apartment'}
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => router.push('/')}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Typography variant="body2" color="textSecondary" className="text-center">
        * Required fields
      </Typography>
    </div>
  );
}
