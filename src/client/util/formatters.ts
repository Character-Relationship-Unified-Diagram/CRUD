import { Node, Link } from '../redux/mainSlice';
import { Character, Status, Faction } from '../../types/data';

export const formatFactions = (factions: Faction[]) => {
  factions.map((faction: string) => {
    return {
      id: faction,
      name: faction,
      color: '#d3d3d3',
    };
  });
};

export const formatCharacters = (chars: Character[], links: Link[]) => {
  chars.map((char: Character) => {
    char.statuses.forEach((status: Status) => {
      links.push({
        source: status.status_name || '',
        target: status.recipient || '',
        distance: 100,
      });
    });

    links.push({
      source: char.faction_name || '',
      target: char.character_name || '',
      distance: 100,
    });

    return {
      id: char.character_name,
      name: char.character_name,
      color: '#d3d3d3',
      attributes: char.attr_value,
      statuses: char.statuses,
      faction: char.faction_name,
    };
  });
};
