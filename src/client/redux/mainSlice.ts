import { createSlice } from '@reduxjs/toolkit';
import { Link, Node } from '../../types/data';

const testmap: MapData = {
  id: 'testmap',
  name: 'Test Map',
  nodes: [
    { id: 'node1', height: 20, size: 20, color: '#d3d3d3' },
    { id: 'node2', height: 20, size: 20, color: '#d3d3d3' },
  ],
  links: [
    { source: 'node1', target: 'node2', distance: 100, status: 'positive' },
    { source: 'node2', target: 'node1', distance: 100, status: 'positive' },
  ],
};

interface MapData {
  id: string;
  name: string;
  nodes?: Node[];
  links?: Link[];
}

interface MainState {
  user: { id: string; name: string };
  selectedMap: MapData | null;
  allMaps: MapData[];
}

const initialState: MainState = {
  user: { id: '', name: '' },
  selectedMap: null,
  allMaps: [{ id: '', name: '', nodes: [], links: [] }],
};

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    setAllMaps: (state, action) => {
      state.allMaps = action.payload;
    },
    setSelectedMap: (state, action) => {
      state.selectedMap = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    init: (state, action) => {
      state.user = action.payload.user;
      state.allMaps = action.payload.allMaps;
    },
  },
});

export const { setAllMaps, setSelectedMap, setUser, init } = mainSlice.actions;
