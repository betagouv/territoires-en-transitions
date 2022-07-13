import {
  claimCollectivite,
  getAdminContacts,
  userList,
} from 'core-logic/api/procedures/collectiviteProcedures';
import {supabaseClient} from 'core-logic/api/supabase';
import {yiliCredentials, yoloCredentials} from 'test_utils/collectivites';

describe('Claim and remove collectivite Remote Procedure Call ', () => {
  it('should return true when user is first to claim this collectivite', async () => {
    // TODO : test me in the data-layer. The following test CANNOT be run more than once ...
    // await supabaseClient.auth.signIn(yiliCredentials);
    // const procedureResponse = await claimCollectivite(20);
    // expect(procedureResponse).toBe(true);
  });
  it('should return false when user is not first to claim this collectivite ', async () => {});
  it('should be able to remove its own rights from an collectivite ', async () => {});
});

describe('Request referent contacts', () => {
  it('should return all referent contacts of owned collectivite if exists', async () => {
    const procedureResponse = await getAdminContacts(1);
    expect(procedureResponse).not.toBeNull();
    expect(procedureResponse).toEqual([
      {
        prenom: 'Yolo',
        nom: 'Dodo',
        email: 'yolo@dodo.com',
      },
    ]);
  });
  it('should return an empty list if no referent yet', async () => {
    const procedureResponse = await getAdminContacts(40);
    expect(procedureResponse).toBeDefined();
    expect(procedureResponse).toHaveLength(0);
  });
});

describe('Request collectivité user list', () => {
  it('should return a user list containing referent and auditeur', async () => {
    await supabaseClient.auth.signIn(yoloCredentials);
    const procedureResponse = await userList(1);
    expect(procedureResponse).not.toBeNull();
    const admins = procedureResponse!.filter(l => l.niveau_acces === 'admin');
    expect(admins.length).toEqual(1);

    const partialReferent = {
      prenom: 'Yolo',
      nom: 'Dodo',
      email: 'yolo@dodo.com',
    };
    expect(admins[0].personnes).toEqual(
      expect.arrayContaining([expect.objectContaining(partialReferent)])
    );

    const auditeurs = procedureResponse!.filter(
      l => l.niveau_acces === 'admin'
    );
    expect(auditeurs.length).toEqual(1);

    const partialAuditeur = {
      prenom: 'Yala',
      nom: 'Dada',
      email: 'yala@dada.com',
    };
    expect(auditeurs[0].personnes).toEqual(
      expect.arrayContaining([expect.objectContaining(partialAuditeur)])
    );
  });
});
