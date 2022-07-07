export const Views = {
  defaultRoute: '/',
  home: {
    selector: '[data-test=home]',
  },
  'toutes les collectivités': {
    route: '/toutes_collectivites',
    selector: '[data-test=ToutesLesCollectivites]',
  },
  'Mes collectivités': {
    route: '/mes_collectivites',
    selector: '[data-test=CurrentUserCollectivites]',
  },
};

export const CollectivitePages = {
  'Gestion des membres': {
    route: 'users',
    selector: '[data-test=Users]',
  },
};
