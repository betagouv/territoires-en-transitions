import {
  useAllFiches,
  useAllStorables,
  useEpciId,
  useStorable,
} from 'core-logic/hooks';
import {PlanActionStorable} from 'storables/PlanActionStorable';
import {planActionStore} from 'core-logic/api/hybridStores';
import {useParams} from 'react-router-dom';
import {Chip} from '@material-ui/core';
import {Categorie, PlanActionTyped} from 'types/PlanActionTypedInterface';
import {FicheAction} from 'generated/models/fiche_action';
import {compareIndexes} from 'utils';
import {FicheCard} from 'app/pages/collectivite/PlanActions/FicheCard';

interface CategorizedFiches {
  fiches: FicheAction[];
  categorie: Categorie;
}

function categorizeAndSortFiches(
  allFiches: FicheAction[],
  plan: PlanActionTyped
): CategorizedFiches[] {
  // step 1: sort categories - todo should have a default category.
  const categories = [...plan.categories];
  categories.sort((a, b) => compareIndexes(a.nom, b.nom));
  return plan.categories.map((categorie: Categorie) => {
    // step 2: find fiches
    const fiches = categorie.children
      .map(ficheId => allFiches.find(f => f.uid === ficheId))
      .filter(fiche => fiche !== undefined) as FicheAction[];
    // step 3: sort fiches
    fiches.sort((a, b) => compareIndexes(a.titre, b.titre));
    fiches.sort((a, b) => compareIndexes(a.custom_id, b.custom_id));
    return {
      categorie: categorie,
      fiches: fiches,
    };
  });
}

function PlanNavChip(props: {
  epciId: string;
  planId: string;
  planNom: string;
  active: boolean;
}) {
  return (
    <div className="mr-2">
      <Chip
        label={props.planNom}
        component="a"
        href={`/collectivite/${props.epciId}/referentiel/${props.planId}`}
        color={props.active ? 'primary' : 'default'}
        clickable
      />
    </div>
  );
}

function PlanNav() {
  const {epciId, planUid} = useParams<{epciId: string; planUid: string}>();
  const plans = useAllStorables<PlanActionStorable>(planActionStore);
  plans.sort((a, b) => a.nom.localeCompare(b.nom));

  return (
    <nav>
      {plans.map(plan => (
        <PlanNavChip
          epciId={epciId}
          planId={plan.id}
          planNom={plan.nom}
          active={plan.uid === planUid}
        />
      ))}
    </nav>
  );
}

function ModificationDialogButton(props: {categorie: Categorie}) {
  return <div>todo modif</div>;
}

function CategoryTitle(props: {categorie: Categorie; editable: boolean}) {
  return (
    <div className="flex flex-col w-full ">
      <div className="flex flex-row justify-between">
        <h3 className="text-2xl">
          {props.categorie.nom}
          <span className="fr-fi-arrow-right-s-line ml-10" aria-hidden={true} />
        </h3>
        {props.editable && (
          <ModificationDialogButton categorie={props.categorie} />
        )}
      </div>
    </div>
  );
}

function Plan(props: {plan: PlanActionTyped}) {
  const epciId = useEpciId()!;
  const fiches = useAllFiches(epciId);
  const sorted = categorizeAndSortFiches(fiches, props.plan);

  return (
    <>
      {sorted.map(categorized => {
        return (
          <div key={categorized.categorie.uid}>
            <CategoryTitle categorie={categorized.categorie} editable={true} />
            {categorized.fiches.map(fiche => {
              return (
                <div className="ml-5 mt-3">
                  <FicheCard fiche={fiche} />
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
}

const PlanActions = function () {
  const {epciId, planUid} = useParams<{epciId: string; planUid: string}>();
  const planId = PlanActionStorable.buildId(epciId, planUid);
  const plan = useStorable<PlanActionStorable>(planId, planActionStore);

  return (
    <main className="fr-container mt-9 mb-16">
      <h1 className="fr-h1 mb-3">Plans d'action</h1>
      <PlanNav />
      {plan && <Plan plan={plan as PlanActionTyped} />}
    </main>
  );
};

export default PlanActions;
