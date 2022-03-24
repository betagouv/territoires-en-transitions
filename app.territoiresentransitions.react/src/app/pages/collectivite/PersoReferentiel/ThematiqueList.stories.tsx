import {Story, Meta} from '@storybook/react';
import {ThematiqueList, TThematiqueListProps} from './ThematiqueList';

export default {
  component: ThematiqueList,
} as Meta;

const Template: Story<TThematiqueListProps> = args => (
  <ThematiqueList {...args} />
);

export const Exemple1 = Template.bind({});
Exemple1.args = {
  collectivite: {
    id: 1,
    nom: 'Grand Montauban',
  },
  items: [
    {
      id: 'dechets',
      nom: 'Déchets',
      perso_thematique_status: 'done',
    },
    {
      id: 'energie',
      nom: 'Énergie',
      perso_thematique_status: 'todo',
    },
    {
      id: 'mobilite',
      nom: 'Mobilité',
      perso_thematique_status: 'done',
    },
  ],
};
