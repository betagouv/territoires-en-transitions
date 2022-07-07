import {useEffect, useState} from 'react';
import {useRouteMatch} from 'react-router-dom';
import {supabaseClient} from 'core-logic/api/supabase';
import {useAuth} from 'core-logic/api/auth/AuthProvider';
import {invitationLandingPath} from 'app/paths';

type TInvitationState =
  | 'empty' // aucune invitation en cours
  | 'waitingForLogin' // invitation en attente de login
  | 'waitingForAcceptation' // invitation en cours d'acceptation par l'utilisateur loggué
  | 'rejected' // invitation rejetée
  | 'accepted'; // invitation acceptée

// gère l'état associé à un lien d'invitation
export const useInvitationState = () => {
  // extrait l'id d'invitation de l'url si il est présent
  const match = useRouteMatch<{invitationId: string}>(invitationLandingPath);
  const idFromURL = match?.params?.invitationId || null;

  // état de l'auth.
  const {isConnected} = useAuth();

  // état local
  const [invitationId, setInvitationId] = useState<string | null>(idFromURL);
  const [invitationState, setInvitationState] = useState<TInvitationState>(
    getInitialState(isConnected, idFromURL)
  );

  // cache l'identifiant détecté dans l'url
  if (idFromURL && idFromURL !== invitationId) {
    setInvitationId(idFromURL);
    setInvitationState(getInitialState(isConnected, idFromURL));
  }

  // réagit aux changements d'état connecté/déconnecté
  useEffect(() => {
    if (invitationId) {
      // l'utilisateur s'est connecté et il a une invitation en attente
      if (isConnected && invitationState === 'waitingForLogin') {
        setInvitationState('waitingForAcceptation');
      } else if (isConnected && invitationState === 'waitingForAcceptation') {
        // fait l'appel RPC pour accepter l'invitation
        acceptAgentInvitation(invitationId).then(accepted => {
          // et change l'état local en fonction du retour
          setInvitationState(accepted ? 'accepted' : 'rejected');
        });
      } else if (!isConnected && invitationState === 'empty') {
        setInvitationState('waitingForLogin');
      }
    }
  }, [isConnected, invitationId]);

  return {invitationId, invitationState};
};

const acceptAgentInvitation = async (
  invitation_id: string
): Promise<boolean> => {
  const {error} = await supabaseClient.rpc('accept_invitation', {
    invitation_id,
  });

  return error === null;
};

const getInitialState = (
  isConnected: boolean,
  invitationId: string | null
): TInvitationState => {
  if (!invitationId) {
    return 'empty';
  }
  return isConnected ? 'waitingForAcceptation' : 'waitingForLogin';
};