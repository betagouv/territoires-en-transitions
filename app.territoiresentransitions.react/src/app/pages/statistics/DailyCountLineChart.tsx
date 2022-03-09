import {Line} from 'react-chartjs-2';
import type {ChartData, TooltipItem} from 'chart.js';
import 'chartjs-adapter-date-fns';
import {fr} from 'date-fns/locale';
import {DailyCount} from 'core-logic/api/statisticsApiEndpoints';
import {useMemo} from 'react';

// sépare les données par type de compteur (quotidien ou cumulés)
const byCountType = (
  res: {labels: Date[]; daily: number[]; cumul: number[]},
  {date, count, cumulated_count}: DailyCount
) => {
  const {labels, daily, cumul} = res;
  labels.push(new Date(date));
  daily.push(count);
  cumul.push(cumulated_count);
  return res;
};

const commonLineProps = {
  fill: false,
  borderWidth: 1,
  pointRadius: 2,
  pointHoverRadius: 3,
  tension: 0.2,
  spanGaps: true,
};

const getChartData = (dailyCounts: DailyCount[]): ChartData => {
  const color2 = '#247BC7';
  const color1 = '#033663';
  const {labels, daily, cumul} = dailyCounts.reduce(byCountType, {
    labels: [],
    daily: [],
    cumul: [],
  });

  return {
    labels,
    datasets: [
      {
        ...commonLineProps,
        label: 'Rattachements',
        data: daily,
        backgroundColor: color1,
        borderColor: color1,
      },
      {
        ...commonLineProps,
        label: 'Rattachements cumulés',
        data: cumul,
        backgroundColor: color2,
        borderColor: color2,
      },
    ],
  };
};

export type TDailyCountLineChartProps = {
  widthPx: number;
  dailyCounts: DailyCount[];
};

export const DailyCountLineChart = (props: TDailyCountLineChartProps) => {
  const {widthPx, dailyCounts} = props;

  const data = useMemo(() => getChartData(dailyCounts), [dailyCounts]);
  const labels = data.labels as Date[];

  return (
    <div style={{width: widthPx, marginLeft: 0}}>
      <div className="font-semibold text-center text-xl">
        Rattachements utilisateur/collectivité
      </div>
      <Line
        className="py-5"
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {display: true, position: 'bottom'},
            tooltip: {
              callbacks: {
                label: ({raw, dataset}: TooltipItem<'line'>) => {
                  return `${dataset.label} : ${raw}`;
                },
                title: tooltipItems => {
                  const [item] = tooltipItems;
                  return labels[item.dataIndex].toLocaleDateString();
                },
              },
            },
          },
          scales: {
            y: {
              title: {
                display: true,
                text: "Nombre d'utilisateurs rattachés à une collectivité",
              },
              min: 0,
            },

            x: {
              type: 'time',
              adapters: {
                date: {
                  locale: fr,
                },
              },
              time: {
                unit: 'month',
              },
            },
          },
        }}
      />
    </div>
  );
};
