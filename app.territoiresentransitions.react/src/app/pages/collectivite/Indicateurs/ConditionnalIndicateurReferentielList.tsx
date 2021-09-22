import {indicateurs} from 'generated/data/indicateurs_referentiels';
import {IndicateurReferentielCard} from './AnyIndicateurCard';
import {Referentiel} from 'types';

/**
 * Display the list of indicateurs for a given referentiel
 */
export const ConditionnalIndicateurReferentielList = (props: {
  referentiel: Referentiel;
  showOnlyIndicateurWithData: boolean;
}) => {
  const filtered = indicateurs.filter(indicateur => {
    return indicateur.id.startsWith(props.referentiel);
  });

  return (
    <div className="app mx-5 mt-5">
      <section className="flex flex-col">
        {filtered.map(indicateur => {
          return (
            <IndicateurReferentielCard
              indicateur={indicateur}
              key={indicateur.uid}
              hideIfNoValues={props.showOnlyIndicateurWithData}
            />
          );
        })}
      </section>
    </div>
  );
};
