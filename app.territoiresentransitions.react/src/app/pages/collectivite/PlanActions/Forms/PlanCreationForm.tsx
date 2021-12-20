import {LabeledTextInput} from 'ui';
import {useState} from 'react';
import {commands} from 'core-logic/commands';
import {useCollectiviteId} from 'core-logic/hooks';

export const PlanCreationForm = (props: {onSave: () => void}) => {
  const [nom, setNom] = useState<string>('');
  const collectiviteId = useCollectiviteId()!;

  const handleSave = async () => {
    if (!nom) return;
    await commands.plansCommands.createPlanAction(collectiviteId, nom);
    props.onSave();
  };

  return (
    <div>
      <LabeledTextInput
        label="Nom du plan d'actions"
        maxLength={100}
        value={nom}
        onChange={event => {
          setNom(event.target.value);
        }}
      />
      <div className="flex flex-row-reverse p-5">
        <button
          className="fr-btn"
          onClick={e => {
            e.preventDefault();
            handleSave();
          }}
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
};
