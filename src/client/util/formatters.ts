import { Node, Link, Data } from '../../types/data';
import { Character, Faction, FactionStatus } from '../../types/data';

export const formatFactions = (factions: Faction[], nodes: Node[]) => {
  for (let i = 0; i < factions.length; i++) {
    const faction = factions[i];
    if (!faction.faction_name.length) continue;
    nodes.push({
      id: faction.faction_id,
      name: faction.faction_name,
      color: '#d3d3d3',
      height: 100,
      size: 35,
      type: 'faction',
    });
  }
  return nodes;
};

export const formatFactionStatuses = (
  factionStatuses: FactionStatus[],
  links: Link[],
) => {
  console.log(factionStatuses);
  for (let i = 0; i < factionStatuses.length; i++) {
    if (!factionStatuses[i].faction_sender || !factionStatuses[i].faction_recipient)
      continue;
    links.push({
      source: factionStatuses[i].faction_sender,
      target: factionStatuses[i].faction_recipient,
      status: factionStatuses[i].status_name,
      distance: 200,
    });
  }

  return links;
};

export const formatCharacters = (
  chars: Character[],
  links: Link[],
  nodes: Node[],
) => {
  const allCharacterRelations: Link[] = [];
  chars.forEach((char: Character) => {
    for (let i = 0; i < char.statuses.length; i++) {
      if (!char.statuses[i].recipient || !char.statuses[i].status_name)
        continue;
      links.push({
        source: char.character_name || '',
        target: char.statuses[i].recipient || '',
        status: char.statuses[i].status_name || '',
        distance: 150,
      });

      allCharacterRelations.push({
        source: char.character_name || '',
        target: char.statuses[i].recipient || '',
        status: char.statuses[i].status_name || '',
        distance: 150,
      });
    }

    if (char?.faction_name) {
      links.push({
        source: char.character_name,
        target: char.faction_id,
        status: 'positive',
        distance: 150,
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
      type: 'character',
    });
  });

  return { links, nodes, allCharacterRelations };
};

export const formatAll = (data: Data) => {
  const { factions, chars, factionStatuses } = data;
  const nodes: Node[] = [];
  const links: Link[] = [];

  console.log(data);
  formatFactions(factions, nodes);
  const allfactionRelations = formatFactionStatuses(factionStatuses, links);
  const { allCharacterRelations } = formatCharacters(chars, links, nodes);

  return {
    nodes,
    links,
    factions,
    characters: chars,
    factionRelationships: allfactionRelations,
    charRelationships: allCharacterRelations,
  };
};
