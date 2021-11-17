import React from 'react';
import '../CrossExpandPanel.css';
import {makeAutoObservable} from 'mobx';
import {actionCommentaireRepository} from 'core-logic/api/repositories/ActionCommentaireRepository';
import {observer} from 'mobx-react-lite';

export const ActionCommentaire = ({actionId}: {actionId: string}) => {
  const epciId = 1; // TODO !
  const observable = new ActionCommentaireFieldObservable({actionId, epciId});
  return (
    <div className={' border-gray-300'}>
      <div className="CrossExpandPanel">
        <details>
          <summary className="title">Commentaire</summary>
          <ActionCommentaireField observable={observable} />
        </details>
      </div>
    </div>
  );
};

const ActionCommentaireField = observer(
  ({observable}: {observable: ActionCommentaireFieldObservable}) => (
    <textarea
      value={observable.fieldValue}
      onChange={event => observable.setFieldValue(event.currentTarget.value)}
      onBlur={_ => observable.saveFieldValue()}
      className="fr-input mt-2 w-full bg-white p-3 mr-5"
    />
  )
);

class ActionCommentaireFieldObservable {
  private readonly epciId: number;
  private readonly actionId: string;
  fieldValue = '';

  constructor({actionId, epciId}: {epciId: number; actionId: string}) {
    makeAutoObservable(this);
    this.epciId = epciId;
    this.actionId = actionId;
    this.fetch();
  }

  setFieldValue(fieldValue: string) {
    this.fieldValue = fieldValue;
  }

  saveFieldValue() {
    actionCommentaireRepository.save({
      action_id: this.actionId,
      epci_id: this.epciId,
      commentaire: this.fieldValue,
    });
  }

  fetch() {
    actionCommentaireRepository
      .fetch({
        epciId: this.epciId,
        actionId: this.actionId,
      })
      .then(fetched => {
        this.setFieldValue(fetched?.commentaire ?? '');
      });
  }

  private listenToFieldValueChanges() {
    this._fieldValueToSave;
  }

  onMount() {
    this.listenToFieldValueChanges();
    this.fetch();
  }

  dispose() {
    this._commentaire.unsubscribe();
    this._fieldValueToSave.unsubscribe();
  }
}
