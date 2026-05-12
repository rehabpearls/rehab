export default function SportsCasePage() {
  return (
    <main className="min-h-screen py-12 px-6 lg:px-20 bg-gray-50">
      <header className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Sports Rehabilitation Cases
        </h1>
        <p className="text-lg text-gray-700">
          Explore sports injury rehabilitation and performance recovery strategies for athletes
          and active individuals.
        </p>
      </header>

      <section className="mt-10 space-y-8 max-w-4xl mx-auto">
        <article className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Case 1: Ankle Sprain Recovery
          </h2>
          <p className="text-gray-700 mb-4">
            A common sports injury — focus on proprioception, strength, and safe return to play.
          </p>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>RICE & early mobility</li>
            <li>Balance & agility drills</li>
            <li>Sport-specific conditioning</li>
          </ul>
        </article>

        <article className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Case 2: Rotator Cuff Strain
          </h2>
          <p className="text-gray-700">
            Shoulder rehab using progressive strength training and functional movement retraining.
          </p>
        </article>
      </section>
    </main>
  );
}
