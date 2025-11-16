import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../lib/api';
import type {
  Apartment,
  ApartmentsMeta,
  ApartmentsListResponse,
  ApartmentSingleResponse,
  CreateApartmentInput,
} from '../types/apartment';
import type { RootState } from './index';

interface ApartmentsFilters {
  search: string;
  min_price?: number;
  max_price?: number;
  sort: 'newest' | 'price_asc' | 'price_desc';
  page: number;
  page_size: number;
}

interface ApartmentsState {
  items: Apartment[];
  selected: Apartment | null;
  loading: boolean;
  error: string | null;
  meta: ApartmentsMeta | null;
  filters: ApartmentsFilters;
}

const initialState: ApartmentsState = {
  items: [],
  selected: null,
  loading: false,
  error: null,
  meta: null,
  filters: {
    search: '',
    sort: 'newest',
    page: 1,
    page_size: 10,
  },
};

// Thunks
export const fetchApartments = createAsyncThunk<
  ApartmentsListResponse,
  void,
  { state: RootState }
>('apartments/fetchApartments', async (_, { getState }) => {
  const { filters } = getState().apartments;
  
  const params: Record<string, string> = {
    page: filters.page.toString(),
    page_size: filters.page_size.toString(),
    sort: filters.sort,
  };

  if (filters.search) {
    params.search = filters.search;
  }
  if (filters.min_price !== undefined) {
    params.min_price = filters.min_price.toString();
  }
  if (filters.max_price !== undefined) {
    params.max_price = filters.max_price.toString();
  }

  const response = await api.get<ApartmentsListResponse>('/apartments', { params });
  return response.data;
});

export const fetchApartmentById = createAsyncThunk<
  ApartmentSingleResponse,
  { id: string | number }
>('apartments/fetchApartmentById', async ({ id }) => {
  const response = await api.get<ApartmentSingleResponse>(`/apartments/${id}`);
  return response.data;
});

export const createApartment = createAsyncThunk<
  ApartmentSingleResponse,
  CreateApartmentInput
>('apartments/createApartment', async (input, { rejectWithValue }) => {
  try {
    const response = await api.post<ApartmentSingleResponse>('/apartments', input);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return rejectWithValue(error.response.data);
    }
    throw error;
  }
});

// Slice
const apartmentsSlice = createSlice({
  name: 'apartments',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
      state.filters.page = 1; // Reset to page 1 when search changes
    },
    setMinPrice: (state, action: PayloadAction<number | undefined>) => {
      state.filters.min_price = action.payload;
      state.filters.page = 1;
    },
    setMaxPrice: (state, action: PayloadAction<number | undefined>) => {
      state.filters.max_price = action.payload;
      state.filters.page = 1;
    },
    setSort: (state, action: PayloadAction<'newest' | 'price_asc' | 'price_desc'>) => {
      state.filters.sort = action.payload;
      state.filters.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.filters.page_size = action.payload;
      state.filters.page = 1;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearSelected: (state) => {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    // fetchApartments
    builder
      .addCase(fetchApartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApartments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchApartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch apartments';
      });

    // fetchApartmentById
    builder
      .addCase(fetchApartmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApartmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload.data;
      })
      .addCase(fetchApartmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch apartment';
      });

    // createApartment
    builder
      .addCase(createApartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createApartment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createApartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create apartment';
      });
  },
});

// Actions
export const {
  setSearch,
  setMinPrice,
  setMaxPrice,
  setSort,
  setPage,
  setPageSize,
  resetFilters,
  clearSelected,
} = apartmentsSlice.actions;

// Selectors
export const selectApartments = (state: RootState) => state.apartments.items;
export const selectApartmentsMeta = (state: RootState) => state.apartments.meta;
export const selectApartmentsFilters = (state: RootState) => state.apartments.filters;
export const selectApartmentsLoading = (state: RootState) => state.apartments.loading;
export const selectApartmentsError = (state: RootState) => state.apartments.error;
export const selectSelectedApartment = (state: RootState) => state.apartments.selected;

export default apartmentsSlice.reducer;
