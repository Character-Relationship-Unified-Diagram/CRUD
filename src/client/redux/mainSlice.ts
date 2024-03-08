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
  user: { id: string; username: string };
  selectedMap: '' | null;
  selectedMapName: string | null;
  allMaps: MapData[];
  activeModal: number | null;
  selectedMapData: { nodes: Node[]; links: Link[] };
}

const initialState: MainState = {
  user: { id: '', username: '' },
  selectedMap: null,
  selectedMapName: '',
  allMaps: [],
  activeModal: null,
  selectedMapData: { nodes: [], links: [] },
};

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    init: (state, action) => {
      state.user = action.payload.user;
      state.allMaps = action.payload.allMaps;
    },
    setAllMaps: (state, action) => {
      state.allMaps = action.payload;
    },
    setSelectedMap: (state, action) => {
      state.selectedMap = action.payload;
    },
    setSelectedMapName: (state, action) => {
      state.selectedMapName = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setActiveModal: (state, action) => {
      state.activeModal = action.payload;
    },
    setSelectedMapData: (state, action) => {
      state.selectedMapData = action.payload;
    },
  },
});

export const {
  init,
  setUser,
  setAllMaps,
  setActiveModal,
  setSelectedMap,
  setSelectedMapName,
  setSelectedMapData,
} = mainSlice.actions;
