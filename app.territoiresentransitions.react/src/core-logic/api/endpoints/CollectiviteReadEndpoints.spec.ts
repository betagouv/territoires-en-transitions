import '@testing-library/jest-dom/extend-expect';
import {
  allCollectiviteReadEndpoint,
  elsesCollectiviteReadEndpoint,
  ownedCollectiviteReadEndpoint,
} from 'core-logic/api/endpoints/CollectiviteReadEndpoints';
import {supabaseClient} from 'core-logic/api/supabase';
import {MesCollectivitesRead} from 'generated/dataLayer/mes_collectivites_read';

import {
  collectivite1,
  collectivite2,
  yiliCredentials,
  yoloCredentials,
  yuluCredentials,
} from 'test_utils/collectivites';

describe('All Collectivite reading endpoint should retrieve 1628 Collectivites', () => {
  it('should retrieve all Collectivites sorted by nom if no arguments are given (for any connected user) ', async () => {
    await supabaseClient.auth.signIn(yuluCredentials); // Yulu has no rights on collectivite #1

    const results = await allCollectiviteReadEndpoint.getBy({}); // all

    expect(results.length).toBeGreaterThan(5000);
    expect(results[0].nom).toEqual('#Collectivité Test');
  });
});

describe('Elses Collectivite reading endpoint should retrieve only claimed Collectivite', () => {
  it("should retrieve else's active Collectivite (3) if no id is given", async () => {
    await supabaseClient.auth.signIn(yiliCredentials);
    const results = await elsesCollectiviteReadEndpoint.getBy({});
    expect(results).toHaveLength(3);
  });
});

describe('Owned Collectivite reading endpoint ', () => {
  it('should retrieve 2 Collectivites for Yolo (referent and agent)', async () => {
    await supabaseClient.auth.signIn(yoloCredentials);
    const results = await ownedCollectiviteReadEndpoint.getBy({});
    const expectedResults: MesCollectivitesRead[] = [
      {
        ...collectivite1,
        role_name: 'referent',
      },
      {
        ...collectivite2,
        role_name: 'agent',
      },
    ];
    expect(results.length).toEqual(2);
    expect(results).toEqual(expectedResults);
  });
  it('should retrieve 0 Collectivite for Yulu', async () => {
    await supabaseClient.auth.signIn(yuluCredentials);
    const results = await ownedCollectiviteReadEndpoint.getBy({});
    expect(results).toEqual([]);
  });
});
