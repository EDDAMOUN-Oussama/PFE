import { useState, useEffect } from 'react';
import { useHealth } from '@/contexts/HealthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function GoalList() {
  const { goals, loadGoals, updateGoal, deleteGoal } = useHealth();
  const [editingId, setEditing] = useState<string | null>(null);
  const [values, setValues] = useState({ currentValue: 0 });

  useEffect(() => { loadGoals(); }, []);

  if (goals.length === 0) return <p>لا توجد أهداف لعرضها حتى الآن.</p>;

  return (
    <div>
      {goals.map(goal => (
        <div key={goal.id} className="mb-4 p-4 border rounded-lg">
          <h4 className="font-semibold capitalize">{goal.type}</h4>
          {editingId === goal.id ? (
            <div className="space-x-2">
              <Input
                type="number"
                value={values.currentValue}
                onChange={e => setValues({ currentValue: +e.target.value })}
              />
              <Button
                size="sm"
                onClick={() => {
                  updateGoal({ ...goal, currentValue: values.currentValue, progress: Math.round((values.currentValue/goal.target)*100) })
                    .then(() => { toast.success('تمّ التحديث'); setEditing(null); })
                    .catch(() => toast.error('خطأ'));
                }}
              >حفظ</Button>
              <Button variant="outline" size="sm" onClick={() => setEditing(null)}>إلغاء</Button>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <span>الحالي: {goal.currentValue} / الهدف: {goal.target}</span>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={() => { setEditing(goal.id); setValues({ currentValue: goal.currentValue }); }}>تعديل</Button>
                <Button variant="outline" size="sm" onClick={() => deleteGoal(goal.id).then(() => toast.success('تم الحذف')).catch(() => toast.error('خطأ'))}>🗑️ حذف</Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
