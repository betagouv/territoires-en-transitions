export interface UtilisateurInterface {
  ademe_user_id: string;
  vie_privee: string;
}

export class Utilisateur {
  public static pathname = 'utilisateur';
  get pathname(): string {
    return Utilisateur.pathname;
  }
  ademe_user_id: string;
  vie_privee: string;

  /**
   * Creates a Utilisateur instance.
   */
  constructor({
    ademe_user_id,
    vie_privee,
  }: {
    ademe_user_id: string;
    vie_privee: string;
  }) {
    this.ademe_user_id = ademe_user_id;
    this.vie_privee = vie_privee;
  }
  equals(other: UtilisateurInterface | null): boolean {
    if (!other) return false;
    return (
      other.ademe_user_id === this.ademe_user_id &&
      other.vie_privee === this.vie_privee
    );
  }
}
