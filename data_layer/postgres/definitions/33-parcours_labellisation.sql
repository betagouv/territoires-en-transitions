create or replace function
    labellisation_parcours(collectivite_id integer)
    returns table
            (
                referentiel            referentiel,
                etoiles                labellisation.etoile,
                completude_ok          boolean,
                critere_score          jsonb,
                criteres_action        jsonb,
                rempli                 boolean,
                calendrier             text,
                derniere_demande       jsonb,
                derniere_labellisation jsonb
            )
as
$$
with criteres as (select *
                  from (select c.referentiel,
                               bool_and(c.atteint) as atteints,
                               jsonb_agg(
                                       jsonb_build_object(
                                               'formulation', formulation,
                                               'action_id', c.action_id,
                                               'rempli', c.atteint,
                                               'action_identifiant', ad.identifiant,
                                               'statut_ou_score',
                                               case
                                                   when c.min_score_realise = 100 and c.min_score_programme is null
                                                       then 'Fait'
                                                   when c.min_score_realise = 100 and c.min_score_programme = 100
                                                       then 'Programmé ou fait'
                                                   when c.min_score_realise is not null and c.min_score_programme is null
                                                       then c.min_score_realise || '% fait minimum'
                                                   else c.min_score_realise || '% fait minimum ou ' ||
                                                        c.min_score_programme || '% programmé minimum'
                                                   end
                                           )
                                   )               as liste
                        from labellisation.criteres(labellisation_parcours.collectivite_id) c
                                 join action_definition ad on c.action_id = ad.action_id
                        group by c.referentiel) ral)
select e.referentiel,
       e.etoile_objectif,
       rs.complet                             as completude_ok,

       jsonb_build_object(
               'score_a_realiser', cs.score_a_realiser,
               'score_fait', cs.score_fait,
               'atteint', cs.atteint,
               'etoiles', cs.etoile_objectif) as critere_score,

       criteres.liste                         as criteres_action,
       criteres.atteints and cs.atteint and cf.atteint       as rempli,
       calendrier.information,

       case
           when demande.etoiles is null
               then null
           else jsonb_build_object('demandee_le', demande.date, 'etoiles', demande.etoiles)
           end                                as derniere_demande,

       case
           when obtention.etoiles is null
               then null
           else jsonb_build_object('obtenue_le', obtention.date, 'etoiles', obtention.etoiles)
           end                                as derniere_labellisation

from labellisation.etoiles(labellisation_parcours.collectivite_id) as e
         join criteres on criteres.referentiel = e.referentiel
         left join labellisation.referentiel_score(labellisation_parcours.collectivite_id) rs
                   on rs.referentiel = e.referentiel
         left join labellisation.critere_score(labellisation_parcours.collectivite_id) cs
                   on cs.referentiel = e.referentiel
         left join labellisation.critere_fichier(labellisation_parcours.collectivite_id) cf
                   on cf.referentiel = e.referentiel
         left join labellisation_calendrier calendrier
                   on calendrier.referentiel = e.referentiel
         left join lateral (select ld.date, ld.etoiles
                            from labellisation_demande ld
                            where ld.collectivite_id = labellisation_parcours.collectivite_id
                              and ld.referentiel = e.referentiel) demande on true
         left join lateral (select l.obtenue_le as date, l.etoiles
                            from labellisation l
                            where l.collectivite_id = labellisation_parcours.collectivite_id
                              and l.referentiel = e.referentiel) obtention on true

$$
    language sql security definer;
comment on function labellisation_parcours is
    'Renvoie le parcours de labellisation de chaque référentiel pour une collectivité donnée.';