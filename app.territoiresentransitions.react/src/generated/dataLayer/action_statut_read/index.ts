// Code generated by jtd-codegen for TypeScript v0.2.1

export interface ActionStatutRead {
  action_id: string;
  avancement: 'pas_fait' | 'fait' | 'non_renseigne' | 'programme' | 'detaille';
  avancement_detaille: number[];
  concerne: boolean;
  collectivite_id: number;
  id: number;
  modified_at: string;
  modified_by: string;
}

export type ActionAvancement = ActionStatutRead['avancement'];
