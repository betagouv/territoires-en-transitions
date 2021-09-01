export interface IndicateurReferentielInterface {
  id: string;
  action_ids: string[];
  nom: string;
  description: string;
  thematique_id: string;
  unite: string;
}

export class IndicateurReferentiel {
  public static pathname = 'indicateur_referentiel';
  get pathname(): string {
    return IndicateurReferentiel.pathname;
  }
  id: string;
  action_ids: string[];
  nom: string;
  description: string;
  thematique_id: string;
  unite: string;

  /**
   * Creates a IndicateurReferentiel instance.
   */
  constructor({
    id,
    action_ids,
    nom,
    description,
    thematique_id,
    unite,
  }: {
    id: string;
    action_ids: string[];
    nom: string;
    description: string;
    thematique_id: string;
    unite: string;
  }) {
    this.id = id;
    this.action_ids = action_ids;
    this.nom = nom;
    this.description = description;
    this.thematique_id = thematique_id;
    this.unite = unite;
  }
}
