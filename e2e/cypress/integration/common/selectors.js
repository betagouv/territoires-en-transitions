/**
 * Sélecteurs d'éléments communs à toutes les pages
 */

export const Selectors = {
  header: {
    selector: 'header[role=banner]',
    children: {
      'Se connecter': '[data-test=signin]',
    },
  },
  footer: {
    selector: '#footer',
  },
  home: {
    selector: '[data-test=home]',
  },
  'le tableau de bord de la collectivité 1': {
    selector: '[data-test=TableauBord_1]',
  },
  'toutes les collectivités': {
    selector: '[data-test=ToutesLesCollectivites]',
  },
  'bouton support': {
    selector: '.crisp-client',
  },
  'formulaire de connexion': {
    selector: '[data-test=SignInPage]',
    children: {
      email: 'input[name=email]',
      mdp: 'input[name=password]',
      Valider: 'button[type=submit]',
      'Mot de passe oublié': '[data-test=forgotten-pwd]',
    },
  },
};
