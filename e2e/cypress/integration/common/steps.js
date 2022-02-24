/// <reference types="Cypress" />

/**
 * Définitions de "steps" communes à tous les tests
 */

import { Selectors } from './selectors';
import { Expectations } from './expectations';
import { LocalSelectors as AuthSelectors } from '../01-se-connecter/selectors';

beforeEach(() => {
  cy.visit('/');
  // on attends que l'appli expose un objet `e2e` permettant de la contrôler
  cy.window({ log: false }).its('e2e.history').as('history');
  cy.window({ log: false }).its('e2e.authBloc').as('authBloc');
});

Given("j'ouvre le site", () => {
  cy.get(SignInPage.selector).should('be.visible');
});

const Users = {
  yolo: {
    email: 'yolo@dodo.com',
    password: 'yolododo',
  },
};
const SignInPage = AuthSelectors['formulaire de connexion'];
Given(/je suis connecté en tant que "([^"]*)"/, function (userName) {
  const u = Users[userName];
  assert(u, 'utilisateur non trouvé');
  cy.get('@authBloc').then((authBloc) => authBloc.connect(u));
  cy.get(SignInPage.selector).should('not.exist');
});

// Met en pause le déroulement d'un scénario.
// Associé avec le tag @focus cela permet de debugger facilement les tests.
Given('pause', () => cy.pause());

// utilitaire pour vérifier quelques attentes d'affichage génériques à partir d'une table de correspondances
export const checkExpectation = (selector, expectation, value) => {
  const c = Expectations[expectation];
  if (!c) return;
  if (typeof c === 'object' && c.cond) {
    cy.get(selector).should(c.cond, value || c.value);
  } else if (typeof c === 'function') {
    c(selector, value);
  } else {
    cy.get(selector).should(c, value);
  }
};

// renvoi le sélecteur local (ou à défaut le sélecteur global) correspondant à
// un nom d'élément dans la page
const resolveSelector = (context, elem) => {
  const s = context.LocalSelectors?.[elem] || Selectors[elem];
  assert(s, 'sélecteur non trouvé');
  return s;
};

// on utilise "function" (plutôt qu'une arrow function) pour que "this" donne
// accès au contexte de manière synchrone
// Ref: https://docs.cypress.io/guides/core-concepts/variables-and-aliases#Sharing-Context
Given(/la page vérifie les conditions suivantes/, function (dataTable) {
  const rows = dataTable.rows();
  cy.wrap(rows).each(([elem, expectation, value]) => {
    checkExpectation(resolveSelector(this, elem).selector, expectation, value);
  });
});
Given(
  /le "([^"]*)" vérifie les conditions suivantes/,
  function (parentName, dataTable) {
    const parent = resolveSelector(this, parentName);
    const rows = dataTable.rows();
    cy.wrap(rows).each(([elem, expectation, value]) => {
      checkExpectation(parent.children[elem], expectation, value);
    });
  }
);
Given(
  /le "([^"]*)" vérifie la condition "([^"]*)"/,
  function (elem, expectation) {
    checkExpectation(resolveSelector(this, elem).selector, expectation);
  }
);

function handleClickOnElement(subElement, elem) {
  const parent = resolveSelector(this, elem);
  cy.get(parent.selector).find(parent.children[subElement]).click();
}
Given(/je clique sur le bouton "([^"]*)" du "([^"]*)"/, handleClickOnElement);
Given(
  /je clique sur le bouton "([^"]*)" de la page "([^"]*)"/,
  handleClickOnElement
);

function fillFormWithValues(elem, dataTable) {
  const parent = resolveSelector(this, elem);
  cy.get(parent.selector).within(() => {
    const rows = dataTable.rows();
    cy.wrap(rows).each(([field, value]) => {
      cy.get(parent.children[field]).clear().type(value);
    });
  });
}
Given(/je remplis le "([^"]*)" avec les valeurs suivantes/, fillFormWithValues);

Given(/l'appel à "([^"]*)" va répondre "([^"]*)"/, function (name, reply) {
  const r = this.LocalMocks?.[name]?.[reply];
  assert(r, 'mock non trouvé');
  cy.intercept(...r).as(name);
});

Given('je clique en dehors de la boîte de dialogue', () =>
  cy.get('body').click(10, 10)
);
