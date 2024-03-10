export type Character = {
  character_id: string;
  character_name: string;
  faction_id: string;
  map_id: string;
  character_descriptor: string;
  attr_value: { [key: string]: any } | null;
  statuses: {
    status_name: string | null;
    recipient: string | null;
  }[];
  faction_name: string | null;
};

export type FactionStatus = {
  faction_stat_id: string;
  status_id: string;
  faction_sender: string;
  faction_recipient: string;
  sender_name: string;
  recipient_name: string;
  status_name: string;
};

export type Data = {
  chars: Character[];
  factions: Faction[];
  factionStatuses: FactionStatus[];
};

export interface Status {
  status_name: string | null;
  recipient: string | null;
}

export type Faction = {
  faction_id: string;
  faction_name: string;
};

export interface Node {
  id: string;
  height: number;
  size: number;
  color: string;
  name?: string;
  attributes?: { [key: string]: any } | null;
  statuses?: Status[];
  faction?: string | null;
  description?: string | null;
  type?: string;
}

export interface Link {
  source: string;
  target: string;
  distance: number;
  status?: string;
  sender_id?: string;
  recipient_id?: string;
  status_id?: string;
  faction_stat_id?: string;
}
