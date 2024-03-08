import { Node, Link, Data } from '../../types/data';
import { Character, Status, Faction, FactionStatus } from '../../types/data';

export const formatFactions = (factions: Faction[], nodes: Node[]) => {
  factions.forEach((faction: string) => {
    nodes.push({
      id: faction,
      name: faction,
      color: '#d3d3d3',
      height: 100,
      size: 35,
    });
  });
};

export const formatFactionStatuses = (
  factionStatuses: FactionStatus[],
  links: Link[],
) => {
  for (let i = 0; i < factionStatuses.length; i++) {
    if (!factionStatuses[i].sender_name || !factionStatuses[i].recipient_name)
      continue;
    links.push({
      source: factionStatuses[i].sender_name || '',
      target: factionStatuses[i].recipient_name || '',
      status: factionStatuses[i].status_name || '',
      distance: 100,
    });
  }
};

export const formatCharacters = (
  chars: Character[],
  links: Link[],
  nodes: Node[],
) => {
  chars.forEach((char: Character) => {
    for (let i = 0; i < char.statuses.length; i++) {
      if (!char.statuses[i].recipient || !char.statuses[i].status_name)
        continue;
      links.push({
        source: char.character_name || '',
        target: char.statuses[i].recipient || '',
        status: char.statuses[i].status_name || '',
        distance: 50,
      });
    }

    nodes.push({
      id: char.character_name,
      name: char.character_name,
      color: char.attr_value?.color || '#d3d3d3',
      height: 100,
      size: 25,
      attributes: char.attr_value,
      statuses: char.statuses,
      faction: char.faction_name,
      description: char.character_descriptor,
    });
  });
};

export const formatAll = (data: Data) => {
  const { factions, chars, factionStatuses } = data;
  const nodes: Node[] = [];
  const links: Link[] = [];
  console.log(data);
  formatFactions(factions, nodes);
  //! commented for now due to a problem with the input data
  formatFactionStatuses(factionStatuses, links);
  formatCharacters(chars, links, nodes);
  return { nodes, links };
};
