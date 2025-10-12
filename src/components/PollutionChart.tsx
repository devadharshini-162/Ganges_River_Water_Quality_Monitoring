
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

interface Props {
  data: any[];
}

export default function PollutionChart({ data }: Props) {
  if (!data) return <div>Loading pollution data...</div>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="pollutionIndex" stroke="#ef4444" />
      </LineChart>
    </ResponsiveContainer>
  );
}
