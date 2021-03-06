import {useEffect, useState} from 'react';
import {UtilisateurDroits} from 'generated/models/utilisateur_droits';
import {auth, currentUtilisateurDroits} from 'core-logic/api/authentication';
import {UtilisateurConnecteLocalStorable} from 'storables/UtilisateurConnecteStorable';
import {utilisateurConnecteStore} from 'core-logic/api/localStore';

export const useDroits = (): UtilisateurDroits[] => {
  const [droits, setDroits] = useState<UtilisateurDroits[]>([]);

  useEffect(() => {
    const listener = async () => {
      const droitsJson = droits.map(d => JSON.stringify(d));
      const currentJson = auth.currentUtilisateurDroits
        ? auth.currentUtilisateurDroits.map(d => JSON.stringify(d))
        : [];
      if (!currentJson.every(s => droitsJson.includes(s))) {
        setDroits(auth.currentUtilisateurDroits!);
      }
    };
    currentUtilisateurDroits();

    auth.addListener(listener);
    return () => {
      auth.removeListener(listener);
    };
  });

  return droits;
};

export const useUser = (): UtilisateurConnecteLocalStorable | null => {
  const [user, setUser] = useState<UtilisateurConnecteLocalStorable | null>(
    null
  );

  useEffect(() => {
    const listener = async () => {
      const storable = await utilisateurConnecteStore.retrieveById(
        UtilisateurConnecteLocalStorable.id
      );
      setUser(storable);
    };

    try {
      const retrieved = utilisateurConnecteStore.retrieveById(
        UtilisateurConnecteLocalStorable.id
      );
      if (retrieved.ademe_user_id !== user?.ademe_user_id) setUser(retrieved);
    } catch (_) {
      setUser(null);
    }

    utilisateurConnecteStore.addListener(listener);
    return () => {
      utilisateurConnecteStore.removeListener(listener);
    };
  }, [user]);

  return user;
};

export const useConnected = (): boolean => {
  return useUser() !== null;
};
