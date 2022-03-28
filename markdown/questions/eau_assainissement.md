# La collectivité a-t-elle la compétence "Traitement, adduction et distribution de l'eau" ?
```yaml
id: eau_1
type: binaire
thematique_id: eau_assainissement
actions: [cae_3.3.1]
```

# La collectivité a-t-elle la compétence "assainissement collectif" ?
```yaml
id: assainissement_1
type: binaire
thematique_id: eau_assainissement
actions: [cae_3.3.2, cae_3.3.3]
```

# La collectivité a-t-elle la compétence "assainissement non collectif" ?
```yaml
id: assainissement_2
type: binaire
thematique_id: eau_assainissement
actions: [cae_3.3.3]
```

# En cas de compétence partagée ou variable sur le territoire pour la compétence assainissement, quelle est la part des communes ayant délégué leur compétence assainissement ?
```yaml
id: assainissement_3
type: proportion
thematique_id: eau_assainissement
actions: [cae_3.3.3]
types_concernes: [EPCI]
```

# Existe-t-il un potentiel de valorisation énergétique (méthanisation ou récupération de chaleur) attesté par une étude portant sur la totalité du périmètre d’assainissement ?
```yaml
id: assainissement_4
type: binaire
thematique_id: eau_assainissement
actions: [cae_3.3.2]
```