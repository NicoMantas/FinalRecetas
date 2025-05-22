'use client';

// This component will hold the main dashboard content from the HomePage
function HomeDashboardContent() {
  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-center items-center gap-4">
        <div className="text-xl font-bold text-orange-600">
          Welcome Reco Page
        </div>
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          <span>Icon</span> {/* Placeholder for an icon */}
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search for recipe and ingredients"
          className="flex-1 px-4 py-2 border rounded-lg shadow-sm"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Search
        </button>
      </div>

      {/* Challenge of the Day */}
      <div className="bg-orange-100 p-4 rounded-xl shadow text-center">
        <p className="text-gray-700 font-semibold">Challenge of Day</p>
        {/* You can add more details or a link to the challenge here */}
      </div>

      {/* Most Frequent Searches */}
      <div>
        <h2 className="text-center text-lg font-bold text-gray-800 mb-4">
          Searches Most Frequent This Week
        </h2>
        <div className="flex justify-center gap-4 flex-wrap">
          <button className="bg-purple-600 text-white px-4 py-1 rounded-full hover:bg-purple-700">
            Pastas
          </button>
          <button className="bg-purple-600 text-white px-4 py-1 rounded-full hover:bg-purple-700">
            Desserts
          </button>
          <button className="bg-purple-600 text-white px-4 py-1 rounded-full hover:bg-purple-700">
            Favourite
          </button>
          {/* Add more buttons or make them dynamic */}
        </div>
      </div>

      {/* Discover New Recipes */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Find out new Recipes"
          className="w-full px-4 py-2 border rounded-lg shadow-sm"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow p-2 text-center hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="w-full h-24 bg-gray-300 rounded-lg mb-2">
                {/* Placeholder for recipe image */}
              </div>
              <div className="text-sm font-medium text-gray-700">Name Food</div>
            </div>
          ))}
        </div>
      </div>

      {/* Description (Optional - can be removed or repurposed) */}
      <div>
        <input
          type="text"
          placeholder="Description About Page (Optional)"
          className="w-full px-4 py-2 border rounded-lg shadow-sm"
        />
      </div>
    </div>
  );
}

export default HomeDashboardContent; 