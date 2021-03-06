import {ActionReferentiel} from 'generated/models';
import {ActionReferentielScoreStorable} from 'storables';
import {useActionReferentielScore} from 'core-logic/hooks/actionReferentielScore';
import {useEffect, useState} from 'react';
import star from './star.png';
import {Tooltip} from '@material-ui/core';

const JaugeStar = (props: {fillPercentage: number}) => {
  const cacheStyle = {
    height: `${20 * (1 - props.fillPercentage / 100)}px`,
  };

  return (
    <div className="relative flex justify-center">
      <div className="bg-white opacity-70 w-5 absolute" style={cacheStyle} />
      <div className="">
        <img className="h-5 w-5" src={star} />
      </div>
    </div>
  );
};

export const CompletionStar = ({
  score,
  tooltipPlacement,
}: {
  score: ActionReferentielScoreStorable | null;
  tooltipPlacement: 'right' | 'left' | 'top' | 'bottom';
}) => {
  const [completion, setCompletion] = useState(0);
  useEffect(() => {
    setCompletion((score?.completion ?? 0) * 100);
  }, [score]);

  return (
    <Tooltip
      title={`Taux de remplissage : ${completion.toFixed()}%`}
      placement={tooltipPlacement}
    >
      <div>
        <JaugeStar fillPercentage={completion} />
      </div>
    </Tooltip>
  );
};

export const CurrentEpciCompletionStar = ({
  action,
  tooltipPlacement = 'right',
}: {
  action: ActionReferentiel;
  tooltipPlacement?: 'right' | 'left' | 'top' | 'bottom';
}) => {
  const storableId = ActionReferentielScoreStorable.buildId(action.id);
  const score = useActionReferentielScore(storableId);

  return <CompletionStar score={score} tooltipPlacement={tooltipPlacement} />;
};
