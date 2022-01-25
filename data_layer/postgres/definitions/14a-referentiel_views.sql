create view action_children
as
with recursive
    actions_from_parents as
        -- +---------+-------------------+-----+
        -- |id       |parents            |depth|
        -- +---------+-------------------+-----+
        -- |eci_2.2.0|{eci,eci_2,eci_2.2}|3    |
        -- |eci_2.2.1|{eci,eci_2,eci_2.2}|3    |
        (
            -- Actions with no parent, our starting point
            select id, '{}'::action_id[] as parents, 0 as depth
            from action_relation
            where action_relation.parent is null

            union all

            -- Recursively find sub-actions and append them to the result-set
            select c.id, parents || c.parent, depth + 1
            from actions_from_parents p
                     join action_relation c
                          on c.parent = p.id
            where not c.id = any (parents)
        ),
    parent_child as
        -- +-----+-------+
        -- |p    |c      |
        -- +-----+-------+
        -- |cae  |cae_2  |
        -- |cae  |cae_6  |
        -- |cae_2|cae_2.1|
        (
            select parent.id as id, child.id as c
            from action_relation child
                     left join action_relation parent on parent.id = child.parent
        ),
    parent_children as
        -- +-------+-------------------------------------+
        -- |p      |children                             |
        -- +-------+-------------------------------------+
        -- |cae    |{cae_6,cae_1,cae_2,cae_4,cae_3,cae_5}|
        -- |cae_1  |{cae_1.1,cae_1.2,cae_1.3}            |
        -- |cae_1.1|{cae_1.1.2,cae_1.1.3,cae_1.1.1}      |
        (
            select id, array_agg(c) as children
            from parent_child
            group by id
        )
-- +---+-------------------------------------+-----+
-- |id |children                             |depth|
-- +---+-------------------------------------+-----+
-- |cae|{cae_4,cae_5,cae_2,cae_6,cae_1,cae_3}|0    |
-- |eci|{eci_2,eci_3,eci_4,eci_1,eci_5}      |0    |
select actions_from_parents.id                               as id,
       coalesce(parent_children.children, '{}'::action_id[]) as children,
       actions_from_parents.depth                            as depth
from actions_from_parents
         left join parent_children on actions_from_parents.id = parent_children.id
order by depth;


create or replace view action_definition_summary
as
select id,
       action_definition.referentiel,
       action_children.children,
       action_children.depth,
       coalesce(
               case
                   when referentiel = 'cae'
                       then ('{"axe", "sous-axe", "action", "sous-action", "tache"}'::action_type[])[action_children.depth]
                   else ('{"axe", "action", "sous-action", "tache"}'::action_type[])[action_children.depth]
                   end
           , 'referentiel') as type,
       identifiant,
       nom,
       description
from action_definition
         join action_children on action_id = action_children.id
order by action_id;
comment on view action_definition_summary is
    'The minimum information from definition';


create or replace function referentiel_down_to_action(
    referentiel referentiel
)
    returns setof action_definition_summary as
$$
declare
    referentiel_action_depth integer;
begin
    if referentiel_down_to_action.referentiel = 'cae'
    then
        select 3 into referentiel_action_depth;
    else
        select 2 into referentiel_action_depth;
    end if;
    return query
        select *
        from action_definition_summary
        where action_definition_summary.referentiel = referentiel_down_to_action.referentiel
          and action_definition_summary.depth < referentiel_action_depth;
end;
$$ language plpgsql;
comment on function referentiel_down_to_action is 'Returns referentiel action summary down to the action level';


create or replace function action_down_to_tache(
    referentiel referentiel,
    identifiant text
)
    returns setof action_definition_summary as
$$
declare
    referentiel_action_depth integer;
begin
    if action_down_to_tache.referentiel = 'cae'
    then
        select 3 into referentiel_action_depth;
    else
        select 2 into referentiel_action_depth;
    end if;
    return query
        select *
        from action_definition_summary
        where action_definition_summary.referentiel = action_down_to_tache.referentiel
          and action_definition_summary.identifiant like action_down_to_tache.identifiant || '%'
          and action_definition_summary.depth >= referentiel_action_depth - 1;
end
$$ language plpgsql;
comment on function action_down_to_tache is 'Returns referentiel action summary down to the tache level';



create or replace function action_exemples(
    id action_id,
    out id action_id,
    out exemples text
)
as
$$
select action_definition.action_id, action_definition.exemples
from action_definition
where action_definition.action_id = action_exemples.id
$$ language sql stable;
comment on function action_exemples is 'Returns action "exemples" text';
