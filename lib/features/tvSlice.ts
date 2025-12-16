import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// --- Types ---
export interface Video {
  id: string;
  title: string;
  url: string;
  thumb: string;
  isLive: boolean;
  author: string;
  views: string;
  rating: number;
  time: string;
}

interface TvState {
  items: Video[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  selectedVideo: Video | null;
  filter: string;
}

const initialState: TvState = {
  items: [],
  status: 'idle',
  error: null,
  selectedVideo: null,
  filter: 'All',
};

// --- Mock Data ---
const MOCK_VIDEOS: Video[] = [
  { id: '1', title: "Neon City Drive - Synthwave Mix 2025", author: "RetroVibes", views: "1.2M", time: "45:20", isLive: true, thumb: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=600", url: "", rating: 4.9 },
  { id: '2', title: "Coding a 3D Game Engine in Python", author: "DevMaster", views: "856K", time: "12:45", isLive: false, thumb: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600", url: "", rating: 4.7 },
  { id: '3', title: "Top 10 Cyberpunk Hidden Gems", author: "GlitchHunter", views: "2.4M", time: "8:30", isLive: false, thumb: "https://images.unsplash.com/photo-1535378437327-b7149236addf?auto=format&fit=crop&q=80&w=600", url: "", rating: 4.5 },
  { id: '4', title: "Live: Space Station View Earth", author: "NASA Stream", views: "15k", time: "LIVE", isLive: true, thumb: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600", url: "", rating: 5.0 },
  { id: '5', title: "Lo-Fi Beats to Study/Chill To", author: "ChillHop", views: "45K", time: "LIVE", isLive: true, thumb: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&q=80&w=600", url: "", rating: 4.8 },
  { id: '6', title: "Abstract Fluid Art Tutorial", author: "CreativeFlow", views: "320K", time: "15:10", isLive: false, thumb: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=600", url: "", rating: 4.6 },
  { id: '7', title: "Mechanical Keyboard ASMR", author: "ClickClack", views: "1.1M", time: "22:15", isLive: false, thumb: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=600", url: "", rating: 4.4 },
  { id: '8', title: "Future Tech Showcase 2024", author: "TechDaily", views: "89K", time: "10:05", isLive: false, thumb: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600", url: "", rating: 4.2 },
];

export const fetchChannels = createAsyncThunk('tv/fetchChannels', async (page: number = 1) => {
  // Simulate API delay
  const data = await fetch("/api/videos?page=" + page);
  const json = await data.json();
  return json.data;
});

const tvSlice = createSlice({
  name: 'tv',
  initialState,
  reducers: {
    setSelectedVideo: (state, action: PayloadAction<Video | null>) => {
      state.selectedVideo = action.payload;
    },
    setFilter: (state, action: PayloadAction<string>) => {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch';
      });
  },
});

export const { setSelectedVideo, setFilter } = tvSlice.actions;

export default tvSlice.reducer;