import {supabase} from 'core-logic/api/supabase';

export const claimEpci = async (siren: String): Promise<boolean> => {
  const {data, error} = await supabase.rpc('claim_epci', {
    siren,
  });

  if (error) {
    console.error(error);
    return false;
  }
  return !!data;
};
