import type {ActionReferentiel} from 'generated/models/action_referentiel';
import {thematiques} from 'generated/data/thematiques';
import * as R from 'ramda';

import 'app/pages/collectivite/Referentiels/ArrowExpandable.css';
import {ActionReferentielTitleCard} from 'ui/referentiels';
import {LazyDetails} from 'ui/shared/LazyDetails';
import {Chevron} from 'ui/shared/Chevron';
import {useState} from 'react';

const ThematiqueSectionCombined = ({
  eciActions,
  caeActions,
  thematiqueName,
}: {
  eciActions: ActionReferentiel[];
  caeActions: ActionReferentiel[];
  thematiqueName: string;
}) => {
  const [opened, setOpened] = useState(false);
  return (
    <LazyDetails
      summary={
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h3 className="flex items-center mr-6 mb-4">{thematiqueName}</h3>
            <Chevron direction={opened ? 'down' : 'left'} />
          </div>
        </div>
      }
      onChange={opened => {
        setOpened(opened);
      }}
    >
      <div className=" ml-8 mb-6">
        {[...eciActions, ...caeActions].map(action => (
          <ActionReferentielTitleCard key={action.id} action={action} />
        ))}
      </div>
    </LazyDetails>
  );
};

export const ReferentielCombinedByThematique = ({
  caeActions,
  eciActions,
}: {
  caeActions: ActionReferentiel[];
  eciActions: ActionReferentiel[];
}) => {
  const eciActionsGroupedByThematique = R.groupBy(
    action => action.thematique_id,
    eciActions
  );
  const caeActionsGroupedByThematique = R.groupBy(
    action => action.thematique_id,
    caeActions
  );
  return (
    <section>
      {thematiques.map(thematique => {
        if (thematique.id === 'eci') return null;
        return (
          <ThematiqueSectionCombined
            key={thematique.id}
            thematiqueName={thematique.name}
            eciActions={eciActionsGroupedByThematique[thematique.id] ?? []}
            caeActions={caeActionsGroupedByThematique[thematique.id] ?? []}
          />
        );
      })}
    </section>
  );
};
