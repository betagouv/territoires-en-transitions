import React from 'react';
import {IndicateurPersonnaliseStorable} from 'storables/IndicateurPersonnaliseStorable';
import {commands} from 'core-logic/commands';
import {
  indicateurPersonnaliseResultatStore,
  indicateurPersonnaliseObjectifStore,
} from 'core-logic/api/hybridStores';
import {IndicateurPersonnaliseTypedInterface} from 'types/IndicateurPersonnaliseMetaTypedInterface';
import {AnyIndicateurLineChartExpandable} from './AnyIndicateurLineChartExpandable';
import {AnyIndicateurEditableExpandPanel} from 'app/pages/collectivite/Indicateurs/AnyIndicateurValues';
import {IndicateurDescriptionPanel} from 'app/pages/collectivite/Indicateurs/IndicateurDescriptionPanel';

const IndicateurPersonnaliseCommentaire = (props: {
  indicateur: IndicateurPersonnaliseTypedInterface;
}) => {
  const [value, setValue] = React.useState(props.indicateur.meta.commentaire);
  const [initialValue, setInitialValue] = React.useState(
    props.indicateur.meta.commentaire
  );
  if (props.indicateur.meta.commentaire !== initialValue) {
    // We use an initial value to update the field value on indicateur change.
    setValue(props.indicateur.meta.commentaire);
    setInitialValue(props.indicateur.meta.commentaire);
  }

  function handleChange(event: React.FormEvent<HTMLTextAreaElement>) {
    const inputValue = event.currentTarget.value;
    setValue(inputValue);
  }

  function handleSave(event: React.FormEvent<HTMLTextAreaElement>) {
    const inputValue = event.currentTarget.value;
    const data = {
      ...props.indicateur,
    };
    data.meta['commentaire'] = inputValue;
    commands.indicateurCommands
      .storeIndicateurPersonnalise(new IndicateurPersonnaliseStorable(data))
      .then(storable => setValue(storable.meta['commentaire']));
  }

  return (
    <div className="CrossExpandPanel">
      <details>
        <summary>Commentaire</summary>
        <textarea
          value={value}
          onChange={handleChange}
          onBlur={handleSave}
          className="fr-input mt-2 w-4/5 bg-white p-3 border-b-2 border-gray-500 mr-5"
        />
      </details>
    </div>
  );
};

export const IndicateurPersonnaliseCardContent = (props: {
  indicateur: IndicateurPersonnaliseStorable;
}) => {
  return (
    <div>
      <IndicateurDescriptionPanel description={props.indicateur.description} />
      <IndicateurPersonnaliseCommentaire indicateur={props.indicateur} />

      <AnyIndicateurEditableExpandPanel
        store={indicateurPersonnaliseObjectifStore}
        indicateurUid={props.indicateur.uid}
        title="Objectifs"
      />
      <AnyIndicateurEditableExpandPanel
        store={indicateurPersonnaliseResultatStore}
        indicateurUid={props.indicateur.uid}
        title="Résultats"
      />

      <AnyIndicateurLineChartExpandable
        indicateur={props.indicateur}
        indicateurId={props.indicateur.uid}
        resultatStore={indicateurPersonnaliseResultatStore}
        objectifStore={indicateurPersonnaliseObjectifStore}
      />
    </div>
  );
};
