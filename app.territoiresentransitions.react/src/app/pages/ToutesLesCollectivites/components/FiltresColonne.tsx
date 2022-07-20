import {
  DepartementFiltre,
  NiveauDeLabellisationCollectiviteFiltre,
  PopulationCollectiviteFiltre,
  ReferentielCollectiviteFiltre,
  RegionFiltre,
  TauxRemplissageCollectiviteFiltre,
  TypeCollectiviteFiltre,
} from 'app/pages/ToutesLesCollectivites/components/Filtres';
import type {TCollectivitesFilters} from 'app/pages/ToutesLesCollectivites/filtreLibelles';
import {RegionRead} from 'generated/dataLayer/region_read';
import {DepartementRead} from 'generated/dataLayer/departement_read';
import {InputSearch} from 'ui/UiSearchBar';

type UpdateFilters = (newFilters: TCollectivitesFilters) => void;

export const FiltresColonne = (props: {
  departments: DepartementRead[];
  regions: RegionRead[];
  filters: TCollectivitesFilters;
  setFilters: UpdateFilters;
}) => {
  return (
    <div className="flex flex-col gap-8">
      <InputSearch
        value={props.filters.nom || ''}
        placeholder="Rechercher par nom"
        onChange={e =>
          props.setFilters({...props.filters, nom: e.target.value})
        }
      />
      <RegionFiltre
        onChange={selected =>
          props.setFilters({...props.filters, regions: selected})
        }
        selected={props.filters.regions}
        regions={props.regions}
      />
      <DepartementFiltre
        onChange={selected =>
          props.setFilters({...props.filters, departments: selected})
        }
        selected={props.filters.departments}
        departements={props.departments}
        regionCodes={props.filters.regions}
      />
      <TypeCollectiviteFiltre
        onChange={selected =>
          props.setFilters({...props.filters, types: selected})
        }
        selected={props.filters.types}
      />
      <PopulationCollectiviteFiltre
        onChange={selected =>
          props.setFilters({...props.filters, population: selected})
        }
        selected={props.filters.population}
      />
      <ReferentielCollectiviteFiltre
        onChange={selected =>
          props.setFilters({...props.filters, referentiel: selected})
        }
        selected={props.filters.referentiel}
      />
      <NiveauDeLabellisationCollectiviteFiltre
        onChange={selected =>
          props.setFilters({...props.filters, niveauDeLabellisation: selected})
        }
        selected={props.filters.niveauDeLabellisation}
      />
      <TauxRemplissageCollectiviteFiltre
        onChange={selected =>
          props.setFilters({...props.filters, tauxDeRemplissage: selected})
        }
        selected={props.filters.tauxDeRemplissage}
      />
    </div>
  );
};
