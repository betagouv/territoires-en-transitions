import '@testing-library/jest-dom/extend-expect';
import {actionCommentaireReadEndpoint} from 'core-logic/api/endpoints/ActionCommentaireReadEndpoint';

describe('Action-commentaire reading endpoint ', () => {
  it('should retrieve data-layer default commentaire for collectivite #1 ', async () => {
    const results = await actionCommentaireReadEndpoint.getBy({
      collectivite_id: 1,
    });

    expect(results.length).toBeGreaterThanOrEqual(1);
    const partialExpectedReadCommentaire = {
      collectivite_id: 1,
      commentaire: 'un commentaire',
      action_id: 'cae_1.2.3',
    };
    expect(results[0]).toEqual(
      expect.objectContaining(partialExpectedReadCommentaire)
    );
  });
  it('should retrieve 0 commentaire for collectivite #2 ', async () => {
    const results = await actionCommentaireReadEndpoint.getBy({
      collectivite_id: 2,
    });
    expect(results.length).toEqual(0);
  });
});
2;
