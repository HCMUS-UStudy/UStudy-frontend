import React from "react";

interface CriteriaItem {
  id: string;
  label: string;
}

interface CriteriaGroup {
  title: string;
  items: CriteriaItem[];
}

interface Ratings {
  [criteriaId: string]: number;
}

interface ClassCriteriaReviewProps {
  criteria: CriteriaGroup[];
  ratings: Ratings;
  onRate: (criteriaId: string, rating: number) => void;
  renderStars: (
    value: number,
    onChange: (rating: number) => void,
  ) => React.ReactNode;
}

const ClassCriteriaReview: React.FC<ClassCriteriaReviewProps> = ({
  criteria,
  ratings,
  onRate,
  renderStars,
}) => {
  return (
    <div>
      {criteria.map((group, groupIdx) => (
        <div key={group.title} className="mb-8">
          <h3 className="text-lg font-semibold text-primary-darkest mb-4 flex items-center">
            <span className="w-8 h-8 rounded-lg bg-primary-lighter flex items-center justify-center text-primary-darkest flex-shrink-0 mr-3">
              {groupIdx + 1}
            </span>
            {group.title}
          </h3>
          <div className="space-y-4">
            {group.items.map((item, idx) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 w-full"
                style={{
                  transform: `translateY(${idx * 2}px)`,
                  opacity: 1 - idx * 0.05,
                }}
              >
                <div className="flex-1 w-full max-w-3xl">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center text-primary-darkest flex-shrink-0">
                      {groupIdx + 1}.{idx + 1}
                    </div>
                    <h4 className="font-medium text-gray-900">{item.label}</h4>
                  </div>
                  <p className="text-sm text-gray-500 ml-11">
                    Chọn mức độ hài lòng của bạn
                  </p>
                </div>
                <div className="flex-shrink-0">
                  {renderStars(ratings[item.id] || 0, (rating) =>
                    onRate(item.id, rating),
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClassCriteriaReview;
