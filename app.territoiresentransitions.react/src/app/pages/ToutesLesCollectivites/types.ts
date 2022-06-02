import {TypeCollectiviteCarteRead} from 'generated/dataLayer/collectivite_carte_read';

export type TSelectOption<T extends string> = {
  id: T;
  libelle: string;
};

export type TTypeFiltreOption = TypeCollectiviteCarteRead;
export type TPopulationFiltreOption =
  | '0-20000'
  | '20000-50000'
  | '50000-100000'
  | '100000-200000'
  | 'plus-de-200000';

export type TNiveauLabellisationFiltreOption =
  | 'NL'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5';

export type TReferentielFiltreOption = 'eci' | 'cae';

export type TTauxRemplissageFiltreOption =
  | '0'
  | '1-49'
  | '50-79'
  | '80-99'
  | '100';

export type TRealiseCourantFiltreOption =
  | '0-34'
  | '35-49'
  | '50-64'
  | '65-74'
  | '75-100';

export type TTrierParFiltreOption = 'score' | 'completude' | 'nom';