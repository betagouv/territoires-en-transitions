begin;
select plan(21);

-- check que la fonction collectivite_membres retourne autant de membres que d'utilisateurs d'une collectivité
select ok(
        (select count(*) = 3 from collectivite_membres(1)),
        'La collectivité #1 a 3 membres');


-- make uid work as if yolododo user is connected
create or replace function auth.uid() returns uuid as
$$
select '17440546-f389-4d4f-bfdb-b0c94a1bd0f9'::uuid;
$$ language sql stable;

-- Test de la fonction update_collectivite_membre_details_fonction
------------------------------------------------------------------

-- Yolo peut modifier les informations de membre de Yili sur la collectivité #1 (car il a les accés admin)
select ok((
    select (update_collectivite_membre_details_fonction(1, '3f407fc6-3634-45ff-a988-301e9088096a', 'Nouveaux détails de la fonction') ->> 'message')::text = 'Le détail de la fonction du membre a été mise à jour.' ),
    'Yolo peut modifier les informations de membre de Yili sur la collectivité #1 (car il a les accés admin)'); 

select ok((select details_fonction = 'Nouveaux détails de la fonction' from private_collectivite_membre 
where collectivite_id = 1 and user_id = '3f407fc6-3634-45ff-a988-301e9088096a'), 
'Yolo a pu modifier les informations de membre de Yili sur la collectivité #1 (car il a les accés admin)');


-- Yolo ne peut pas modifier les informations de membre de Yili sur la collectivité #2 (car il n'a pas d'acces)
select ok((
    select (update_collectivite_membre_details_fonction(2, '3f407fc6-3634-45ff-a988-301e9088096a', 'Nouveaux détails de la fonction') ->> 'error')::text = 'Vous n''avez pas les droits pour modifier la fonction de ce membre.' ),
    'Yolo ne peut pas modifier les informations de membre de Yili sur la collectivité #2 (car il n''a pas d''acces)'); 


-- Yolo peut éditer ses propres informations de membre sur la collectivité #2 (même si pas admin)
select ok((
    select (update_collectivite_membre_details_fonction(2, '17440546-f389-4d4f-bfdb-b0c94a1bd0f9', 'Nouveaux détails de la fonction') ->> 'message')::text = 'Le détail de la fonction du membre a été mise à jour.' ),
    'Yolo peut éditer ses propres informations de membre sur la collectivité #2 (même si pas admin et même si celles-ci n''existent pas encore)'); 

select ok(exists(select details_fonction = 'Nouveaux détails de la fonction' from private_collectivite_membre  where collectivite_id = 2 and user_id = '17440546-f389-4d4f-bfdb-b0c94a1bd0f9' ),
'Yolo a pu créer ses propres informations de membre sur la collectivité #2 (même si pas admin)');



-- Test de la fonction update_collectivite_membre_fonction
-----------------------------------------------------------

-- Yolo peut modifier les informations de membre de Yili sur la collectivité #1 (car il a les accés admin)
select ok((
    select (update_collectivite_membre_fonction(1, '3f407fc6-3634-45ff-a988-301e9088096a', 'conseiller') ->> 'message')::text = 'La fonction du membre a été mise à jour.' ),
    'Yolo peut modifier les informations de membre de Yili sur la collectivité #1 (car il a les accés admin)'); 

select ok((select fonction = 'conseiller' from private_collectivite_membre 
where collectivite_id = 1 and user_id = '3f407fc6-3634-45ff-a988-301e9088096a'), 
'Yolo a pu modifier les informations de membre de Yili sur la collectivité #1 (car il a les accés admin)');


-- Yolo ne peut pas modifier les informations de membre de Yili sur la collectivité #2 (car il n'a pas d'acces)
select ok((
    select (update_collectivite_membre_fonction(2, '3f407fc6-3634-45ff-a988-301e9088096a', 'conseiller') ->> 'error')::text = 'Vous n''avez pas les droits pour modifier la fonction de ce membre.' ),
    'Yolo ne peut pas modifier les informations de membre de Yili sur la collectivité #2 (car il n''a pas d''acces)'); 


-- Yolo peut éditer ses propres informations de membre sur la collectivité #2 (même si pas admin)
select ok((
    select (update_collectivite_membre_fonction(2, '17440546-f389-4d4f-bfdb-b0c94a1bd0f9', 'conseiller') ->> 'message')::text = 'La fonction du membre a été mise à jour.' ),
    'Yolo peut éditer ses propres informations de membre sur la collectivité #2 (même si pas admin et même si celles-ci n''existent pas encore)'); 

select ok(exists(select fonction = 'conseiller' from private_collectivite_membre  where collectivite_id = 2 and user_id = '17440546-f389-4d4f-bfdb-b0c94a1bd0f9' ),
'Yolo a pu créer ses propres informations de membre sur la collectivité #2 (même si pas admin)');


-- Test de la fonction update_collectivite_champ_intervention
-------------------------------------------------------------

-- Yolo peut modifier les informations de membre de Yili sur la collectivité #1 (car il a les accés admin)
select ok((
    select (update_collectivite_membre_champ_intervention(1, '3f407fc6-3634-45ff-a988-301e9088096a', '{eci}') ->> 'message')::text = 'Le champ d''intervention du membre a été mise à jour.' ),
    'Yolo peut modifier les informations de membre de Yili sur la collectivité #1 (car il a les accés admin)'); 

select ok((select champ_intervention = '{eci}' from private_collectivite_membre 
where collectivite_id = 1 and user_id = '3f407fc6-3634-45ff-a988-301e9088096a'), 
'Yolo a pu modifier les informations de membre de Yili sur la collectivité #1 (car il a les accés admin)');


-- Yolo ne peut pas modifier les informations de membre de Yili sur la collectivité #2 (car il n'a pas d'acces)
select ok((
    select (update_collectivite_membre_champ_intervention(2, '3f407fc6-3634-45ff-a988-301e9088096a', '{eci}') ->> 'error')::text = 'Vous n''avez pas les droits pour modifier le champ d''intervention de ce membre.' ),
    'Yolo ne peut pas modifier les informations de membre de Yili sur la collectivité #2 (car il n''a pas d''acces)'); 


-- Yolo peut éditer ses propres informations de membre sur la collectivité #2 (même si pas admin)
select ok((
    select (update_collectivite_membre_champ_intervention(2, '17440546-f389-4d4f-bfdb-b0c94a1bd0f9', '{eci}') ->> 'message')::text = 'Le champ d''intervention du membre a été mise à jour.' ),
    'Yolo peut éditer ses propres informations de membre sur la collectivité #2 (même si pas admin et même si celles-ci n''existent pas encore)'); 

select ok(exists(select champ_intervention = '{eci}' from private_collectivite_membre  where collectivite_id = 2 and user_id = '17440546-f389-4d4f-bfdb-b0c94a1bd0f9' ),
'Yolo a pu créer ses propres informations de membre sur la collectivité #2 (même si pas admin)');


-- Test de la fonction update_collectivite_membre_niveau_acces
---------------------------------------------------------------

-- Yolo peut modifier les accès de membre de Yili sur la collectivité #1 (car il a les accés admin)
select ok((
    select (update_collectivite_membre_niveau_acces(1, '3f407fc6-3634-45ff-a988-301e9088096a', 'lecture') ->> 'message')::text = 'Le niveau d''acces du membre a été mise à jour.' ),
    'Yolo peut modifier les accés de membre de Yili sur la collectivité #1 (car il a les accés admin)'); 

select ok((select niveau_acces = 'lecture' from private_utilisateur_droit 
where collectivite_id = 1 and user_id = '3f407fc6-3634-45ff-a988-301e9088096a'), 
'Yolo a pu modifier les niveau d''acces du membre de Yili sur la collectivité #1 (car il a les accés admin)');

-- Yolo ne peut pas éditer ses niveaux d'accès sur la collectivité #2 (car pas admin)
select ok((
    select (update_collectivite_membre_niveau_acces(2, '17440546-f389-4d4f-bfdb-b0c94a1bd0f9', 'lecture') ->> 'error')::text = 'Vous n''avez pas les droits admin, vous ne pouvez pas éditer le niveau d''acces de ce membre.' ),
    'Yolo ne peut pas éditer ses niveaux d''accès sur la collectivité #2 (car pas admin)'); 


-- Test de la fonction remove_membre_from_collectivite
------------------------------------------------------
select ok((
    select (remove_membre_from_collectivite(1, '3f407fc6-3634-45ff-a988-301e9088096a') ->> 'message')::text = 'Les accès de l''utilisateur ont été supprimés.' ),
    'Yolo peut retirer les accés de membre de Yili sur la collectivité #1 (car il a les accés admin)'); 

select ok(exists(select active = false from private_utilisateur_droit  where collectivite_id = 1 and user_id = '3f407fc6-3634-45ff-a988-301e9088096a' ),
'Yolo a pu créer retirer les accés de membre de Yili sur la collectivité #1 (car il a les accés admin)');


rollback;