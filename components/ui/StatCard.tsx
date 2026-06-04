import Card from "./Card"

export default function StatCard({
  value,
  label,
}: {
  value: string
  label: string
}) {
  return (
    <Card className="text-center">
      <div className="text-3xl font-bold text-indigo-600">{value}</div>
      <div className="text-gray-600 mt-2">{label}</div>
    </Card>
  )
}