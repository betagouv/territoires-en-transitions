import {supabaseClient} from 'core-logic/api/supabase';
import {DcpRead} from 'generated/dataLayer/dcp_read';
import {NiveauAcces} from 'generated/dataLayer';

export const claimCollectivite = async (id: number): Promise<boolean> => {
  const {data, error} = await supabaseClient.rpc('claim_collectivite', {
    id,
  });

  if (error) {
    console.error(error);
    return false;
  }
  return !!data;
};

export type ReferentContact = {
  email: string;
  nom: string;
  prenom: string;
};

// renvoi le contact principal (fonctionne même si on est pas membre de la coll.)
export const getAdminContacts = async (
  collectivite_id: number
): Promise<ReferentContact[]> => {
  const {data, error} = await supabaseClient.rpc('referent_contacts', {
    id: collectivite_id,
  });

  if (error || !data) {
    return [];
  }
  return data as unknown as ReferentContact[];
};

export type PersonneList = {
  niveau_acces: NiveauAcces;
  personnes: DcpRead[];
};

export const userList = async (
  collectivite_id: number
): Promise<PersonneList[] | null> => {
  const {data, error} = await supabaseClient.rpc('collectivite_user_list', {
    id: collectivite_id,
  });

  if (error || !data) {
    return null;
  }
  return data as PersonneList[];
};

export interface RemoveUserResponse {
  message?: string;
}
export const removeUser = async (
  collectiviteId: number,
  userId: string
): Promise<RemoveUserResponse | null> => {
  const {data, error} = await supabaseClient.rpc(
    'remove_user_from_collectivite',
    {
      collectivite_id: collectiviteId,
      user_id: userId,
    }
  );

  if (error || !data) {
    return null;
  }
  return data as unknown as RemoveUserResponse;
};
