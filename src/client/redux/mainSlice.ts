import { createSlice } from '@reduxjs/toolkit';
import { Character, Faction, Link, Node } from '../../types/data';

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
  selectedMapCharacters: Character[];
  selectedMapFactions: Faction[];
  selectedMapCharRelationships: Link[];
  selectedMapFactionRelationships: Link[];
}

const initialState: MainState = {
  user: { id: '', username: '' },
  selectedMap: null,
  selectedMapName: '',
  allMaps: [],
  activeModal: null,
  selectedMapData: { nodes: [], links: [] },
  selectedMapCharacters: [],
  selectedMapFactions: [],
  selectedMapCharRelationships: [],
  selectedMapFactionRelationships: [],
};

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    init: (state, action) => {
      state.user = action.payload.user;
      state.allMaps = action.payload.allMaps;
    },
    clearState: (state) => {
      state.user = { id: '', username: '' };
      state.selectedMap = null;
      state.selectedMapName = null;
      state.allMaps = [];
      state.activeModal = null;
      state.selectedMapData = { nodes: [], links: [] };
      state.selectedMapCharacters = [];
      state.selectedMapFactions = [];
      state.selectedMapCharRelationships = [];
      state.selectedMapFactionRelationships = [];
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
    setAllSelectedMapData: (state, action) => {
      state.selectedMapCharacters = action.payload.characters;
      state.selectedMapFactions = action.payload.factions;
      state.selectedMapCharRelationships = action.payload.charRelationships;
      state.selectedMapFactionRelationships =
        action.payload.factionRelationships;
    },
  },
});

export const {
  init,
  setUser,
  setAllMaps,
  clearState,
  setActiveModal,
  setSelectedMap,
  setSelectedMapName,
  setSelectedMapData,
  setAllSelectedMapData,
} = mainSlice.actions;
