import { getWorkStages } from '@/lib/data/work-stages';
import { WorkStagesClient } from './WorkStagesClient';

export default async function WorkStages() {
  const stages = await getWorkStages();

  // If no stages in DB, use fallback
  if (stages.length === 0) {
    const fallbackStages = [
      {
        id: '1',
        stage_number: '01',
        title: 'Start',
        description: 'We start by studying your project, taking all needed measurements and choosing style for it.'
      },
      {
        id: '2',
        stage_number: '02',
        title: 'Plan',
        description: 'Then, we process a point-by-point plan and present several examples for you.'
      },
      {
        id: '3',
        stage_number: '03',
        title: 'Visualization',
        description: 'At this stage we create detailed visualization for each room to provide you with an overall picture.'
      },
      {
        id: '4',
        stage_number: '04',
        title: 'Album',
        description: 'The design project album with all plans and visualizations is ready.'
      }
    ];
    return <WorkStagesClient stages={fallbackStages} />;
  }

  return <WorkStagesClient stages={stages} />;
}
