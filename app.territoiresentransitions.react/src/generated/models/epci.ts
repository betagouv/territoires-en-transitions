export interface EpciInterface {
  uid: string;
  insee: string;
  siren: string;
  nom: string;
}

export class Epci {
  public static pathname = 'epci';
  get pathname(): string {
    return Epci.pathname;
  }
  uid: string;
  insee: string;
  siren: string;
  nom: string;

  /**
   * Creates a Epci instance.
   */
  constructor({
    uid,
    insee,
    siren,
    nom,
  }: {
    uid: string;
    insee: string;
    siren: string;
    nom: string;
  }) {
    this.uid = uid;
    this.insee = insee;
    this.siren = siren;
    this.nom = nom;
  }
  equals(other: EpciInterface | null): boolean {
    if (!other) return false;
    return (
      other.uid === this.uid &&
      other.insee === this.insee &&
      other.siren === this.siren &&
      other.nom === this.nom
    );
  }
}
