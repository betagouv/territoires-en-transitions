-- insert a fake statut.
-- depends on:
-- - insert_fake_epcis.sql
-- - insert_fake_referentiel.sql
-- - insert_fake_user.sql
insert into
    action_statut(epci_id, action_id, avancement, concerne, modified_by)
    values (1, 'cae_1', 'fait', true, '17440546-f389-4d4f-bfdb-b0c94a1bd0f9');

-- todo test
select * from action_statut;
select * from business_action_statut;
select * from client_action_statut;

-- fixme
select * from action_statut_log;
