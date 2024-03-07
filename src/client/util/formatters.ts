import { Node, Link } from '../redux/mainSlice';

export interface Status {
  statusSender: string;
  statusRecipient: string;
  statusName: string;
}

export interface Character {
  attributes: {};
  statuses: Status[];
  faction: string;
  charName: string;
  charDescriptor: string;
}

export const formatFactions = (factions: string[]) => {
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
        source: status.statusSender,
        target: status.statusRecipient,
        distance: 100,
      });
    });

    links.push({
      source: char.faction,
      target: char.charName,
      distance: 100,
    });

    return {
      id: char.charName,
      name: char.charName,
      color: '#d3d3d3',
      attributes: char.attributes,
      statuses: char.statuses,
      faction: char.faction,
    };
  });
};
