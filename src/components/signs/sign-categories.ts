import type { SignCategory } from '@/types';

/**
 * Category names follow the Kinyarwanda groupings used by the source books
 * (IBYAPA BIBUZA / BITEGEKA / BIYOBORA). The English gloss is secondary — it
 * labels the interface, not the content.
 */
export const SIGN_CATEGORIES: {
  id: SignCategory;
  label: string;
  labelEn: string;
  description: string;
}[] = [
  {
    id: 'warning',
    label: 'Ibiburira',
    labelEn: 'Warning',
    description:
      'Ibyapa bya mpandeshatu biburira ko hari icyago imbere — gabanya umuvuduko witegure guhagarara.',
  },
  {
    id: 'prohibition',
    label: 'Ibibuza',
    labelEn: 'Prohibition',
    description:
      'Ibyapa byuzuye uruziga rufite umuzenguruko utukura, bibuza igikorwa cyangwa ubwoko bw’ikinyabiziga.',
  },
  {
    id: 'mandatory',
    label: 'Ibitegeka',
    labelEn: 'Mandatory',
    description: 'Ibyapa by’uruziga rw’ubururu bitegeka icyerekezo cyangwa igikorwa ugomba gukora.',
  },
  {
    id: 'regulatory',
    label: 'Uburenganzira bwo gutambuka',
    labelEn: 'Priority',
    description:
      'Ibyapa byerekana uwutambuka mbere: hagarara (STOP), tanga inzira, n’uburenganzira ku muhanda.',
  },
  {
    id: 'information',
    label: 'Ibiyobora',
    labelEn: 'Information',
    description: 'Ibyapa bikumenyesha ibiri imbere: serivisi, ubwoko bw’umuhanda n’icyerekezo.',
  },
  {
    id: 'temporary',
    label: 'Iby’agateganyo',
    labelEn: 'Temporary',
    description:
      'Ibyapa bishyirwa aho hakorwa imirimo yo mu muhanda; birusha agaciro ibyapa bisanzwe bisimbura.',
  },
];

const BY_ID = new Map(SIGN_CATEGORIES.map((c) => [c.id, c]));

/** Kinyarwanda name — the one shown to learners. */
export const categoryLabel = (id: SignCategory) => BY_ID.get(id)?.label ?? id;

/** English gloss, used as supporting text in the interface. */
export const categoryLabelEn = (id: SignCategory) => BY_ID.get(id)?.labelEn ?? id;

export const categoryDescription = (id: SignCategory) => BY_ID.get(id)?.description ?? '';
