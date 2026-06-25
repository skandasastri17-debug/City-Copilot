export type OpenAIDetectedPart = {
  part_num: string;
  color_name: string;
  quantity: number;
  confidence: number;
};

export type RebrickablePartSummary = {
  part_num: string;
  name: string;
  part_cat_id?: number;
  part_img_url?: string;
};

export type RebrickableColorSummary = {
  id: number;
  name: string;
};

export type RebrickableSetSummary = {
  set_num: string;
  name: string;
  year?: number;
  num_parts?: number;
  set_img_url?: string;
  set_url?: string;
  theme_id?: number;
  theme_name?: string;
};

export type RebrickableSetPart = {
  quantity: number;
  part: {
    part_num: string;
    name: string;
    part_cat_id?: number;
  };
  color: {
    id: number;
    name: string;
  };
};
