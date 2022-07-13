import {action} from '@storybook/addon-actions';
import {Header} from './Header';
import {CurrentCollectivite} from 'core-logic/hooks/useCurrentCollectivite';
import {MesCollectivitesRead} from 'generated/dataLayer';

export default {
  component: Header,
};

const authDisconnected = {
  isConnected: false,
  user: null,
  authError: null,
  connect: action('connect'),
  disconnect: action('disconnect'),
};

const authConnected = {
  ...authDisconnected,
  isConnected: true,
  user: {prenom: 'Émeline'},
};

const readonlyCollectivite: CurrentCollectivite = {
  nom: 'Test collectivite',
  collectivite_id: 1,
  niveau_acces: null,
  isReferent: false,
  readonly: true,
};

const currentCollectivite: CurrentCollectivite = {
  nom: 'Test collectivite',
  collectivite_id: 1,
  niveau_acces: 'admin',
  isReferent: true,
  readonly: false,
};

const ownedCollectivites: MesCollectivitesRead[] = [
  currentCollectivite,
  {
    nom: 'Collectivité 2',
    collectivite_id: 2,
    niveau_acces: null,
    isReferent: false,
    readonly: false,
  },
  {
    nom: 'Collectivité 3 avec un nom très long sur deux lignes',
    collectivite_id: 3,
    niveau_acces: null,
    isReferent: false,
    readonly: false,
  },
];

export const NotConnected = () => (
  <Header
    auth={authDisconnected}
    currentCollectivite={null}
    ownedCollectivites={null}
  />
);

export const Connected = () => (
  <Header
    auth={authConnected}
    currentCollectivite={null}
    ownedCollectivites={null}
  />
);

export const WithCollectivite = () => (
  <Header
    auth={authConnected}
    currentCollectivite={currentCollectivite}
    ownedCollectivites={[currentCollectivite]}
  />
);

export const WithReadonlyCollectivite = () => (
  <Header
    auth={authConnected}
    currentCollectivite={readonlyCollectivite}
    ownedCollectivites={ownedCollectivites}
  />
);
