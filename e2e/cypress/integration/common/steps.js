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
  cy.window({ log: false }).its('e2e.supabaseClient').as('supabaseClient');

  // bouchon pour la fonction window.open
  const stub = cy.stub().as('open');
  cy.on('window:before:load', (win) => {
    cy.stub(win, 'open').callsFake(stub);
  });
});

Given("j'ouvre le site", () => {
  cy.get('[data-test=home]').should('be.visible');
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
  cy.get('[data-test=logoutBtn]').should('be.visible');
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
    if (selector) {
      cy.get(selector).should(c, value);
    } else {
      cy.root().should(c, value);
    }
  }
};

// renvoi le sélecteur local (ou à défaut le sélecteur global) correspondant à
// un nom d'élément dans la page
export const resolveSelector = (context, elem) => {
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
    cy.get(parent.selector).within(() => {
      const rows = dataTable.rows();
      cy.wrap(rows).each(([elem, expectation, value]) => {
        checkExpectation(parent.children[elem], expectation, value);
      });
    });
  }
);
Given(/le "([^"]*)" vérifie la condition "([^"]*)"/, verifyExpectation);
Given(/^le "([^"]*)" est ([^"]*)$/, verifyExpectation);
Given(
  /^le bouton "([^"]*)" du "([^"]*)" est ([^"]*)$/,
  childrenVerifyExpectation
);
function verifyExpectation(elem, expectation) {
  checkExpectation(resolveSelector(this, elem).selector, expectation);
}
function childrenVerifyExpectation(elem, parentName, expectation) {
  const parent = resolveSelector(this, parentName);
  checkExpectation(`${parent.selector} ${parent.children[elem]}`, expectation);
}

function handleClickOnElement(subElement, elem) {
  const parent = resolveSelector(this, elem);
  cy.get(parent.selector).find(parent.children[subElement]).click();
}
Given(/je clique sur le bouton "([^"]*)" du "([^"]*)"/, handleClickOnElement);
Given(/je clique sur l'onglet "([^"]*)" du "([^"]*)"/, handleClickOnElement);
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

Given(/je sélectionne l'option "([^"]+)" dans le ([^"]+)/, selectOption);
function selectOption(value, elem) {
  // ouvre le composant Select
  const dropdown = resolveSelector(this, elem);
  cy.get(dropdown.selector).parent().click();
  // et sélectionne l'option voulue
  cy.get(dropdown.options[value]).click();
  // puis clique en dehors pour fermer la liste déroulante
  cy.get('body').click(10, 10);
}

Given(/je coche l'option "([^"]+)" dans le ([^"]+)/, checkOption);
function checkOption(value, elem) {
  const checkboxes = resolveSelector(this, elem);
  cy.get(`${checkboxes.selector} ${checkboxes.options[value]}`).click();
}

Given(/l'appel à "([^"]*)" va répondre "([^"]*)"/, function (name, reply) {
  const r = this.LocalMocks?.[name]?.[reply];
  assert(r, 'mock non trouvé');
  cy.intercept(...r).as(name);
});

Given('je clique en dehors de la boîte de dialogue', () =>
  cy.get('body').click(10, 10)
);
