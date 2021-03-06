export interface UtilisateurInscriptionInterface {
  email: string;
  nom: string;
  prenom: string;
  vie_privee_conditions: string;
}

export class UtilisateurInscription {
  public static pathname = 'utilisateur_inscription';
  get pathname(): string {
    return UtilisateurInscription.pathname;
  }
  email: string;
  nom: string;
  prenom: string;
  vie_privee_conditions: string;

  /**
   * Creates a UtilisateurInscription instance.
   */
  constructor({
    email,
    nom,
    prenom,
    vie_privee_conditions,
  }: {
    email: string;
    nom: string;
    prenom: string;
    vie_privee_conditions: string;
  }) {
    this.email = email;
    this.nom = nom;
    this.prenom = prenom;
    this.vie_privee_conditions = vie_privee_conditions;
  }
  equals(other: UtilisateurInscriptionInterface | null): boolean {
    if (!other) return false;
    return (
      other.email === this.email &&
      other.nom === this.nom &&
      other.prenom === this.prenom &&
      other.vie_privee_conditions === this.vie_privee_conditions
    );
  }
}
