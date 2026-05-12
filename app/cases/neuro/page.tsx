export default function NeuroCasePage() {
  return (
    <main className="min-h-screen py-12 px-6 lg:px-20 bg-gray-50">
      <header className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Neuro Rehabilitation Cases
        </h1>
        <p className="text-lg text-gray-700">
          Dive into real examples of neurorehabilitation: stroke recovery, balance restabilization,
          and functional restoration.
        </p>
      </header>

      <section className="mt-10 space-y-8 max-w-4xl mx-auto">
        <article className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Case 1: Post-Stroke Hemiparesis
          </h2>
          <p className="text-gray-700 mb-4">
            Rehabilitation after a stroke focusing on retraining motor patterns, coordination
            exercises, and adaptive strategies for daily tasks.
          </p>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Neuromuscular retraining</li>
            <li>Balance & gait exercises</li>
            <li>Fine motor control tasks</li>
          </ul>
        </article>

        <article className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Case 2: Traumatic Brain Injury
          </h2>
          <p className="text-gray-700">
            Comprehensive neurorehabilitation integrating cognitive & physical strategies for long-term recovery.
          </p>
        </article>
      </section>
    </main>
  );
}
