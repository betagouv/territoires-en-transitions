import {ActionDefinitionSummary} from 'core-logic/api/endpoints/ActionDefinitionSummaryReadEndpoint';
import {MouseEventHandler} from 'react';
import {ActionScore} from 'types/ClientScore';
import {YellowHighlight} from 'ui/Highlight';

export type TPointsPotentielsProps = {
  /** Définition de l'action */
  actionDef: ActionDefinitionSummary;
  /** Détail du score associé à l'action */
  actionScore: ActionScore;
  /** Fonction appelée quand le bouton Personnaliser est cliqué (le bouton ne
   * s'affiche pas si absent) */
  onEdit?: MouseEventHandler;
};

/** Affiche le potentiel de points (normal ou réduit) ainsi qu'un bouton
 * "Personnaliser" si nécessaire */
export const PointsPotentiels = ({
  actionDef,
  actionScore,
  onEdit,
}: TPointsPotentielsProps) => {
  return (
    <YellowHighlight>
      <div className="flex items-center">
        {getLabel(actionDef, actionScore)}
        {typeof onEdit === 'function' ? (
          <a
            className="fr-link fr-link--icon-left fr-fi-settings-line fr-ml-10v"
            href="#"
            onClick={onEdit}
          >
            Personnaliser
          </a>
        ) : null}
      </div>
    </YellowHighlight>
  );
};

const getLabel = (
  actionDef: ActionDefinitionSummary,
  actionScore: ActionScore
): string => {
  const {type} = actionDef;
  const {point_referentiel, point_potentiel_perso} = actionScore;

  const points =
    point_potentiel_perso.toLocaleString(undefined, {
      maximumFractionDigits: 1,
    }) + ' points';

  const isModified = point_potentiel_perso !== point_referentiel;
  if (isModified) {
    const modifLabel =
      point_potentiel_perso > point_referentiel ? 'augmenté' : 'réduit';
    return `Potentiel ${modifLabel} pour cette ${type} : ${points}`;
  }

  return `Potentiel pour cette ${type} : ${points}`;
};
