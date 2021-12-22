import '@testing-library/jest-dom/extend-expect';
import {indicateurCommentaireReadEndpoint} from 'core-logic/api/endpoints/indicateurCommentaireReadEndpoint';

describe('Indicateur-commentaire reading endpoint ', () => {
  it('should retrieve data-layer default commentaire for collectivite #1 ', async () => {
    const results = await indicateurCommentaireReadEndpoint.getBy({
      collectivite_id: 1,
    });

    expect(results).toHaveLength(1);
    const partialExpectedReadCommentaire = {
      collectivite_id: 1,
      commentaire: 'un commentaire sur cae_8',
      indicateur_id: 'cae_8',
    };
    expect(results[0]).toEqual(
      expect.objectContaining(partialExpectedReadCommentaire)
    );
  });
  it('should retrieve 0 commentaire for collectivite #2 ', async () => {
    const results = await indicateurCommentaireReadEndpoint.getBy({
      collectivite_id: 2,
    });
    expect(results.length).toEqual(0);
  });
});
2;
