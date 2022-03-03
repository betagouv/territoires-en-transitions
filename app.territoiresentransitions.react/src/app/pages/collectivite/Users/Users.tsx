import InvitationLink from './InvitationLink';
import {useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useCollectiviteId} from 'core-logic/hooks/params';
import {InvitationBloc} from 'core-logic/observables/invitationBloc';
import {
  PersonneList,
  userList,
  removeUser,
} from 'core-logic/api/procedures/collectiviteProcedures';
import {DcpRead} from 'generated/dataLayer/dcp_read';
//import MainContactForm from './MainContactForm';
import UserCard from './UserCard';

const activeUsersByRole = (
  users: PersonneList[] | null,
  name: string
): DcpRead[] | undefined =>
  users
    ?.find(({role_name}) => role_name === name)
    ?.personnes.filter(({deleted}) => !deleted);

const useUserList = () => {
  const [users, setUsers] = useState<PersonneList[] | null>(null);
  const collectivite_id = useCollectiviteId();

  const refetch = () => {
    if (collectivite_id) {
      userList(collectivite_id).then(setUsers);
    }
  };

  useEffect(() => {
    refetch();
  }, [collectivite_id]);

  const agents = activeUsersByRole(users, 'agent');
  const conseillers = activeUsersByRole(users, 'conseiller');
  const auditeurs = activeUsersByRole(users, 'auditeur');

  const removeFromCollectivite = (user_id: string) => {
    if (collectivite_id) {
      removeUser(collectivite_id, user_id).then(refetch);
    }
  };

  return {
    agents,
    conseillers,
    auditeurs,
    removeFromCollectivite,
  };
};
/**
 * Affiche la page listant les utilisateurs attachés à une collectivité
 * et le formulaire permettant d'envoyer des liens d'invitation
 */
const Users = observer(({invitationBloc}: {invitationBloc: InvitationBloc}) => {
  const {agents, conseillers, auditeurs, removeFromCollectivite} =
    useUserList();

  const onRemove = (user_id: string) => {
    if (
      confirm(
        'Etes-vous sûr de vouloir retirer cette utilisateur de la collectivité ?'
      )
    ) {
      removeFromCollectivite(user_id);
    }
  };

  return (
    <main className="fr-container mt-9 mb-16">
      <h1 className="fr-h1 mb-3 whitespace-nowrap mr-4">Collaboration</h1>

      <h2 className="fr-h2">Lien d'invitation</h2>
      <p>
        Envoyez ce lien aux personnes que vous souhaitez inviter à modifier les
        données de votre collectivité.
      </p>

      <InvitationLink
        link={invitationBloc.agentInvitationUrl}
        onGenerateLink={() => invitationBloc.generateInvitationId()}
      />

      {/* <h2 className="fr-h2 mt-4">Contact principal</h2>*/}
      {/* <p className="pb-4">*/}
      {/*   Ces informations sont affichées à toute personne qui demande accès à*/}
      {/*   votre collectivité.*/}
      {/* </p>*/}
      {/* <MainContactForm {...TMP_contactProps} />*/}

      <h2 className="fr-h2 mt-4">Liste des utilisateurs</h2>
      <p className="pb-4">
        Lorsque vous retirez un utilisateur, il ne pourra plus modifier les
        informations d’une collectivité.
      </p>
      {agents?.map(user => (
        <UserCard key={user.user_id} user={user} onRemove={onRemove} />
      ))}

      <h2 className="fr-h2 mt-4 pt-4">Liste des conseillers</h2>
      {conseillers?.map(user => (
        <UserCard key={user.user_id} user={user} />
      ))}

      <h2 className="fr-h2 mt-4 pt-4">Auditeur</h2>
      {auditeurs?.map(user => (
        <UserCard key={user.user_id} user={user} />
      ))}
    </main>
  );
});

export default Users;
