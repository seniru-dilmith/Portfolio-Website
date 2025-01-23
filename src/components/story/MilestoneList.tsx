import { milestones } from '@/components/story/milestones';
import Milestone from './Milestone';

const MilestoneList: React.FC = () => {
    return (
        <div className="space-y-8 md:space-y-12">
            {milestones.map((milestone, index) => (
                <Milestone
                    key={index}
                    milestone={milestone}
                    reverse={index % 2 === 0}
                />
            ))}
        </div>
    );
};

export default MilestoneList;
